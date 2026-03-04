const fs = require('fs');
const path = require('path');
const { pipeline } = require('@xenova/transformers');

let embedder = null;

// --- SEMANTIC SEARCH PIPELINE ---

async function initSemanticSearch() {
  try {
    console.log("[SEMANTIC SEARCH] Initializing vector model (this may take 1-2 mins on first run to download the model)...");
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log("[SEMANTIC SEARCH] Model loaded! Starting background vector generation for dataset...");

    // Background generation so it doesn't block the server boot
    setTimeout(async () => {
      const master = loadMasterDataset();
      if (!master || master.length === 0) return;

      let count = 0;
      const start = Date.now();
      for (const item of master) {
        if (!item.vector && item.description) {
          try {
            const output = await embedder(String(item.description), { pooling: 'mean', normalize: true });
            item.vector = Array.from(output.data);
            count++;
          } catch (e) { }
        }
      }
      const time = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`[SEMANTIC SEARCH] Generated ${count} new vectors for dataset in ${time} seconds.`);
    }, 1000);
  } catch (err) {
    console.error("[SEMANTIC SEARCH] Failed to initialize model:", err);
  }
}

async function getEmbedding(text) {
  if (!embedder) return null;
  try {
    const output = await embedder(String(text), { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  } catch (e) {
    console.error("Embedding generation failed", e);
    return null;
  }
}

function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// --- STRICT INTERPRETATION PIPELINE ---

// 1. Differentiate Goods (HSN) vs Services (SAC)
function detectQueryDomain(query) {
  const q = String(query || '').toLowerCase();
  const serviceKeywords = [
    'service', 'services', 'consulting', 'maintenance', 'subscription',
    'saas', 'support', 'licensing', 'implementation', 'amc', 'repair',
    'installation', 'training', 'rental', 'leasing', 'freight', 'transport',
    'software development', 'hosting', 'cleaning', 'accounting', 'legal'
  ];
  return serviceKeywords.some(word => q.includes(word)) ? 'SAC' : 'HSN';
}

function isHSNCode(input) {
  return /^\d{4,8}$/.test(String(input || '').trim());
}

// 2. Product-Class Detection (Hard separation to prevent cross-category noise)
const PRODUCT_CLASSES = {
  pipes_tubes: ['pipe', 'tube', 'hose', 'hollow profile', 'piping', 'tubing'],
  sheets_plates: ['sheet', 'plate', 'flat', 'slab'],
  rods_bars: ['rod', 'bar', 'wire', 'profile'],
  fittings: ['fitting', 'valve', 'flange', 'coupling', 'joint', 'elbow', 'tee', 'reducer'],
  fasteners: ['bolt', 'nut', 'screw', 'washer', 'rivet', 'nail', 'fastener'],
  machinery: ['machine', 'motor', 'pump', 'engine', 'generator', 'compressor'],
  electronics: ['circuit', 'board', 'cable', 'wire', 'switch', 'relay', 'sensor'],
  textiles: ['fabric', 'yarn', 'thread', 'garment', 'clothing', 'apparel', 'cotton', 'silk'],
  scrap_waste: ['scrap', 'waste', 'slag', 'ash', 'residue', 'turnings', 'shavings']
};

function detectProductClass(query) {
  const q = String(query || '').toLowerCase();
  const detected = new Set();

  for (const [className, keywords] of Object.entries(PRODUCT_CLASSES)) {
    if (keywords.some(kw => q.includes(kw))) {
      detected.add(className);
    }
  }
  return Array.from(detected);
}

// 3. Material Detection (Apply ranking boosts)
const MATERIALS = {
  steel: ['steel', 'stainless', 'carbon steel', 'alloy steel', 'galvanized'],
  iron: ['iron', 'cast iron', 'pig iron', 'wrought iron'],
  copper_brass: ['copper', 'brass', 'bronze'],
  aluminum: ['aluminum', 'aluminium'],
  plastics: ['pvc', 'hdpe', 'upvc', 'cpvc', 'ptfe', 'plastic', 'polymer', 'acrylic', 'nylon'],
  rubber: ['rubber', 'silicone', 'elastomer'],
  wood: ['wood', 'timber', 'plywood', 'veneer', 'mdf'],
  glass: ['glass', 'crystal'],
};

function detectMaterial(query) {
  const q = String(query || '').toLowerCase();
  const detected = new Set();

  for (const [matName, keywords] of Object.entries(MATERIALS)) {
    if (keywords.some(kw => q.includes(kw))) {
      detected.add(matName);
      // add the specific keyword found to help with localized boosting
      keywords.filter(kw => q.includes(kw)).forEach(kw => detected.add(kw));
    }
  }
  return Array.from(detected);
}

// 4. Query Specificity Scoring (Broad groupings vs Refined results)
function analyzeQuerySpecificity(query, detectedClasses, detectedMaterials) {
  const q = String(query || '').trim();
  const words = q.split(/\s+/).filter(Boolean);

  let score = 0;
  // Length adds slight specificity
  if (words.length > 2) score += 1;
  if (words.length > 4) score += 1;

  // Having both a material and a class is highly specific (e.g. "PVC pipe")
  if (detectedClasses.length > 0) score += 2;
  if (detectedMaterials.length > 0) score += 2;

  // Measurements add extreme specificity (e.g. "2 inch", "5mm")
  if (/\d+(mm|cm|inch|"|'|kg|g|ml|l|m|v|w|a)/i.test(q)) score += 3;
  if (/\b(grade|type)\s+[a-z0-9]+/i.test(q)) score += 2; // "grade 304"

  if (score >= 5) return 'HIGHLY_SPECIFIC';
  if (score >= 2) return 'SPECIFIC';
  return 'VAGUE';
}

const STOPWORDS = new Set(['the', 'and', 'for', 'with', 'that', 'from', 'are', 'use', 'used', 'in', 'of', 'or', 'a', 'an', 'to', 'is', 'by', 'on', 'other', 'parts', 'thereof']);

function extractKeywordsFromDescription(desc, limit = 5) {
  if (!desc) return [];
  // Use trade terminology and meaningful words
  const words = String(desc).toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(Boolean);
  const freq = {};
  for (const w of words) {
    if (STOPWORDS.has(w)) continue;
    if (w.length <= 2 && !/^\d+$/.test(w)) continue; // Keep numbers, discard tiny words
    freq[w] = (freq[w] || 0) + 1;
  }
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).map(a => a[0]);
  return sorted.slice(0, limit);
}

// 5. Replace percentage confidence with strict HIGH/MEDIUM/LOW
function mapScoreToRelevance(score, isExactCodeMatch = false) {
  if (isExactCodeMatch) return 'EXACT_MATCH';
  if (score === undefined || score === null) return 'LOW';

  // Note: Score here is custom calculated in find endpoint (0 to 100 scale ideally)
  if (score >= 80) return 'HIGH';
  if (score >= 50) return 'MEDIUM';
  return 'LOW';
}

function loadMasterDataset() {
  try {
    if (global.__MASTER_CACHE && Array.isArray(global.__MASTER_CACHE) && global.__MASTER_CACHE.length > 0) {
      return global.__MASTER_CACHE;
    }

    const candidates = [
      path.join(process.cwd(), 'src', 'app', 'data', 'master_gst_data.json'),
      path.join(process.cwd(), 'src', 'data', 'master_gst_data.json'),
      path.join(process.cwd(), '..', 'src', 'app', 'data', 'master_gst_data.json'),
      path.join(process.cwd(), '..', 'src', 'data', 'master_gst_data.json')
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        const txt = fs.readFileSync(p, 'utf8');
        const arr = JSON.parse(txt);

        // Defensive structure validation
        const validArr = Array.isArray(arr) ? arr.filter(item => item && item.code && item.description) : [];
        if (validArr.length > 0) {
          global.__MASTER_CACHE = validArr;
          return global.__MASTER_CACHE;
        }
      }
    }
    console.warn("CLASSIFICATION WARNING: Master dataset could not be loaded or is empty.");
    return [];
  } catch (e) {
    console.error('CLASSIFICATION ERROR: failed to load master_gst_data.json\n', e.stack);
    return [];
  }
}

// 6. Hard filtering before probabilistic ranking
function hardFilterDataset(dataset, domain, targetClasses) {
  try {
    let filtered = Array.isArray(dataset) ? dataset : [];

    // Filter by Domain (Goods vs Services)
    // Removed strict domain filter. Since master_gst_data.json only has goods,
    // queries for "services" would return 0 results if we strictly filtered for SAC.
    // Allow vector semantic search to just find the closest match.

    // Filter by Product Class (Strict inclusions and exclusions)
    if (targetClasses && targetClasses.length > 0) {
      // Create a strict filtered set first
      let strictFiltered = filtered.filter(r => {
        const d = String(r.description || '').toLowerCase();

        // Strict Exclusion: Unless scrap_waste is requested, filter out slag/scrap/waste
        if (!targetClasses.includes('scrap_waste')) {
          if (/scrap|waste|slag|ash|residue/.test(d)) return false;
        }

        // Strict Inclusion: The description MUST contain keywords from at least one target class
        let hasInclusionMatch = false;
        for (const cls of targetClasses) {
          const kws = PRODUCT_CLASSES[cls] || [];
          if (kws.some(kw => d.includes(kw))) {
            hasInclusionMatch = true;
            break;
          }
        }

        if (!hasInclusionMatch) return false;

        // Mutual Exclusions based on specific product classes
        if (targetClasses.includes('pipes_tubes')) {
          if (/sheet|plate|bar|rod|foil|wire/.test(d)) return false;
        }

        if (targetClasses.includes('sheets_plates')) {
          if (/pipe|tube|hose|bar|rod|wire/.test(d)) return false;
        }

        return true;
      });

      // Safe Fallback: If strict filtering killed all results, fall back to soft filtering
      if (strictFiltered.length === 0) {
        // Fallback only applies exclusion lists (prevents steel->slag without forcing inclusion)
        return filtered.filter(r => {
          const d = String(r.description || '').toLowerCase();
          if (!targetClasses.includes('scrap_waste') && /scrap|waste|slag|ash|residue/.test(d)) return false;
          if (targetClasses.includes('pipes_tubes') && /sheet|plate|bar|rod|foil|wire/.test(d)) return false;
          if (targetClasses.includes('sheets_plates') && /pipe|tube|hose|bar|rod|wire/.test(d)) return false;
          return true;
        });
      }

      return strictFiltered;
    }

    // If no explicit product classes, still filter out scrap/waste by default unless query has those words
    return filtered.filter(r => {
      const d = String(r.description || '').toLowerCase();
      // Skip filtering out scrap for very short generic queries, rely on vector match
      return true;
    });

  } catch (err) {
    console.error("CLASSIFICATION ERROR: hardFilterDataset failed", err.stack);
    return dataset || [];
  }
}

// 7. Optimized Ranking Weights (Product Match > Material Match > Semantic)
function customRankResults(filteredDataset, query, targetClasses, targetMaterials, queryVector = null) {
  const qWords = String(query).toLowerCase().split(/\s+/).filter(w => !STOPWORDS.has(w) && w.length > 2);

  // We don't use Fuse for the final rigorous ranking. We build a custom point system.
  const scored = [];

  for (const item of filteredDataset) {
    const desc = String(item.description || '').toLowerCase();
    let score = 0;

    // Weight 1: Semantic Presence (Base similarity)
    let semanticMatches = 0;
    for (const gw of qWords) {
      if (desc.includes(gw)) semanticMatches++;
    }
    if (qWords.length > 0) {
      // Base score up to 30 points
      score += (semanticMatches / qWords.length) * 30;
    }

    // Weight 2: Material Match (Moderate Boost, up to 20 points)
    if (targetMaterials.length > 0) {
      let matMatch = false;
      for (const mat of targetMaterials) {
        if (desc.includes(mat)) { matMatch = true; break; }
      }
      if (matMatch) score += 20;
      else if (score > 0) score -= 10; // Penalty if material is explicitly requested but missing
    }

    // Weight 3: Exact Product Class Match (Highest Boost, up to 60 points)
    let classMatch = false;
    if (targetClasses.length > 0) {
      for (const cls of targetClasses) {
        const kws = PRODUCT_CLASSES[cls] || [];
        if (kws.some(k => desc.includes(k))) { classMatch = true; break; }
      }
      if (classMatch) score += 60;
      else if (score > 0) score -= 30; // Heavy penalty if product class is requested but missing
    }

    // Exact phrase match bonus
    if (desc.includes(String(query).toLowerCase())) {
      score += 15;
    }

    // Weight 4: Vector AI Semantic Similarity (Massive Boost for synonyms)
    if (queryVector && item.vector) {
      const sim = cosineSimilarity(queryVector, item.vector);
      if (sim > 0.3) {
        // A sim of 1.0 (perfect) gives 80 points. A sim of 0.5 gives 40.
        let vectorBoost = sim * 80;

        // Prevent Single-Token Dominance:
        // If the user asked for a specific product class, but this item completely missed it,
        // vastly restrict the vector boost so it cannot dominate real matches.
        if (targetClasses.length > 0 && !classMatch) {
          vectorBoost = Math.min(vectorBoost, 20); // Cap vector contribution
        }

        score += vectorBoost;
      }
    }

    // Only keep realistically viable matches
    if (score > 15) {
      scored.push({ item, customScore: Math.min(100, Math.max(0, score)) });
    }
  }

  // Sort descending by score
  scored.sort((a, b) => b.customScore - a.customScore);
  return scored;
}

module.exports = {
  detectQueryDomain,
  isHSNCode,
  detectProductClass,
  detectMaterial,
  analyzeQuerySpecificity,
  hardFilterDataset,
  customRankResults,
  loadMasterDataset,
  mapScoreToRelevance,
  extractKeywordsFromDescription,
  initSemanticSearch,
  getEmbedding,
  cosineSimilarity
};

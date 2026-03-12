import raw from '../data/master_gst_data.json';

export type GSTRecord = {
  code: string;
  description: string;
  type: 'GOODS' | 'SERVICE';
  tags?: {
    material_type: string[];
    domain_type: string[];
    product_type: string[];
  };
};

const data: GSTRecord[] = Array.isArray(raw) ? (raw as GSTRecord[]) : [];

// --- IN-MEMORY INDEXING ---
interface IndexedRecord {
  id: number;
  record: GSTRecord;
  lowercasedDescription: string;
  searchableTokens: Set<string>;
  materials: Set<string>;
}

// --- SEMANTIC DICTIONARIES ---

const STOPWORDS = new Set(['for', 'of', 'and', 'other', 'contracts', 'services', 'the', 'a', 'an', 'in', 'to', 'with', 'on']);
const MATERIAL_KEYWORDS = new Set(['steel', 'stainless', 'pvc', 'copper', 'aluminium', 'aluminum', 'iron', 'plastic', 'brass', 'rubber', 'wood']);
const PRODUCT_KEYWORDS = new Set(['pipe', 'pipes', 'tube', 'tubes', 'fitting', 'fittings', 'valve', 'valves', 'flange', 'machinery', 'equipment']);

function getTokenWeight(token: string) {
  if (PRODUCT_KEYWORDS.has(token)) return 30;
  if (MATERIAL_KEYWORDS.has(token)) return 20;
  return 5;
}

const SYNONYMS: Record<string, string[]> = {
  'tubes': ['pipes'],
  'tube': ['pipes'],
  'pipe': ['pipes'],
  'piping': ['pipes'],
  'tubing': ['pipes'],
  'fittings': ['fittings'],
  'fitting': ['fittings'],
  'ms': ['mild', 'steel'],
  'ss': ['stainless', 'steel'],
  'gi': ['galvanized', 'iron'],
  'pvc': ['plastic'],
  'upvc': ['plastic'],
  'cpvc': ['plastic'],
  'hdpe': ['plastic'],
  'ptfe': ['plastic']
};

const CATEGORIES: Record<string, { keywords: string[]; chapters: string[] }> = {
  pipes: {
    keywords: ['pipes', 'hose', 'hollow profile'],
    chapters: ['3917', '7303', '7304', '7305', '7306', '4009', '6906', '7411', '7608', '7507']
  },
  fittings: {
    keywords: ['fittings', 'elbow', 'flange', 'tee', 'reducer', 'coupling', 'joint'],
    chapters: ['7307', '3917', '7412', '7609', '7508']
  },
  valves: {
    keywords: ['valve', 'valves', 'tap', 'cock'],
    chapters: ['8481']
  },
  services: {
    keywords: ['service', 'services', 'consulting', 'support', 'maintenance', 'repair', 'installation'],
    chapters: ['99'] // SAC prefix
  },
  it_digital: {
    keywords: ['software', 'cloud', 'hosting', 'development', 'it', 'digital'],
    chapters: ['9983', '9984']
  }
};

const MATERIAL_GROUPS: Record<string, string[]> = {
  plastics: ['plastics', 'plastic', 'polymer', 'acrylic', 'nylon'],
  steel: ['steel', 'stainless', 'carbon steel', 'alloy steel', 'galvanized', 'iron'],
  copper: ['copper', 'brass', 'bronze'],
  aluminum: ['aluminum', 'aluminium'],
  rubber: ['rubber', 'silicone', 'elastomer'],
};

const ATTRIBUTES = {
  seamless: ['seamless', 'drawn'],
  welded: ['welded', 'erw', 'saw'],
};

const NEGATIVE_KEYWORDS = ['slag', 'waste', 'scrap', 'ash', 'residue', 'turnings', 'shavings', 'smoking', 'tobacco', 'cigarette', 'mixtures', 'toys', 'decorative', 'ornamental'];

// --- IN-MEMORY INDEXING ---
interface IndexedRecord {
  id: number;
  record: GSTRecord;
  lowercasedDescription: string;
  searchableTokens: Set<string>;
  materials: Set<string>;
  categories: Set<string>;
  attributes: Set<string>;
}

const indexedData: IndexedRecord[] = [];
// Token -> Set of Record IDs
const tokenIndex = new Map<string, Set<number>>();
const codeLookup = new Map<string, IndexedRecord>();
const queryCache = new Map<string, Array<{ record: GSTRecord; score: number }>>();

let isIndexed = false;
let indexingPromise: Promise<void> | null = null;

function tokenize(text: string): string[] {
  // Extract alphanumeric sequences >= 2 chars long
  const words = text.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/);
  const validTokens = new Set<string>();
  for (const w of words) {
    if (w.length >= 2 && !STOPWORDS.has(w)) validTokens.add(w);
  }
  return Array.from(validTokens);
}

export async function ensureIndex() {
  if (isIndexed) return;
  if (indexingPromise) return indexingPromise;

  indexingPromise = new Promise((resolve) => {
    console.log("[HSN Search] Starting background indexing...");
    const start = performance.now();
    let i = 0;
    const CHUNK_SIZE = 2000;

    function processChunk() {
      const end = Math.min(i + CHUNK_SIZE, data.length);
      for (; i < end; i++) {
        const record = data[i];
        const lowerDesc = record.description.toLowerCase();
        const tokens = tokenize(lowerDesc);

        // Precompute Semantic Tags for E-commerce style categorization
        const material_type: string[] = [];
        for (const [groupName, keywords] of Object.entries(MATERIAL_GROUPS)) {
          if (keywords.some(kw => lowerDesc.includes(kw) || tokens.includes(kw))) {
            material_type.push(groupName);
          }
        }

        const product_type: string[] = [];
        for (const [catName, def] of Object.entries(CATEGORIES)) {
          if (def.keywords.some(kw => lowerDesc.includes(kw) || tokens.includes(kw))) {
            product_type.push(catName);
          }
        }

        const domain_type: string[] = [];
        if (record.code.startsWith('99') || product_type.includes('services') || product_type.includes('it_digital')) {
          domain_type.push('services');
        } else if (NEGATIVE_KEYWORDS.some(nk => lowerDesc.includes(nk))) {
          if (lowerDesc.includes('slag') || lowerDesc.includes('waste') || lowerDesc.includes('scrap') || lowerDesc.includes('ash') || lowerDesc.includes('residue') || lowerDesc.includes('turnings')) {
            domain_type.push('waste');
          } else {
            domain_type.push('consumer');
          }
        } else if (
          record.code.startsWith('73') || record.code.startsWith('84') || record.code.startsWith('39') || record.code.startsWith('74') || record.code.startsWith('76') ||
          product_type.includes('pipes') || product_type.includes('fittings') || product_type.includes('valves') ||
          material_type.includes('steel') || material_type.includes('aluminum') || material_type.includes('copper') || material_type.includes('plastics')
        ) {
          domain_type.push('industrial');
        } else {
          domain_type.push('consumer');
        }

        // Permanently attach classification tags to the original record
        record.tags = {
          material_type,
          domain_type,
          product_type
        };

        const indexedRec: IndexedRecord = {
          id: i,
          record,
          lowercasedDescription: lowerDesc,
          searchableTokens: new Set(tokens),
          materials: new Set(material_type),
          categories: new Set(product_type),
          attributes: new Set()
        };

        for (const [attrName, keywords] of Object.entries(ATTRIBUTES)) {
          if (keywords.some(kw => lowerDesc.includes(kw) || tokens.includes(kw))) {
            indexedRec.attributes.add(attrName);
          }
        }

        indexedData.push(indexedRec);
        codeLookup.set(record.code, indexedRec);

        for (const t of tokens) {
          if (!tokenIndex.has(t)) {
            tokenIndex.set(t, new Set());
          }
          tokenIndex.get(t)!.add(i);
        }
      }

      if (i < data.length) {
        // Yield to allow UI updates
        setTimeout(processChunk, 1);
      } else {
        isIndexed = true;
        const ms = (performance.now() - start).toFixed(2);
        console.log(`[HSN Search] Finished indexing ${data.length} records in ${ms}ms.`);
        resolve();
      }
    }

    processChunk();
  });

  return indexingPromise;
}

// Start indexing automatically in background
if (typeof window !== 'undefined') {
  setTimeout(ensureIndex, 100);
}

export async function searchMaster(query: string, limit = 10): Promise<Array<{ record: GSTRecord; score?: number }>> {
  await ensureIndex();

  const q = String(query || '').trim().toLowerCase();

  if (!q) return [];
  if (q.length < 2) return [];

  // Check Cache
  if (queryCache.has(q)) {
    return queryCache.get(q)!.slice(0, limit);
  }

  const results: Array<{ record: GSTRecord; score: number }> = [];

  // 1. Numerical Query (Search Code instead of Description)
  if (/^\d+/.test(q)) {
    for (let i = 0; i < indexedData.length; i++) {
      const rec = indexedData[i];
      if (rec.record.code.startsWith(q)) {
        // Exact match -> higher score
        let score = (rec.record.code === q) ? 100 : 80;
        // Shorter codes represent parent categories, give slight boost
        score -= (rec.record.code.length * 0.5);
        results.push({ record: rec.record, score });
      }
      if (results.length >= limit * 3) break; // Collect extra then sort
    }

    results.sort((a, b) => b.score - a.score);
    const finalNumericalRes = results.slice(0, limit).map(r => ({
      ...r,
      label: suggestionLabel(r.record.description),
    }));
    cacheResult(q, finalNumericalRes);
    return finalNumericalRes;
  }

  // 2. Textual Query with SYNONYM Normalization (Abbreviation Expansion)
  const initialTokens = tokenize(q);
  let queryTokens: string[] = [];

  for (const t of initialTokens) {
    if (SYNONYMS[t]) {
      queryTokens.push(...SYNONYMS[t]);
    } else {
      queryTokens.push(t);
    }
  }

  // Deduplicate just in case
  queryTokens = Array.from(new Set(queryTokens));

  if (queryTokens.length === 0) return [];

  // Semantic Query Understanding
  let qCategory: string | null = null;
  let qMaterial: string | null = null;
  let qAttributes = new Set<string>();

  for (const token of queryTokens) {
    if (!qCategory) {
      for (const [catName, def] of Object.entries(CATEGORIES)) {
        if (catName === token || def.keywords.includes(token)) qCategory = catName;
      }
    }
    if (!qMaterial) {
      for (const [groupName, keywords] of Object.entries(MATERIAL_GROUPS)) {
        if (groupName === token || keywords.includes(token)) qMaterial = groupName;
      }
    }
    for (const [attrName, keywords] of Object.entries(ATTRIBUTES)) {
      if (attrName === token || keywords.includes(token)) qAttributes.add(attrName);
    }
  }

  // Detect if user specifically queried a negative keyword (so we don't block it)
  const isQueryingNegative = NEGATIVE_KEYWORDS.some(nk => q.includes(nk));
  const isIndustrialQuery = Array.from(queryTokens).some(t => PRODUCT_KEYWORDS.has(t) || MATERIAL_KEYWORDS.has(t));

  let candidateIds: Set<number> | null = null;

  // Intersect token sets
  for (let idx = 0; idx < queryTokens.length; idx++) {
    const token = queryTokens[idx];
    const isFirstToken = (idx === 0);
    const isLastToken = (idx === queryTokens.length - 1);

    let tokenCandidateSet = new Set<number>();

    // Match exactly
    if (tokenIndex.has(token)) {
      tokenIndex.get(token)!.forEach(id => tokenCandidateSet.add(id));
    }

    // Prefix match (essential for autocomplete experience)
    // Only prefix match on last token or if it's a short 1-word query
    if (isLastToken) {
      for (const [key, idSet] of tokenIndex.entries()) {
        if (key.startsWith(token) && key !== token) {
          idSet.forEach(id => tokenCandidateSet.add(id));
        }
      }
    }

    if (!candidateIds) {
      candidateIds = new Set(tokenCandidateSet);
    } else {
      // Intersection
      const intersection = new Set<number>();
      for (const id of candidateIds) {
        if (tokenCandidateSet.has(id)) {
          intersection.add(id);
        }
      }
      candidateIds = intersection;

      // If we narrowed down to nothing, stop intersecting and rely on current subset
      // Or maybe soft match? In strict "AND" search, 0 is 0. 
      if (candidateIds.size === 0) break;
    }
  }

  // If strict intersection yields nothing, back off and accumulate union of sets (OR match)
  // for fuzzy fallback, but we'll sort strongly by exact token hits.
  if (!candidateIds || candidateIds.size === 0) {
    candidateIds = new Set<number>();

    // Just gather any records hitting any token (heavy operation)
    for (const token of queryTokens) {
      if (tokenIndex.has(token)) {
        tokenIndex.get(token)!.forEach(id => candidateIds!.add(id));
      } else {
        for (const [key, idSet] of tokenIndex.entries()) {
          if (key.includes(token)) {
            idSet.forEach(id => candidateIds!.add(id));
          }
        }
      }
    }
  }

  if (candidateIds.size === 0) {
    cacheResult(q, []);
    return [];
  }

  // 3. Scoring Function with SEMANTIC Priority Logic
  const scoredResults = [];
  for (const id of candidateIds) {
    const entry = indexedData[id];
    let score = 0;

    // NEGATIVE KEYWORD FILTERING
    if (!isQueryingNegative && isIndustrialQuery) {
      let isNegative = false;
      for (const nk of NEGATIVE_KEYWORDS) {
        if (entry.lowercasedDescription.includes(nk)) {
          isNegative = true;
          break;
        }
      }
      if (isNegative) {
        score -= 500; // massive penalty, effectively hiding it
      }
    }

    // Core Feature: Exact Phrase Overlap (Extreme Dominance)
    if (entry.lowercasedDescription.includes(q)) {
      score += 300;
    }

    // Core Feature: Raw Token Match w/ Weighted Scoring
    let matchedTokens = 0;
    for (const t of queryTokens) {
      const weight = getTokenWeight(t);
      if (entry.searchableTokens.has(t)) {
        matchedTokens++;
        score += weight;
      } else if (entry.lowercasedDescription.includes(t)) {
        score += (weight * 0.5); // Substring inside a merged word
      }
    }

    // SINGLE TOKEN PENALTY
    if (queryTokens.length > 1 && matchedTokens === 1) {
      score -= 50;
    }

    const code = entry.record.code;

    // TAG-BASED DOMAIN SCORING (Like E-commerce Facets)
    const tagDomains = entry.record.tags?.domain_type || [];

    // If user queried industrial terms but didn't query tobacco/smoking items
    if (!isQueryingNegative && isIndustrialQuery) {
      if (tagDomains.includes('industrial')) {
        score += 50; // Generic domain boost
      }
      if (tagDomains.includes('consumer')) {
        score -= 100; // Penalize Consumer hit if user wanted Industrial
      }
    }

    // SOFT CATEGORY BOOSTING
    const joinedQuery = queryTokens.join(' ');
    if (joinedQuery.includes('steel') && (code.startsWith('72') || code.startsWith('73'))) {
      score += 50;
    }
    if ((joinedQuery.includes('plastic') || joinedQuery.includes('pvc')) && code.startsWith('39')) {
      score += 50;
    }
    if (joinedQuery.includes('machinery') && code.startsWith('84')) {
      score += 50;
    }
    if ((joinedQuery.includes('services') || joinedQuery.includes('consulting')) && code.startsWith('99')) {
      score += 50;
    }

    // SPECIFIC CHAPTER PENALTIES based on pre-computed tags (replaces slow string matching)
    if (tagDomains.includes('waste')) {
      score -= 100; // Penalize Slag, Waste heavily
    }

    // CATEGORY + DOMAIN FILTERING (Rank 2)
    if (qCategory) {
      let chapterMatch = false;

      // Special Domain Rule for Pipes/Tubes
      if (qCategory === 'pipes') {
        if (code.startsWith('73') || code.startsWith('39') || code.startsWith('74') || code.startsWith('75') || code.startsWith('76')) {
          score += 150; // Explicit boost for relevant pipe chapters
          chapterMatch = true;
        }
      } else {
        const targetChapters = CATEGORIES[qCategory].chapters;
        for (const ch of targetChapters) {
          if (code.startsWith(ch)) {
            chapterMatch = true;
            break;
          }
        }
      }

      if (chapterMatch && entry.categories.has(qCategory)) {
        score += 200; // Perfect category + domain match
      } else if (entry.categories.has(qCategory)) {
        score += 50;  // Concept matches but wrong chapter (e.g. wrong material)
      } else {
        score -= 50;  // Wrong category entirely
      }
    }

    // MATERIAL AWARE SCORING (Rank 3)
    if (qMaterial) {
      if (entry.materials.has(qMaterial)) {
        score += 150; // Huge boost
      } else if (entry.materials.size > 0 && !entry.materials.has(qMaterial)) {
        score -= 100; // Huge penalty for contradictory material
      }
    }

    // ATTRIBUTE AWARE SCORING (Rank 4)
    if (qAttributes.size > 0) {
      for (const attr of qAttributes) {
        if (entry.attributes.has(attr)) {
          score += 100; // Correct attribute (e.g. seamless)
        } else if (entry.attributes.size > 0) {
          score -= 30; // Possesses a contradictory attribute (e.g. welded)
        }
      }
    }

    // Brevity Factor (Rank 5)
    // Penalize long descriptions so parent chapters rank higher mathematically
    score -= (entry.lowercasedDescription.length * 0.05);

    // Only include viable results
    if (score > -200) {
      scoredResults.push({ record: entry.record, score });
    }
  }

  // Sort Descending
  scoredResults.sort((a, b) => b.score - a.score);

  const finalResults = scoredResults.slice(0, Math.max(limit, 50));
  cacheResult(q, finalResults);

  return finalResults.slice(0, limit).map(r => ({
    ...r,
    label: suggestionLabel(r.record.description),
  }));
}

function cacheResult(q: string, res: Array<{ record: GSTRecord; score: number }>) {
  if (queryCache.size > 200) {
    const firstKey = queryCache.keys().next().value;
    if (firstKey) queryCache.delete(firstKey);
  }
  queryCache.set(q, res);
}
// ─────────────────────────────────────────────────────────────────
// suggestionLabel  —  SaaS-grade clean short label (3–5 words max)
// ─────────────────────────────────────────────────────────────────

/**
 * Words that are irrelevant filler in suggestion labels.
 * These are stripped BEFORE label selection.
 */
const LABEL_NOISE = new Set([
  // Generic qualifiers
  'other', 'others', 'general', 'miscellaneous', 'various', 'specified',
  'thereof', 'thereto', 'therefor', 'therefrom',
  'exceeding', 'not', 'elsewhere', 'nes',
  // Structural conjunctions / prepositions
  'of', 'and', 'or', 'in', 'the', 'a', 'an', 'with', 'by', 'for',
  'to', 'from', 'at', 'on', 'into', 'as', 'its', 'their',
  // Legal / bureaucratic filler
  'whether', 'including', 'namely', 'such', 'kind', 'types', 'type',
  'form', 'forms', 'made', 'having', 'used', 'designed', 'suitable',
  // Quantity / retail / condition filler
  'containing', 'more', 'weight', 'than', 'less', 'more',
  'put', 'retail', 'sale', 'solely', 'principally', 'use', 'only',
  'above', 'below', 'over', 'under', 'between', 'percentage',
  'hollow', 'profiles', 'heading', 'headings', 'chapter', 'chapters',
  // Units / threshold noise  — also removed via regex before tokenizing
]);

/** High-value semantic tokens that should be preferred when building labels */
const LABEL_PRIORITY = new Set([
  // Materials
  'steel', 'stainless', 'iron', 'copper', 'aluminium', 'aluminum', 'brass',
  'bronze', 'zinc', 'nickel', 'titanium', 'rubber', 'plastic', 'pvc',
  'polyethylene', 'polypropylene', 'glass', 'ceramic', 'cotton', 'silk',
  'wool', 'leather', 'wood', 'paper', 'carbon',
  // Product types
  'pipe', 'pipes', 'tube', 'tubes', 'rod', 'rods', 'wire', 'wires',
  'sheet', 'sheets', 'plate', 'plates', 'bar', 'bars', 'strip',
  'fitting', 'fittings', 'valve', 'valves', 'flange', 'flanges',
  'cable', 'cables', 'coil', 'coils', 'bolt', 'bolts', 'screw', 'screws',
  'bearing', 'bearings', 'gear', 'pump', 'motor', 'compressor',
  'transformer', 'insulator', 'fabric', 'yarn', 'thread', 'gasket', 'seal',
  'chemical', 'acid', 'alkali', 'solvent', 'resin', 'polymer',
  'machinery', 'equipment', 'instrument', 'sensor', 'lamp', 'light',
  // Descriptors worth keeping
  'seamless', 'welded', 'galvanized', 'annealed', 'cold', 'hot', 'rolled',
  'drawn', 'forged', 'cast', 'alloy', 'mild', 'corrugated', 'perforated',
]);

/**
 * Generates a clean 3–5 word label from a full GST/HSN description.
 *
 * Pipeline:
 *  1. Strip parenthetical clauses   e.g. "(for example, ...)"  — technical noise
 *  2. Strip numbers, %, thresholds  e.g. "exceeding 3mm"
 *  3. Tokenize words, lowercase
 *  4. Remove LABEL_NOISE stopwords
 *  5. De-duplicate (first occurrence wins)
 *  6. Sort: LABEL_PRIORITY tokens first, then others
 *  7. Take top 5 tokens, Title-Case them
 *  8. Join with spaces (material + product naturally reads well)
 *
 * @example
 * suggestionLabel("Other tubes, pipes and hollow profiles of iron or steel")
 * // ⇒ "Steel Pipes Tubes Iron"
 */
export function suggestionLabel(description: string): string {
  if (!description) return '';

  // 1. Strip parenthetical clauses (e.g. "(for example, open seam)")
  let text = description.replace(/\([^)]*\)/g, ' ');

  // 2. Strip numbers, percentages, units and threshold phrases
  //    e.g. "3 mm", "12%", "over 100", "not exceeding 3.5"
  text = text
    .replace(/\d+(\.\d+)?\s*(%|mm|cm|m|kg|g|l|ml|kv|kw|hp|w|v|hz|mhz|ghz)?/gi, ' ')
    .replace(/\bexceeding\b/gi, ' ')
    .replace(/\bnot\s+exceeding\b/gi, ' ');

  // 3. Tokenize — only real alphabetic words
  const rawTokens = text
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(t => t.length >= 3);

  // 4. Remove noise stopwords
  const filtered = rawTokens.filter(t => !LABEL_NOISE.has(t));

  // 5. De-duplicate while preserving order
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const t of filtered) {
    if (!seen.has(t)) { seen.add(t); unique.push(t); }
  }

  // 6. Sort: priority tokens first, then rest (stable: preserve relative order within each group)
  const priority = unique.filter(t => LABEL_PRIORITY.has(t));
  const rest = unique.filter(t => !LABEL_PRIORITY.has(t));
  const ordered = [...priority, ...rest];

  // 7. Take at most 5 tokens and title-case
  const label = ordered
    .slice(0, 5)
    .map(t => t.charAt(0).toUpperCase() + t.slice(1))
    .join(' ');

  return label || description.split(/\s+/).slice(0, 4).join(' ');
}

export default { searchMaster, ensureIndex, suggestionLabel };

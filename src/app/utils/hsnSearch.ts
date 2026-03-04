import rawData from '../data/master_gst_data.json';

// ─── Types ─────────────────────────────────────────────────────────────────────
export type HSNRecord = {
  hsn_sac: string;
  description: string;
  gst_rate: string;
};

/** Human-readable explanation of why a result scored the way it did. */
export interface ScoreExplanation {
  matchedTokens: string[];         // direct query tokens found in description
  synonymMatches: string[];        // synonym-expanded tokens that matched
  fuzzyMatches: string[];          // typo-corrected tokens that matched
  phraseMatch: boolean;            // exact phrase found in description
  keywordField: boolean;           // chapter keyword boost applied
  categoryField: boolean;          // chapter category match
  materialBoost: number;           // material boost total
  productBoost: number;            // product boost total
  semanticScore: number;           // cosine similarity [0-1]
  genericPenalty: number;          // penalty applied (0 if none)
  coverageScore: number;           // weighted token match ratio [0-1] — used for tiebreaking
  totalScore: number;
  reasons: string[];               // final human-readable lines for UI
}

/** Extended internal record — pre-tokenized once at startup, never again. */
interface IndexedRecord {
  id: number;
  record: HSNRecord;
  /** All tokens from description, lowercased, split once at load time. */
  descTokens: Set<string>;
  /** Raw lowercased description (for include-checks and phrase matching). */
  descLower: string;
  /** HSN chapter code (first 2 digits). */
  chapter: string;
}

// ─── Dataset Adapter ───────────────────────────────────────────────────────────
type MasterEntry = { code: string; description: string; type?: string };
const rawMaster: MasterEntry[] = Array.isArray(rawData) ? (rawData as MasterEntry[]) : [];

// Pre-tokenize every description ONCE at module load. Never again during search.
const indexedRecords: IndexedRecord[] = rawMaster.map((r, id) => {
  const descLower = (r.description ?? '').toLowerCase();
  const descTokens = new Set(
    descLower.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(t => t.length >= 2)
  );
  return {
    id,
    record: { hsn_sac: r.code, description: r.description, gst_rate: '' },
    descTokens,
    descLower,
    chapter: String(r.code).substring(0, 2),
  };
});

// Convenience flat dataset for backward-compatible exports
const dataset: HSNRecord[] = indexedRecords.map(r => r.record);

// ─── Inverted Index (token → record IDs) ──────────────────────────────────────
// Built once at startup. Maps every description token to the set of record
// indices that contain it. Search only scores the union of matching ID sets.
const invertedIndex = new Map<string, number[]>();

for (const ir of indexedRecords) {
  for (const token of ir.descTokens) {
    let ids = invertedIndex.get(token);
    if (!ids) { ids = []; invertedIndex.set(token, ids); }
    ids.push(ir.id);
  }
}

/**
 * Inverse Document Frequency — how rare/discriminating a token is across
 * the whole HSN dataset. Uses the already-built invertedIndex (no extra storage).
 * IDF = log((N+1) / (df+1))   higher = rarer = more specific.
 */
function getIDF(token: string): number {
  const N = indexedRecords.length;
  const df = invertedIndex.get(token)?.length ?? 0;
  return Math.log((N + 1) / (df + 1));
}


// ─── Abbreviation Expansion ────────────────────────────────────────────────────
const ABBREVIATIONS: Record<string, string> = {
  ms: 'mild steel',
  ss: 'stainless steel',
  gi: 'galvanized iron',
  pvc: 'polyvinyl chloride',
  hdpe: 'polyethylene',
  cpp: 'polypropylene',
};

// ─── Synonym Dictionary ────────────────────────────────────────────────────────
const SYNONYMS: Record<string, string[]> = {
  pipe: ['tube', 'tubing', 'conduit', 'piping'],
  tube: ['pipe', 'tubing', 'conduit'],
  fittings: ['coupling', 'elbow', 'connector', 'joint'],
  fitting: ['coupling', 'elbow', 'connector', 'joint'],
  bolt: ['fastener', 'screw'],
  nut: ['fastener'],
  wire: ['cable', 'conductor', 'strand'],
  cable: ['wire', 'conductor', 'strand'],
  motor: ['engine', 'actuator'],
  plastic: ['polymer', 'resin'],
  valve: ['cock', 'tap', 'gate'],
  coupling: ['joint', 'connector', 'sleeve'],
  sheet: ['plate', 'strip', 'foil'],
  plate: ['sheet', 'strip'],
  bar: ['rod', 'billet', 'section'],
  rod: ['bar', 'billet'],
  fabric: ['cloth', 'textile', 'woven'],
  cloth: ['fabric', 'textile'],
  vessel: ['tank', 'drum', 'container'],
  tank: ['vessel', 'drum', 'container'],
  pump: ['compressor', 'blower'],
  gasket: ['seal', 'washer', 'packing'],
  seal: ['gasket', 'packing'],
  hose: ['tube', 'pipe', 'conduit'],
  bearing: ['bush', 'bushing'],
  elbow: ['bend', 'fitting', 'connector'],
  flange: ['collar', 'fitting'],
  chemical: ['compound', 'reagent', 'substance'],
  reagent: ['chemical', 'compound'],
  yarn: ['thread', 'fibre', 'fiber'],
  fibre: ['fiber', 'yarn', 'thread'],
  leather: ['hide', 'skin'],
  timber: ['wood', 'lumber', 'plywood'],
  wood: ['timber', 'lumber'],
};

// ─── Levenshtein Distance (capped for performance) ────────────────────────────
function levenshtein(a: string, b: string, maxDist: number): number {
  if (Math.abs(a.length - b.length) > maxDist) return maxDist + 1;
  const m = a.length, n = b.length;
  const dp: number[] = Array(n + 1).fill(0).map((_, i) => i);
  for (let i = 1; i <= m; i++) {
    let prev = i;
    for (let j = 1; j <= n; j++) {
      const curr = a[i - 1] === b[j - 1] ? dp[j - 1] : 1 + Math.min(dp[j - 1], dp[j], prev);
      dp[j - 1] = prev;
      prev = curr;
    }
    dp[n] = prev;
  }
  return dp[n];
}

// Vocabulary grouped by length (derived from inverted index keys) for fuzzy lookups
const vocabByLength = new Map<number, string[]>();
for (const token of invertedIndex.keys()) {
  if (token.length >= 3) {
    if (!vocabByLength.has(token.length)) vocabByLength.set(token.length, []);
    vocabByLength.get(token.length)!.push(token);
  }
}

const fuzzyCache = new Map<string, string[]>();

function getFuzzyCandidates(token: string, maxDist = 2): string[] {
  if (fuzzyCache.has(token)) return fuzzyCache.get(token)!;
  const candidates: string[] = [];
  for (let len = token.length - maxDist; len <= token.length + maxDist; len++) {
    const bucket = vocabByLength.get(len);
    if (!bucket) continue;
    for (const vt of bucket) {
      if (vt !== token && levenshtein(token, vt, maxDist) <= maxDist) {
        candidates.push(vt);
        if (candidates.length >= 8) break;
      }
    }
    if (candidates.length >= 8) break;
  }
  fuzzyCache.set(token, candidates);
  return candidates;
}

// ─── Query Normalization ───────────────────────────────────────────────────────
export function normalizeQuery(query: string): string[] {
  let q = query.toLowerCase();
  for (const [abbr, expansion] of Object.entries(ABBREVIATIONS)) {
    q = q.replace(new RegExp(`\\b${abbr}\\b`, 'g'), expansion);
  }
  return q.split(/\s+/).filter(t => t.length >= 2);
}

export interface ExpandedQuery {
  direct: string[];
  expanded: string[];   // synonym tokens — weight 0.6×
  fuzzy: string[];   // typo-corrected — weight 0.5×
}

export function expandQuery(query: string): ExpandedQuery {
  const direct = normalizeQuery(query);
  const directSet = new Set(direct);

  const synonymSet = new Set<string>();
  for (const token of direct) {
    for (const s of (SYNONYMS[token] ?? [])) {
      if (!directSet.has(s)) synonymSet.add(s);
    }
  }

  const allKnown = new Set([...directSet, ...synonymSet]);
  const fuzzySet = new Set<string>();
  for (const token of direct) {
    if (token.length < 5) continue;
    // Only fuzzy-expand tokens not in the inverted index vocab
    const inVocab = (vocabByLength.get(token.length) ?? []).includes(token);
    if (inVocab) continue;
    for (const candidate of getFuzzyCandidates(token)) {
      if (!allKnown.has(candidate)) fuzzySet.add(candidate);
    }
  }

  return { direct, expanded: Array.from(synonymSet), fuzzy: Array.from(fuzzySet) };
}

// ─── Candidate Fetching via Inverted Index ─────────────────────────────────────
/**
 * Returns the union of all record IDs matching any of the query tokens
 * (direct + synonyms + fuzzy) from the inverted index.
 * Only these IDs are scored — not the full 21k dataset.
 */
function getCandidateIds(eq: ExpandedQuery): Set<number> {
  const ids = new Set<number>();
  const allTokens = [...eq.direct, ...eq.expanded, ...eq.fuzzy];
  for (const token of allTokens) {
    const matches = invertedIndex.get(token);
    if (matches) {
      for (const id of matches) ids.add(id);
    }
    // Also check substring: some tokens are substrings of longer index tokens
    // (e.g. "pipe" may appear inside "pipeline" as a description token)
    // — handled by include-check in scoreEntry's descLower.includes()
  }
  return ids;
}

// ─── Field-Aware Weighting Data ────────────────────────────────────────────────
const CHAPTER_CATEGORIES: Record<string, string> = {
  '01': 'live animals', '02': 'meat offal', '03': 'fish seafood',
  '04': 'dairy eggs honey', '05': 'animal products',
  '06': 'plants flowers', '07': 'vegetables', '08': 'fruits nuts',
  '09': 'coffee tea spices', '10': 'cereals grains',
  '11': 'milling products flour', '12': 'oil seeds', '13': 'lac resins gums',
  '15': 'fats oils', '16': 'meat fish preparations', '17': 'sugars',
  '18': 'cocoa chocolate', '19': 'food preparations', '20': 'fruit vegetable preparations',
  '21': 'miscellaneous edible preparations', '22': 'beverages spirits vinegar',
  '23': 'animal feed residues', '24': 'tobacco',
  '25': 'salt sulphur earth stone', '26': 'ores slag ash',
  '27': 'mineral fuels oil', '28': 'inorganic chemicals',
  '29': 'organic chemicals', '30': 'pharmaceutical products',
  '31': 'fertilisers', '32': 'dyes pigments paints',
  '33': 'perfumery cosmetics', '34': 'soap detergents',
  '35': 'albuminoidal substances', '36': 'explosives',
  '37': 'photographic goods', '38': 'chemical products',
  '39': 'plastics articles', '40': 'rubber articles',
  '41': 'raw hides skins leather', '42': 'leather articles travel goods',
  '43': 'furskins', '44': 'wood articles timber',
  '45': 'cork articles', '46': 'straw plaiting',
  '47': 'pulp wood paper', '48': 'paper paperboard articles',
  '49': 'printed books newspapers',
  '50': 'silk', '51': 'wool fine animal hair',
  '52': 'cotton', '53': 'vegetable textile fibres',
  '54': 'man made filaments', '55': 'man made staple fibres',
  '56': 'wadding felt nonwovens', '57': 'carpets floor coverings',
  '58': 'special woven fabrics', '59': 'impregnated coated textile fabrics',
  '60': 'knitted crocheted fabrics', '61': 'knitted clothing apparel',
  '62': 'woven clothing apparel', '63': 'textile articles',
  '64': 'footwear', '65': 'headgear', '66': 'umbrellas',
  '68': 'stone plaster cement articles', '69': 'ceramic products',
  '70': 'glass articles', '71': 'precious stones metals jewellery',
  '72': 'iron steel', '73': 'iron steel articles fittings pipes',
  '74': 'copper articles', '75': 'nickel articles',
  '76': 'aluminium articles', '78': 'lead articles',
  '79': 'zinc articles', '80': 'tin articles', '81': 'base metals',
  '82': 'tools implements cutlery', '83': 'miscellaneous metal articles',
  '84': 'machinery mechanical appliances boilers',
  '85': 'electrical equipment electronics',
  '86': 'railway locomotives', '87': 'vehicles automobiles',
  '88': 'aircraft spacecraft', '89': 'ships boats',
  '90': 'optical instruments', '91': 'clocks watches',
  '92': 'musical instruments', '93': 'arms ammunition',
  '94': 'furniture bedding lamps', '95': 'toys games sports',
  '96': 'miscellaneous manufactured articles', '99': 'services sac',
};

const CHAPTER_KEYWORDS: Record<string, string[]> = {
  '28': ['chloride', 'oxide', 'acid', 'chemical', 'inorganic', 'compound'],
  '29': ['organic', 'compound', 'chemical', 'reagent', 'solvent'],
  '38': ['chemical', 'preparation', 'reagent', 'compound'],
  '39': ['plastic', 'pvc', 'polypropylene', 'polyethylene', 'hdpe', 'polymer', 'resin', 'pipe', 'tube', 'fitting'],
  '40': ['rubber', 'gasket', 'seal', 'hose', 'vulcanized', 'elastomer'],
  '44': ['wood', 'timber', 'plywood', 'lumber', 'board'],
  '52': ['cotton', 'yarn', 'fabric', 'thread', 'woven'],
  '54': ['filament', 'yarn', 'polyester', 'nylon', 'fabric'],
  '72': ['steel', 'iron', 'alloy', 'stainless', 'galvanized', 'mild', 'rolled', 'billet'],
  '73': ['pipe', 'tube', 'fitting', 'elbow', 'flange', 'valve', 'bolt', 'screw', 'iron', 'steel', 'bar', 'rod'],
  '74': ['copper', 'brass', 'bronze', 'wire', 'tube', 'pipe', 'fitting'],
  '75': ['nickel', 'alloy', 'tube', 'pipe'],
  '76': ['aluminium', 'aluminum', 'wire', 'sheet', 'tube', 'pipe'],
  '82': ['tool', 'blade', 'drill', 'saw', 'knife', 'spanner', 'wrench'],
  '84': ['machinery', 'pump', 'motor', 'compressor', 'turbine', 'engine', 'valve', 'filter'],
  '85': ['electrical', 'cable', 'wire', 'transformer', 'motor', 'generator', 'switch', 'relay'],
  '87': ['vehicle', 'automobile', 'truck', 'car', 'engine', 'motor'],
};

// ─── Semantic Indicator Sets ───────────────────────────────────────────────────
const MATERIAL_INDICATORS = new Set([
  'steel', 'stainless', 'iron', 'mild', 'galvanized', 'cast', 'alloy',
  'copper', 'aluminium', 'aluminum', 'brass', 'bronze', 'nickel', 'zinc',
  'lead', 'tin', 'titanium', 'chromium', 'manganese', 'silicon', 'polyvinyl',
  'polypropylene', 'polyethylene', 'ptfe', 'rubber', 'silicone',
  'elastomer', 'plastic', 'polymer', 'resin', 'chloride',
  'cotton', 'wool', 'silk', 'jute', 'linen', 'nylon', 'polyester',
  'textile', 'fibre', 'fiber', 'yarn', 'leather', 'hide',
  'ceramic', 'glass', 'clay', 'cement', 'concrete', 'stone', 'granite',
  'marble', 'gypsum', 'asphalt', 'bitumen', 'wood', 'timber', 'plywood',
  'paper', 'cardboard', 'chemical', 'acid', 'fluoride',
  'oxide', 'carbide', 'sulfate', 'phosphate', 'nitrogen',
]);

const PRODUCT_INDICATORS = new Set([
  'pipe', 'pipes', 'tube', 'tubes', 'hose', 'hoses', 'fittings', 'elbow', 'elbows', 'flange', 'flanges',
  'coupling', 'reducer', 'tee', 'nipple', 'sleeve', 'conduit', 'tubing',
  'rod', 'rods', 'bar', 'bars', 'wire', 'wires', 'sheet', 'sheets', 'plate', 'plates',
  'coil', 'coils', 'strip', 'strips', 'section', 'sections',
  'profile', 'profiles', 'beam', 'beams', 'angle', 'channel', 'rail', 'rails', 'mesh', 'grating',
  'valve', 'valves', 'pump', 'pumps', 'motor', 'motors', 'compressor', 'compressors', 'turbine', 'generator',
  'bearing', 'bearings', 'gear', 'gears', 'sprocket', 'chain', 'belt', 'seal', 'seals', 'gasket', 'gaskets',
  'fastener', 'fasteners', 'bolt', 'bolts', 'nut', 'nuts', 'screw', 'screws', 'rivet', 'rivets', 'washer', 'nail', 'nails',
  'tank', 'tanks', 'vessel', 'vessels', 'drum', 'drums', 'barrel', 'barrels', 'container', 'containers', 'bin', 'silo',
  'cylinder', 'cylinders', 'canister', 'bottle', 'bottles', 'jar', 'jars',
  'fabric', 'fabrics', 'cloth', 'knitted', 'woven', 'nonwoven', 'mat', 'carpet', 'carpets',
  'bag', 'bags', 'sack', 'sacks', 'wrapper', 'film', 'foil', 'foils',
  'cable', 'cables', 'conductor', 'conductors', 'insulator', 'transformer', 'relay', 'switch', 'switches',
  'socket', 'sockets', 'connector', 'connectors', 'resistor', 'capacitor',
  'panel', 'panels', 'block', 'blocks', 'brick', 'bricks', 'tile', 'tiles', 'slab', 'slabs', 'board', 'boards', 'frame', 'frames',
]);

// ─── Lightweight Cosine Similarity (no ML, no external libs) ─────────────────
/**
 * Represents query and description as token-weight vectors and computes
 * cosine similarity: dot(q, d) / (|q| * |d|)
 *
 * Query vector  : Map<token, weight>  (direct=1.0, synonym=0.6, fuzzy=0.5)
 * Description vector : binary bag-of-words (1 if token present in descTokens)
 *
 * Returns a value in [0, 1]. Works entirely offline, no ML library needed.
 */
function cosineSimilarity(eq: ExpandedQuery, descTokens: Set<string>): number {
  // Build weighted query vector
  const qVec = new Map<string, number>();
  for (const t of eq.direct) qVec.set(t, 1.0);
  for (const t of eq.expanded) if (!qVec.has(t)) qVec.set(t, 0.6);
  for (const t of eq.fuzzy) if (!qVec.has(t)) qVec.set(t, 0.5);

  if (qVec.size === 0) return 0;

  // Dot product: q_weight × d_weight (d_weight = 1 if present, 0 if not)
  let dot = 0;
  for (const [token, weight] of qVec) {
    if (descTokens.has(token)) dot += weight * 1;
  }
  if (dot === 0) return 0;

  // |q| = sqrt(Σ weight²)
  let qMagSq = 0;
  for (const weight of qVec.values()) qMagSq += weight * weight;

  // |d| = sqrt(|descTokens|)  — binary vector, each component is 1
  const dMag = Math.sqrt(descTokens.size);
  const qMag = Math.sqrt(qMagSq);

  return qMag > 0 && dMag > 0 ? dot / (qMag * dMag) : 0;
}

// ─── Industry Detection Map ───────────────────────────────────────────────────
/**
 * Maps industry names to:
 *  - keywords: tokens that signal this industry in a query
 *  - chapters: HSN chapter prefixes (2-digit) associated with this industry
 *
 * Used to:
 *   Boost(+20)  results whose chapter belongs to the detected industry
 *   Penalise(-10) results from clearly unrelated industries
 */
const INDUSTRY_MAP: Record<string, { keywords: Set<string>; chapters: Set<string> }> = {
  chemicals: {
    keywords: new Set(['acid', 'alkali', 'solvent', 'chemical', 'oxide', 'chloride', 'sulfate',
      'nitrate', 'chlorine', 'ammonia', 'reagent', 'compound', 'dye', 'pigment',
      'resin', 'adhesive', 'lubricant', 'enzyme', 'catalyst']),
    chapters: new Set(['28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38']),
  },
  polymers: {
    keywords: new Set(['polymer', 'plastic', 'pvc', 'polyethylene', 'polypropylene', 'polystyrene',
      'ptfe', 'nylon', 'acrylic', 'epoxy', 'rubber', 'elastomer', 'silicone']),
    chapters: new Set(['39', '40']),
  },
  textiles: {
    keywords: new Set(['cotton', 'fabric', 'yarn', 'textile', 'fibre', 'fiber', 'silk', 'wool',
      'linen', 'jute', 'knitted', 'woven', 'nonwoven', 'thread', 'cloth',
      'carpet', 'mat', 'embroidery', 'lace', 'felt']),
    chapters: new Set(['50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63']),
  },
  metals: {
    keywords: new Set(['steel', 'iron', 'rod', 'pipe', 'sheet', 'plate', 'tube', 'billet',
      'alloy', 'cast', 'galvanized', 'stainless', 'mild', 'structural',
      'aluminium', 'aluminum', 'copper', 'brass', 'bronze', 'nickel',
      'zinc', 'titanium', 'chromium', 'manganese']),
    chapters: new Set(['72', '73', '74', '75', '76', '78', '79', '80', '81']),
  },
  machinery: {
    keywords: new Set(['pump', 'motor', 'compressor', 'turbine', 'engine', 'machinery', 'apparatus',
      'gear', 'gearbox', 'conveyor', 'press', 'lathe', 'furnace', 'boiler',
      'reactor', 'agitator', 'centrifuge', 'blower', 'crane', 'hoist']),
    chapters: new Set(['84']),
  },
  electrical: {
    keywords: new Set(['cable', 'wire', 'conductor', 'transformer', 'switch', 'relay', 'insulator',
      'electrical', 'generator', 'capacitor', 'resistor', 'lamp', 'bulb',
      'battery', 'charger', 'rectifier', 'inverter', 'panel', 'circuit',
      'semiconductor', 'diode', 'transistor', 'antenna']),
    chapters: new Set(['85']),
  },
  food: {
    keywords: new Set(['food', 'sugar', 'flour', 'rice', 'wheat', 'maize', 'corn', 'oil', 'sauce',
      'beverage', 'juice', 'meat', 'fish', 'milk', 'butter', 'cheese', 'spice',
      'salt', 'vinegar', 'cocoa', 'coffee', 'tea', 'tobacco']),
    chapters: new Set(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14',
      '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']),
  },
};

/**
 * Returns the set of HSN chapters that match the detected industry/industries
 * in the query tokens. Called ONCE per query in searchHSN.
 */
export function detectIndustryChapters(tokens: string[]): Set<string> {
  const detected = new Set<string>();
  for (const [, { keywords, chapters }] of Object.entries(INDUSTRY_MAP)) {
    for (const t of tokens) {
      if (keywords.has(t)) {
        for (const ch of chapters) detected.add(ch);
        break; // found a match for this industry, move to next
      }
    }
  }
  return detected;
}

// ─── Core Scoring Function ─────────────────────────────────────────────────────
/**
 * finalScore = existingScore + (semanticScore × 40) + industryBoost
 *
 * existingScore = (coverageScore × 100) + phraseBonus(+120) + fieldScore
 *              + materialBoost + productBoost − genericPenalty
 * semanticScore = cosineSimilarity(queryTokens ↔ descriptionTokens)  [0…1]
 * industryBoost = +20 if chapter ∈ detectedIndustryChapters, −10 if unrelated
 *
 * Runs only on candidate records fetched from the inverted index.
 * Uses pre-tokenized `ir.descTokens` — no re-tokenization at search time.
 */
export function scoreEntry(
  eq: ExpandedQuery,
  ir: IndexedRecord,
  industryChapters?: Set<string>,
): { score: number; explanation: ScoreExplanation } {
  const { descLower, descTokens, chapter } = ir;
  const { direct, expanded, fuzzy } = eq;

  // Running total — every module below ONLY does score += or score -=
  let score = 0;

  // ── Module 1: Coverage (position-weighted × IDF-weighted) ─────────────────────
  // Token weight formula:
  //   posWeight = 1.0 + (position / totalTokens) × 0.5  → later tokens up to 1.5×
  //   idfWeight = clamp(IDF / 3, 0.5, 2.0)             → rarer tokens up to 2×
  //   finalWeight = posWeight × idfWeight
  const matchedDirect: string[] = [];
  const matchedSynonyms: string[] = [];
  const matchedFuzzy: string[] = [];

  const nDirect = direct.length;
  let weightedMatched = 0;
  let totalWeight = 0;

  for (let i = 0; i < nDirect; i++) {
    const t = direct[i];
    const posW = 1.0 + (i / Math.max(nDirect, 1)) * 0.5;
    const idfW = Math.min(Math.max(getIDF(t) / 3, 0.5), 2.0);
    const w = posW * idfW;
    totalWeight += w;
    if (descTokens.has(t) || descLower.includes(t)) { matchedDirect.push(t); weightedMatched += w; }
  }
  for (const t of expanded) {
    const idfW = Math.min(Math.max(getIDF(t) / 3, 0.5), 2.0);
    const w = 0.6 * idfW;
    totalWeight += w;
    if (descTokens.has(t) || descLower.includes(t)) { matchedSynonyms.push(t); weightedMatched += w; }
  }
  for (const t of fuzzy) {
    const idfW = Math.min(Math.max(getIDF(t) / 3, 0.5), 2.0);
    const w = 0.5 * idfW;
    totalWeight += w;
    if (descTokens.has(t) || descLower.includes(t)) { matchedFuzzy.push(t); weightedMatched += w; }
  }

  const coverageScore = totalWeight > 0 ? weightedMatched / totalWeight : 0;

  score += coverageScore * 100;

  // ── Module 2: Phrase match ────────────────────────────────────────────────
  const phraseMatch = direct.length > 0 && descLower.includes(direct.join(' '));

  score += phraseMatch ? 120 : 0;

  // ── Module 3: Field-aware (chapter category + keywords) ──────────────────
  const categoryText = CHAPTER_CATEGORIES[chapter] ?? '';
  const chapterKeywords = CHAPTER_KEYWORDS[chapter] ?? [];
  let fieldScore = 0;
  let categoryHit = false;
  let keywordHit = false;

  for (const t of direct) { if (categoryText.includes(t)) { fieldScore += 0.7; categoryHit = true; } }
  for (const t of expanded) { if (categoryText.includes(t)) { fieldScore += 0.7 * 0.6; categoryHit = true; } }
  for (const t of fuzzy) { if (categoryText.includes(t)) { fieldScore += 0.7 * 0.5; categoryHit = true; } }
  for (const t of direct) { if (chapterKeywords.includes(t)) { fieldScore += 12; keywordHit = true; } }
  for (const t of expanded) { if (chapterKeywords.includes(t)) { fieldScore += 12 * 0.6; keywordHit = true; } }
  for (const t of fuzzy) { if (chapterKeywords.includes(t)) { fieldScore += 12 * 0.5; keywordHit = true; } }

  score += fieldScore;

  // ── Module 4: Material boost ───────────────────────────────────────────────
  let materialBoost = 0;
  for (const t of direct) { if (MATERIAL_INDICATORS.has(t) && (descTokens.has(t) || descLower.includes(t))) materialBoost += 40; }
  for (const t of expanded) { if (MATERIAL_INDICATORS.has(t) && (descTokens.has(t) || descLower.includes(t))) materialBoost += 24; }
  for (const t of fuzzy) { if (MATERIAL_INDICATORS.has(t) && (descTokens.has(t) || descLower.includes(t))) materialBoost += 20; }

  score += materialBoost;

  // ── Module 5: Product boost ───────────────────────────────────────────────
  let productBoost = 0;
  for (const t of direct) { if (PRODUCT_INDICATORS.has(t) && (descTokens.has(t) || descLower.includes(t))) productBoost += 25; }
  for (const t of expanded) { if (PRODUCT_INDICATORS.has(t) && (descTokens.has(t) || descLower.includes(t))) productBoost += 15; }
  for (const t of fuzzy) { if (PRODUCT_INDICATORS.has(t) && (descTokens.has(t) || descLower.includes(t))) productBoost += 12; }

  score += productBoost;

  // ── Module 6: Semantic (cosine) similarity ────────────────────────────────
  const semanticScore = cosineSimilarity(eq, descTokens);

  score += semanticScore * 40;


  // ── Module 7: Industry chapter boost / penalty ────────────────────────────
  let industryBoost = 0;
  let industryNote = '';
  if (industryChapters && industryChapters.size > 0) {
    if (industryChapters.has(chapter)) {
      industryBoost = 20;
      industryNote = `Industry-matched chapter ${chapter} (+20 pts)`;
    } else {
      industryBoost = -10;
      industryNote = `Cross-industry penalty: chapter ${chapter} unrelated (−10 pts)`;
    }
  }

  score += industryBoost;

  // ── Module 8: Generic description penalty ────────────────────────────────
  const GENERIC_INDICATORS = ['other', 'general', 'miscellaneous', 'not elsewhere specified', 'nes', 'parts thereof'];
  const queryIsGeneric = GENERIC_INDICATORS.some(g => direct.some(t => t.includes(g)));
  let genericPenalty = 0;
  if (!queryIsGeneric) {
    let gc = 0;
    for (const g of GENERIC_INDICATORS) { if (descLower.includes(g)) gc++; }
    genericPenalty = gc * 15;
  }

  score -= genericPenalty;

  // ── Module 9: Category Specificity Refinement ─────────────────────────────────
  // Goal: ensure "galvanized iron SHEETS" outranks "galvanized iron TANKS"
  //
  // A token is a "category discriminator" when:
  //   • It is in PRODUCT_INDICATORS (a physical product category word), AND
  //   • Its IDF ≥ IDF_DISC_THRESHOLD (appears in <30% of records — not too common)
  //
  // Rules (universal — no material/industry words hardcoded):
  //   +30  per query discriminator that the result description ALSO contains
  //   −10  per query discriminator ABSENT from the result
  //   −20  per result PRODUCT_INDICATOR that ≠1 query discriminators exist AND
  //          this result indicator is NOT among the query discriminators
  //          (signals the result is in a different product category)
  const IDF_DISC_THRESHOLD = Math.log(indexedRecords.length * 0.05 + 1); // ≈5% of docs

  // Collect query-side discriminators (product-type tokens that are rare enough)
  const queryDiscriminators = new Set<string>();
  for (const t of direct) {
    if (PRODUCT_INDICATORS.has(t) && getIDF(t) >= IDF_DISC_THRESHOLD) {
      queryDiscriminators.add(t);
    }
  }
  // Also consider plural/singular siblings already in PRODUCT_INDICATORS
  for (const t of expanded) {
    if (PRODUCT_INDICATORS.has(t) && getIDF(t) >= IDF_DISC_THRESHOLD) {
      queryDiscriminators.add(t);
    }
  }

  let specificityScore = 0;
  let specificityNote = '';

  if (queryDiscriminators.size > 0) {
    let hits = 0;
    let misses = 0;
    let conflicts = 0;

    for (const disc of queryDiscriminators) {
      if (descTokens.has(disc) || descLower.includes(disc)) {
        hits++;
      } else {
        misses++;
      }
    }

    // Count conflicting product-type tokens in result (different category)
    for (const t of descTokens) {
      if (
        PRODUCT_INDICATORS.has(t) &&
        getIDF(t) >= IDF_DISC_THRESHOLD &&
        !queryDiscriminators.has(t)
      ) {
        conflicts++;
      }
    }

    specificityScore = (hits * 30) - (misses * 15) - (conflicts * 35);

    if (specificityScore !== 0) {
      const parts: string[] = [];
      if (hits > 0) parts.push(`category match ×${hits}`);
      if (misses > 0) parts.push(`missing ×${misses}`);
      if (conflicts > 0) parts.push(`conflict ×${conflicts}`);
      specificityNote = `Category specificity (${parts.join(', ')}): ${specificityScore > 0 ? '+' : ''}${specificityScore} pts`;
    }
  }

  score += specificityScore;

  // Build human-readable reason list
  const reasons: string[] = [];
  if (matchedDirect.length > 0)
    reasons.push(`Matched tokens: ${matchedDirect.join(', ')}`);
  if (matchedSynonyms.length > 0)
    reasons.push(`Synonym matches: ${matchedSynonyms.join(', ')}`);
  if (matchedFuzzy.length > 0)
    reasons.push(`Fuzzy matches (typo-corrected): ${matchedFuzzy.join(', ')}`);
  if (phraseMatch)
    reasons.push('Exact phrase bonus applied (+120)');
  if (keywordHit)
    reasons.push(`Chapter keyword field match (+${fieldScore.toFixed(0)} pts)`);
  if (categoryHit && !keywordHit)
    reasons.push('Chapter category field match');
  if (materialBoost > 0)
    reasons.push(`Material indicator boost (+${materialBoost} pts)`);
  if (productBoost > 0)
    reasons.push(`Product type boost (+${productBoost} pts)`);
  if (semanticScore > 0.1)
    reasons.push(`Semantic similarity: ${(semanticScore * 100).toFixed(0)}%`);
  if (genericPenalty > 0)
    reasons.push(`Generic category penalty (−${genericPenalty} pts)`);
  if (genericPenalty === 0 && !queryIsGeneric)
    reasons.push('Generic category penalty avoided');
  if (industryNote)
    reasons.push(industryNote);

  return {
    score,
    explanation: {
      matchedTokens: matchedDirect,
      synonymMatches: matchedSynonyms,
      fuzzyMatches: matchedFuzzy,
      phraseMatch,
      keywordField: keywordHit,
      categoryField: categoryHit,
      materialBoost,
      productBoost,
      semanticScore,
      genericPenalty,
      coverageScore,
      totalScore: score,
      reasons,
    },
  };
}

// ─── Self-Learning Ranking (localStorage) ────────────────────────────────────
/**
 * Offline-compatible click frequency store.
 *
 * Schema (JSON in localStorage key 'hsn_click_log'):
 *   Record<normalizedQuery, Record<hsnCode, clickCount>>
 *
 * Guards against SSR / Node environments where localStorage is unavailable.
 */
const LS_KEY = 'hsn_click_log';

type ClickStore = Record<string, Record<string, number>>;

function readStore(): ClickStore {
  try {
    if (typeof localStorage === 'undefined') return {};
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as ClickStore) : {};
  } catch { return {}; }
}

function writeStore(store: ClickStore): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(LS_KEY, JSON.stringify(store));
  } catch { /* storage full or unavailable — fail silently */ }
}

/**
 * Call this whenever a user clicks / selects an HSN result.
 * Persists the event to localStorage and updates the in-memory cache.
 */
export function logClick(query: string, hsnCode: string): void {
  const key = query.trim().toLowerCase();
  if (!key || !hsnCode) return;
  const store = readStore();
  if (!store[key]) store[key] = {};
  store[key][hsnCode] = (store[key][hsnCode] ?? 0) + 1;
  writeStore(store);
}

/**
 * Returns a Map<hsnCode, clickCount> for the current query by:
 *   1. Exact normalized-query match
 *   2. Stored queries whose tokens ≥ 50% overlap with the current query tokens
 *      (handles abbreviation expansion, e.g. "ms pipe" ≈ "mild steel pipe")
 */
function getBoostMap(directTokens: string[]): Map<string, number> {
  const store = readStore();
  const boost = new Map<string, number>();
  if (Object.keys(store).length === 0) return boost;

  const currentSet = new Set(directTokens);

  for (const [storedQuery, codeMap] of Object.entries(store)) {
    const storedTokens = storedQuery.split(/\s+/).filter(t => t.length >= 2);
    if (storedTokens.length === 0) continue;

    // Overlap ratio: shared tokens / stored query token count
    const shared = storedTokens.filter(t => currentSet.has(t)).length;
    const overlapRatio = shared / storedTokens.length;

    if (overlapRatio >= 0.5) {
      for (const [code, count] of Object.entries(codeMap)) {
        // Take the max click count across all similar query matches
        boost.set(code, Math.max(boost.get(code) ?? 0, count));
      }
    }
  }
  return boost;
}

/** Returns the raw click store (for debugging / analytics UI). */
export function getLearningStore(): ClickStore { return readStore(); }

// ─── Main Search (index-accelerated) ──────────────────────────────────────────
export async function searchHSN(
  query: string,
  limit = 5,
): Promise<Array<{ record: HSNRecord; score?: number; explanation?: ScoreExplanation }>> {
  const q = String(query || '').trim();
  if (!q) return [];

  const eq = expandQuery(q);
  if (eq.direct.length === 0) return [];

  const candidateIds = getCandidateIds(eq);

  // Compute once per query — industry detection for chapter boost/penalty
  const industryChapters = detectIndustryChapters(eq.direct);

  // Learning boosts — derived from prior user clicks
  const boostMap = getBoostMap(eq.direct);

  const results: Array<{ record: HSNRecord; score: number; explanation: ScoreExplanation }> = [];
  for (const id of candidateIds) {
    const ir = indexedRecords[id];
    const { score, explanation } = scoreEntry(eq, ir, industryChapters);
    if (score <= 0) continue;

    // learningBoost = log(clickFrequency + 1) × 10
    const clickCount = boostMap.get(ir.record.hsn_sac) ?? 0;
    const learningBoost = clickCount > 0 ? Math.log(clickCount + 1) * 10 : 0;
    const finalScore = score + learningBoost;

    // Reflect boost in explanation reasons
    if (learningBoost > 0) {
      explanation.reasons.push(
        `Self-learning boost: clicked ${clickCount}× for similar queries (+${learningBoost.toFixed(1)} pts)`
      );
      explanation.totalScore = finalScore;
    }

    results.push({ record: ir.record, score: finalScore, explanation });
  }

  // ─── Stable multi-key sort ─────────────────────────────────────────────────
  // Scores within SCORE_THRESHOLD are treated as tied.
  // Tiebreaks applied in priority order:
  //   1. Code depth     — deeper HSN code wins (73061910 > 7306 > 73)
  //   2. Phrase length  — more query tokens matched as a phrase
  //   3. Coverage ratio — higher proportion of query tokens matched
  //   4. Desc length    — shorter description = more specific heading
  const SCORE_THRESHOLD = 5;
  results.sort((a, b) => {
    const scoreDiff = b.score - a.score;
    if (Math.abs(scoreDiff) > SCORE_THRESHOLD) return scoreDiff;

    // Tiebreak 1: deeper code (more digits = more specific in the HSN hierarchy)
    const aDepth = (a.record.hsn_sac ?? '').replace(/\./g, '').length;
    const bDepth = (b.record.hsn_sac ?? '').replace(/\./g, '').length;
    if (bDepth !== aDepth) return bDepth - aDepth;

    // Tiebreak 2: longer phrase match (number of query tokens present as a phrase)
    const aPhraseLen = a.explanation?.phraseMatch ? (a.explanation?.matchedTokens?.length ?? 0) : 0;
    const bPhraseLen = b.explanation?.phraseMatch ? (b.explanation?.matchedTokens?.length ?? 0) : 0;
    if (bPhraseLen !== aPhraseLen) return bPhraseLen - aPhraseLen;

    // Tiebreak 3: higher token coverage ratio
    const covDiff = (b.explanation?.coverageScore ?? 0) - (a.explanation?.coverageScore ?? 0);
    if (Math.abs(covDiff) > 0.01) return covDiff;

    // Tiebreak 4: shorter (more specific) description
    return (a.record.description?.length ?? 0) - (b.record.description?.length ?? 0);
  });
  return results.slice(0, limit);
}

export function searchHSNSync(query: string, data?: HSNRecord[]): HSNRecord[] {
  const eq = expandQuery(query);
  const candidateIds = getCandidateIds(eq);
  const results: Array<{ record: HSNRecord; score: number }> = [];
  for (const id of candidateIds) {
    const ir = indexedRecords[id];
    const { score } = scoreEntry(eq, ir);
    if (score > 0) results.push({ record: ir.record, score });
  }
  // Simple stable sort for sync variant (no explanation available)
  results.sort((a, b) => {
    const scoreDiff = b.score - a.score;
    if (Math.abs(scoreDiff) > 5) return scoreDiff;
    // Tiebreak: shorter description = more specific
    return (a.record.description?.length ?? 0) - (b.record.description?.length ?? 0);
  });
  return results.map(r => r.record);
}

export async function ensureIndex() { /* index built at load time */ }
export function getAllCount() { return dataset.length; }
export default { searchHSN, getAllCount, ensureIndex };

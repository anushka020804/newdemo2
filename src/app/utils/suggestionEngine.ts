/**
 * suggestionEngine.ts
 *
 * Startup: builds a prefix → ranked-phrases index from the full 21k-record dataset.
 * Runtime: O(1) per keystroke — single Map.get() against the precomputed index.
 *
 * No ML libraries. Works fully offline and client-side.
 */

import rawData from '../data/master_gst_data.json';

// ─── Stop-words (excluded from phrases) ───────────────────────────────────────
const STOPWORDS = new Set([
    'of', 'and', 'or', 'the', 'a', 'an', 'in', 'to', 'for', 'by', 'on',
    'at', 'with', 'not', 'as', 'is', 'it', 'its', 'than', 'that', 'from',
    'such', 'other', 'whether', 'which', 'but', 'if', 'be', 'are', 'has',
    'have', 'been', 'these', 'those', 'than', 'more', 'into', 'over',
]);

// Minimum token length to include in n-grams
const MIN_TOKEN_LEN = 3;

// ─── Phrase frequency map (phrase → count across all descriptions) ─────────────
const phraseFreq = new Map<string, number>();

type MasterEntry = { code: string; description: string };
const records: MasterEntry[] = Array.isArray(rawData) ? (rawData as MasterEntry[]) : [];

/** Tokenize a description into clean words. */
function descTokens(desc: string): string[] {
    return desc
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(t => t.length >= MIN_TOKEN_LEN && !STOPWORDS.has(t));
}

// Extract 1-gram, 2-gram, 3-gram phrases and count frequency
for (const r of records) {
    const tokens = descTokens(r.description ?? '');
    for (let i = 0; i < tokens.length; i++) {
        // unigram
        const uni = tokens[i];
        phraseFreq.set(uni, (phraseFreq.get(uni) ?? 0) + 1);

        // bigram
        if (i + 1 < tokens.length) {
            const bi = `${tokens[i]} ${tokens[i + 1]}`;
            phraseFreq.set(bi, (phraseFreq.get(bi) ?? 0) + 1);
        }

        // trigram
        if (i + 2 < tokens.length) {
            const tri = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
            phraseFreq.set(tri, (phraseFreq.get(tri) ?? 0) + 1);
        }
    }
}

// ─── Prefix Index (prefix string → sorted phrase list) ────────────────────────
// For each phrase, index it under every prefix of its FIRST word of length ≥ 2.
// This lets us look up "sta" and get all phrases starting with "stainless".
// The Map is built once; lookup at query time is a single O(1) get().

const prefixIndex = new Map<string, Array<{ phrase: string; freq: number }>>();

for (const [phrase, freq] of phraseFreq) {
    // Only index phrases that appear more than once (noise filter)
    if (freq < 2) continue;

    const firstWord = phrase.split(' ')[0];
    // Index under every prefix of the first word (length 2 → full word)
    for (let len = 2; len <= firstWord.length; len++) {
        const prefix = firstWord.substring(0, len);
        let bucket = prefixIndex.get(prefix);
        if (!bucket) { bucket = []; prefixIndex.set(prefix, bucket); }
        bucket.push({ phrase, freq });
    }
}

// Sort each bucket by frequency descending (done once, not per query)
for (const bucket of prefixIndex.values()) {
    bucket.sort((a, b) => b.freq - a.freq);
}

// ─── Public API ────────────────────────────────────────────────────────────────

export interface Suggestion {
    phrase: string;
    freq: number;
}

/**
 * getSuggestions(input, limit?)
 *
 * Called on every keystroke. Internally does a single Map.get() — O(1).
 *
 * Strategy:
 *   - Splits input by spaces, takes the LAST typed word as the prefix
 *   - If the user has already typed multiple words, prepends the context
 *     word so suggestions feel contextual ("steel p" → "steel pipe ...")
 *
 * @param input  Raw user input string (e.g. "sta" or "steel pi")
 * @param limit  Max suggestions to return (default 8)
 */
export function getSuggestions(input: string, limit = 8): Suggestion[] {
    const trimmed = input.trim().toLowerCase();
    if (trimmed.length < 2) return [];

    const parts = trimmed.split(/\s+/);
    const lastWord = parts[parts.length - 1];
    const context = parts.length > 1 ? parts.slice(0, -1).join(' ') : '';

    // O(1) lookup
    const bucket = prefixIndex.get(lastWord) ?? [];
    if (bucket.length === 0) return [];

    const results: Suggestion[] = [];
    const seen = new Set<string>();

    for (const { phrase, freq } of bucket) {
        // If the user has typed context words, only include phrases that
        // contain those context words (soft filter, not hard gate)
        const displayPhrase = context ? `${context} ${phrase}` : phrase;
        if (!seen.has(displayPhrase)) {
            seen.add(displayPhrase);
            results.push({ phrase: displayPhrase, freq });
        }
        if (results.length >= limit) break;
    }

    return results;
}

/** Returns total number of phrases in the index (for diagnostics). */
export function getSuggestionIndexSize(): number {
    return phraseFreq.size;
}

export default { getSuggestions, getSuggestionIndexSize };

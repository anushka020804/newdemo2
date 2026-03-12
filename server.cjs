// Simple Node.js Express proxy for RPACPC API
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const {
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
} = require('./queryUtils.cjs');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Initialize Semantic Vector AI
// initSemanticSearch will be called after app.listen to avoid blocking boot
let genAI;
try {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️ Warning: GEMINI_API_KEY is missing. AI features will be disabled.");
  } else {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
} catch (e) {
  console.error("Failed to init Gemini AI", e);
}

// Simple in-memory cache with TTL
const cache = new Map();
function setCache(key, value, ttl = 60 * 60 * 1000) { // default 1 hour
  const expires = Date.now() + ttl;
  cache.set(key, { value, expires });
}
function getCache(key) {
  const ent = cache.get(key);
  if (!ent) return null;
  if (Date.now() > ent.expires) { cache.delete(key); return null; }
  return ent.value;
}
app.post('/api/pan-to-gst', async (req, res) => {
  const { pan, consent } = req.body;
  try {

    const apiRes = await fetch(process.env.VITE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': process.env.VITE_API_TOKEN,
        'secretkey': process.env.VITE_API_SECRET
      },
      body: JSON.stringify({ pan, consent })
    });
    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
});

app.post('/api/get-gst-details', async (req, res) => {
  const { gstNumber, consent } = req.body;
  try {
    const apiRes = await fetch('https://api.rpacpc.com/services/get-gst-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': process.env.VITE_API_TOKEN,
        'secretkey': process.env.VITE_API_SECRET
      },
      body: JSON.stringify({ gstNumber, consent })
    });
    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
});

app.post('/api/get-gst-details-advance', async (req, res) => {
  const { gstNumber, consent } = req.body;
  try {
    const apiRes = await fetch('https://api.rpacpc.com/services/bv010', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': process.env.VITE_API_TOKEN,
        'secretkey': process.env.VITE_API_SECRET
      },
      body: JSON.stringify({ gstNumber, hsnDetails: true, consent: consent || 'Y' })
    });
    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
});

app.post('/api/get-gst-return', async (req, res) => {
  const { gstin, financial_year, consent } = req.body;
  try {
    const apiRes = await fetch('https://api.rpacpc.com/services/get-gst-return', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': process.env.VITE_API_TOKEN,
        'secretkey': process.env.VITE_API_SECRET
      },
      body: JSON.stringify({ gstin, financial_year, consent: consent || 'Y' })
    });
    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
});

// NEW Chatbot and HSN Search Endpoints
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: "missing messages array" });

    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    let contextStr = "";
    if (lastUserMsg && lastUserMsg.content) {
      const q = lastUserMsg.content;
      try {
        if (isHSNCode(q)) {
          const master = loadMasterDataset() || [];
          const qStr = String(q).trim();
          const exact = master.filter(r => r && (String(r.code || '') === qStr || String(r.code || '').startsWith(qStr))).slice(0, 5);
          if (exact.length) {
            contextStr = `\n\nAUTHORITATIVE BACKEND DATA (Use this to answer if relevant):\n` + exact.map(r => `HSN: ${r.code} (${r.type || 'UNKNOWN'}), Description: ${r.description || ''}`).join('\n');
          }
        } else {
          const classes = detectProductClass(q);
          const materials = detectMaterial(q);
          const domain = detectQueryDomain(q);

          let master = loadMasterDataset() || [];
          master = hardFilterDataset(master, domain, classes);
          const ranked = customRankResults(master, q, classes, materials).slice(0, 5);

          if (ranked.length) {
            contextStr = `\n\nAUTHORITATIVE BACKEND DATA (Use this to answer if relevant):\n` + ranked.map(r => `HSN: ${r.item.code}, Description: ${r.item.description}, Relevance_Score: ${r.customScore}`).join('\n');
          }
        }
      } catch (e) {
        console.error("Context lookup failed:", e.message);
      }
    }

    const systemInstruction = `You are a professional, expert AI Assistant specialized in GST and HSN/SAC code classification for Indian businesses.
Your primary goal is to provide legally safe, highly accurate classifications based strictly on official descriptions and established trade terminology.

CRITICAL RULES:
1. CONCISENESS: Keep your text response to an absolute MAXIMUM of 1-2 short sentences. Never write paragraphs.
2. EXPERTISE: Maintain a professional, authoritative tone.
3. NO PERCENTAGES: NEVER provide percentage confidences. Use "HIGH RELEVANCE", "MEDIUM RELEVANCE", or "LOW RELEVANCE" if needed.
4. QUICK SELECT REFINEMENT: If the user's query is broad or vague (e.g. just "steel" or "pipes"), do NOT guess a single code. Briefly state the broad category, and then provide exactly 3 to 4 clickable refinement options using this precise syntax:
[OPTION: Seamless Pipes]
[OPTION: Welded Pipes]
[OPTION: Steel Sheets]
5. GROUNDING: Base your answers ONLY on the authoritative data provided. Do not hallucinate codes.

AUTHORITATIVE CONTEXT (if any):${contextStr}`;

    // Build history — exclude the last user message (it's sent via sendMessage)
    // SDK v0.24+: history entries must alternate user/model, starting with user
    const history = [];
    const historyMessages = messages.slice(0, -1); // all except last
    for (const m of historyMessages) {
      if (m.role === "system") continue;
      const sdkRole = m.role === "assistant" ? "model" : "user";
      // Skip leading model messages (history must start with user)
      if (history.length === 0 && sdkRole === "model") continue;
      history.push({ role: sdkRole, parts: [{ text: m.content || "" }] });
    }

    if (!genAI) {
      return res.status(401).json({ error: "api_key_invalid", answer: "I'm sorry, my AI backend is missing a valid Google Gemini API key. Please configure GEMINI_API_KEY in the .env file." });
    }

    // SDK v0.24+: systemInstruction is a plain string passed to getGenerativeModel
    const chatModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Use standard model name across environments
      systemInstruction,
    });

    const chat = chatModel.startChat({ history });

    const userText = lastUserMsg ? lastUserMsg.content : "";
    const result = await chat.sendMessage(userText);
    const responseText = result.response.text();

    res.json({ answer: responseText });
  } catch (err) {
    console.error("CHAT ERROR:", err?.message || err);
    const isQuota = err?.status === 429 || String(err?.message || '').toLowerCase().includes('quota') || String(err?.message || '').toLowerCase().includes('rate');
    if (isQuota) {
      return res.status(429).json({
        error: 'quota_exceeded',
        answer: "I'm sorry, I have reached my daily free-tier API request limit on Google Gemini. Please wait until the quota resets."
      });
    }
    res.status(500).json({ error: 'server error', answer: "I'm sorry, my AI backend encountered an error. Please try again later." });
  }
});

app.post('/api/find', async (req, res) => {
  try {
    const { keywords } = req.body;
    if (!keywords) return res.status(400).json({ error: 'missing keywords' });
    const qraw = String(keywords || '').trim();

    const cacheKey = `find_${qraw.toLowerCase()}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    if (isHSNCode(qraw)) {
      const master = loadMasterDataset();
      if (!master || master.length === 0) return res.status(500).json({ error: "Master dataset failed to load." });

      const exact = master.filter(r => r && (String(r.code || '') === qraw || String(r.code || '').startsWith(qraw)));
      if (exact.length) {
        const out = exact.slice(0, 30).map(r => ({
          code: String(r.code || ''),
          relevance: mapScoreToRelevance(100, true),
          description: r.description || '',
          keywords: extractKeywordsFromDescription(r.description || '', 6)
        }));
        const responseData = { hsn: out, raw: 'master exact' };
        setCache(cacheKey, responseData);
        return res.json(responseData);
      } else {
        return res.json({ hsn: [], message: "Code not found in dataset." });
      }
    }

    const domain = detectQueryDomain(qraw);
    const classes = detectProductClass(qraw);
    const materials = detectMaterial(qraw);
    const specificity = analyzeQuerySpecificity(qraw, classes, materials);
    const queryVector = await getEmbedding(qraw);

    let master = loadMasterDataset();
    master = hardFilterDataset(master, domain, classes);
    let ranked = customRankResults(master, qraw, classes, materials, queryVector);

    if (ranked.length > 0) {
      const finalResults = ranked.slice(0, 25).map(r => ({
        code: String(r.item.code || ''),
        description: r.item.description || '',
        relevance: mapScoreToRelevance(r.customScore),
        confidence: r.customScore,
        type: r.item.type || 'UNKNOWN',
        keywords: extractKeywordsFromDescription(r.item.description || '', 6)
      }));
      const responseData = { hsn: finalResults, specificity, domain, detectedClasses: classes, detectedMaterials: materials, raw: 'strict_pipeline' };
      setCache(cacheKey, responseData);
      return res.json(responseData);
    } else {
      return res.json({ hsn: [], message: "No matching classifications found." });
    }
  } catch (err) {
    console.error('CLASSIFICATION ERROR: /api/find failed\n', err.stack);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/api/master/:code', async (req, res) => {
  try {
    const code = String(req.params.code || '').trim();
    if (!code) return res.status(400).json({ error: 'missing code' });
    const master = loadMasterDataset();
    const matches = master.filter(r => r && (String(r.code || '').startsWith(code) || String(r.code || '') === code));
    if (!matches.length) return res.status(404).json({ error: 'Code not found' });
    const out = matches.map(r => ({
      code: String(r.code || ''),
      description: r.description || '',
      type: r.type || 'UNKNOWN',
      keywords: extractKeywordsFromDescription(r.description || '', 6)
    }));
    res.json({ results: out });
  } catch (e) {
    res.status(500).json({ error: 'server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  // Start AI initialization in background
  initSemanticSearch().catch(err => console.error("Background AI init failed", err));
});

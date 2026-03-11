const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/test-pan', async (req, res) => {
  const { pan, consent } = req.body;

  console.log('\n========== TEST PAN API ==========');
  console.log('PAN:', pan);
  console.log('Consent:', consent);
  console.log('URL:', process.env.VITE_API_URL);
  console.log('Token:', process.env.VITE_API_TOKEN ? process.env.VITE_API_TOKEN.slice(0, 20) + '...' : 'MISSING');
  console.log('Secret:', process.env.VITE_API_SECRET || 'MISSING');

  try {
    const response = await fetch(process.env.VITE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': process.env.VITE_API_TOKEN,
        'secretkey': process.env.VITE_API_SECRET
      },
      body: JSON.stringify({ pan, consent })
    });

    console.log('\n--- RESPONSE ---');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);

    const raw = await response.text();
    console.log('Raw Body:', raw);

    let parsed;
    try {
      parsed = JSON.parse(raw);
      console.log('Parsed JSON:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('NOT JSON - raw text above');
      parsed = { raw };
    }

    console.log('==================================\n');
    res.json(parsed);
  } catch (err) {
    console.error('FETCH ERROR:', err.message);
    console.error('Stack:', err.stack);
    console.log('==================================\n');
    res.status(500).json({ error: err.message });
  }
});

app.listen(5555, () => {
  console.log('Test PAN server running on http://localhost:5555');
  console.log('Hit it with:');
  console.log('  curl -X POST http://localhost:5555/test-pan -H "Content-Type: application/json" -d \'{"pan":"YOURPAN","consent":"Y"}\'');
});

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Replace with your actual Google Cloud Translation API Key
const GOOGLE_API_KEY = 'AIzaSyAGhVvrCLvT9R4BoOI8VeHlcOrG9GWNMXI'; 

// Middleware to handle CORS and JSON body parsing
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle translation
app.post('/translate', async (req, res) => {
  const { text, sourceLang, targetLang } = req.body;

  if (!text || !sourceLang || !targetLang) {
    return res.status(400).json({ error: 'Missing required parameters: text, sourceLang, targetLang' });
  }

  try {
    const translateUrl = `https://translation.googleapis.com/language/translate/v2?key=${key=AIzaSyAGhVvrCLvT9R4BoOI8VeHlcOrG9GWNMXI}`;

    // Call the Google Translate API
    const response = await axios.post(translateUrl, {
      q: text,
      source: sourceLang,
      target: targetLang,
    });

    if (response.data && response.data.data && response.data.data.translations) {
      const translatedText = response.data.data.translations[0].translatedText;
      return res.json({ translatedText });
    } else {
      return res.status(500).json({ error: 'Error in response from Google Translate API' });
    }
  } catch (error) {
    console.error('Error in translation:', error.message);
    return res.status(502).json({ error: 'Translation failed', details: error.message });
  }
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

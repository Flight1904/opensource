const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// Translation endpoint using LibreTranslate API
app.post("/translate", async (req, res) => {
  const { text, sourceLang, targetLang } = req.body;

  // Validate request parameters
  if (!text || !sourceLang || !targetLang) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    // LibreTranslate API endpoint
    const libreTranslateUrl = `https://libretranslate.de/translate`; // Changed to a stable LibreTranslate endpoint

    // Make the request to LibreTranslate
    const response = await axios.post(
      libreTranslateUrl,
      {
        q: text,
        source: sourceLang,
        target: targetLang,
        format: "text",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // Handle the response from LibreTranslate
    if (response.data && response.data.translatedText) {
      res.json({ translatedText: response.data.translatedText });
    } else {
      res.status(500).json({ error: "Unexpected response structure from LibreTranslate" });
    }
  } catch (error) {
    console.error("Error translating text:", error.message);
    res.status(500).json({ error: "Translation failed", details: error.message });
  }
});

// Root endpoint to check if the server is running
app.get("/", (req, res) => {
  res.send("Multilingual Voice Assistant Backend is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

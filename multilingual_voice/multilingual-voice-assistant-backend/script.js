// Select DOM elements
const startBtn = document.getElementById("startBtn");
const inputLanguageSelect = document.getElementById("inputLanguageSelect");
const outputLanguageSelect = document.getElementById("outputLanguageSelect");
const speechOutput = document.getElementById("speechOutput");
const translationOutput = document.getElementById("translationOutput");

// Initialize speech recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.interimResults = false;
recognition.lang = "en-US"; // Default language for recognition

// Toggle button text and start/stop recognition
startBtn.addEventListener("click", () => {
  if (recognition.recognizing) {
    recognition.stop();
    startBtn.textContent = "Start Listening";
  } else {
    recognition.lang = inputLanguageSelect.value + "-US";
    recognition.start();
    startBtn.textContent = "Stop Listening";
  }
});

// Handle recognition results
recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  speechOutput.textContent = transcript;

  try {
    const translation = await translateText(transcript, outputLanguageSelect.value);
    translationOutput.textContent = translation;
    speakText(translation, outputLanguageSelect.value);
  } catch (error) {
    console.error("Translation error:", error);
    translationOutput.textContent = "Translation failed. Check console for details.";
  }
};

// Translation function using the backend endpoint
async function translateText(text, targetLang) {
  const sourceLang = inputLanguageSelect.value;
  const url = `http://localhost:5000/translate`; // Use your deployed server URL in production

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text,
        sourceLang: sourceLang,
        targetLang: targetLang,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error("Error with backend translation:", error);
    throw error;
  }
}

// Text-to-speech function
function speakText(text, lang) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
}

// Handle speech recognition errors
recognition.onerror = (event) => {
  console.error("Speech recognition error:", event.error);
};

// Reset button text when recognition ends
recognition.onend = () => {
  startBtn.textContent = "Start Listening";
};

// DOM Elements
const startBtn = document.getElementById("startBtn");
const inputLanguageSelect = document.getElementById("inputLanguageSelect");
const outputLanguageSelect = document.getElementById("outputLanguageSelect");
const speechOutput = document.getElementById("speechOutput");
const translationOutput = document.getElementById("translationOutput");

// Initialize Speech Recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.interimResults = false;
recognition.lang = "en-US"; // Default language

// Button click event to start and stop listening
startBtn.addEventListener("click", () => {
  if (recognition.recognizing) {
    recognition.stop();
    startBtn.textContent = "Start Listening";
  } else {
    recognition.lang = inputLanguageSelect.value + "-US"; // Set the recognition language
    recognition.start();
    startBtn.textContent = "Stop Listening";
  }
});

// Handle speech recognition results
recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  speechOutput.textContent = transcript;

  try {
    const translation = await translateText(transcript, outputLanguageSelect.value);
    translationOutput.textContent = translation;
    speakText(translation, outputLanguageSelect.value);
  } catch (error) {
    console.error("Translation error:", error);
    translationOutput.textContent = "Translation failed.";
  }
};

// Send text to the backend to get translation
async function translateText(text, targetLang) {
  const sourceLang = inputLanguageSelect.value;
  const response = await fetch("/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: text,
      sourceLang: sourceLang,
      targetLang: targetLang
    })
  });

  const data = await response.json();
  return data.translatedText;
}

// Text-to-speech function
function speakText(text, lang) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
}

// Handle recognition errors
recognition.onerror = (event) => {
  console.error("Speech recognition error:", event.error);
};

// Reset button text when recognition ends
recognition.onend = () => {
  startBtn.textContent = "Start Listening";
};

const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "HyperType is a fun typing challenge.",
    "Speed and accuracy are key to success.",
    "Practice makes perfect in typing.",
    "How fast can you type this sentence?"
  ];
  
  function getRandomSentence() {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    return sentences[randomIndex];
  }

  // Elements
const sentenceEl = document.getElementById("sentence");
const inputEl = document.getElementById("input");
const startBtn = document.getElementById("start-btn");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");

// Variables
let startTime, endTime, currentSentence;

// Start Button Click Event
startBtn.addEventListener("click", () => {
  // Reset Results
  wpmEl.textContent = "WPM: 0";
  accuracyEl.textContent = "Accuracy: 0%";

  // Get Random Sentence
  currentSentence = getRandomSentence();
  sentenceEl.textContent = currentSentence;

  // Enable Input and Focus
  inputEl.value = "";
  inputEl.disabled = false;
  inputEl.focus();

  // Disable Start Button and Start Timer
  startBtn.disabled = true;
  startTime = new Date().getTime();
});

// Input Event
inputEl.addEventListener("input", () => {
  const typedText = inputEl.value;

  // Check if Typed Text Matches Sentence
  if (typedText === currentSentence) {
    // Stop Timer
    endTime = new Date().getTime();
    const timeTaken = (endTime - startTime) / 1000; // seconds

    // Calculate WPM
    const wordCount = currentSentence.split(" ").length;
    const wpm = Math.round((wordCount / timeTaken) * 60);
    wpmEl.textContent = `WPM: ${wpm}`;

    // Calculate Accuracy
    const accuracy = calculateAccuracy(currentSentence, typedText);
    accuracyEl.textContent = `Accuracy: ${accuracy}%`;

    // Disable Input and Enable Start Button
    inputEl.disabled = true;
    startBtn.disabled = false;
  }
});

// Accuracy Calculation
function calculateAccuracy(sentence, typedText) {
  const sentenceChars = sentence.split("");
  const typedChars = typedText.split("");
  let correctChars = 0;

  for (let i = 0; i < sentenceChars.length; i++) {
    if (sentenceChars[i] === typedChars[i]) {
      correctChars++;
    }
  }

  return Math.round((correctChars / sentenceChars.length) * 100);
}

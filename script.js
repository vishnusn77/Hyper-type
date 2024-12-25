// Elements
const sentenceEl = document.getElementById("sentence");
const inputEl = document.getElementById("input");
const startBtn = document.getElementById("start-btn");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const countdownEl = document.getElementById("countdown");
const highScoreEl = document.getElementById("high-score");
const toggleThemeBtn = document.getElementById("toggle-theme");

// Sentences Array
const sentences = [
  "The quick brown fox jumps over the lazy dog.",
  "HyperType is a fun typing challenge.",
  "Speed and accuracy are key to success.",
  "Practice makes perfect in typing.",
  "How fast can you type this sentence?"
];

// Variables
let startTime, currentSentence, timer;
let timeLeft = 60;
let highScore = 0;

// Random Sentence Generator
function getRandomSentence() {
  const randomIndex = Math.floor(Math.random() * sentences.length);
  return sentences[randomIndex];
}

// Start Game
startBtn.addEventListener("click", () => {
  resetGame();

  // Generate and display a random sentence
  currentSentence = getRandomSentence();
  displaySentenceProgress(""); // Initially display empty progress
  inputEl.disabled = false;
  inputEl.value = "";
  inputEl.focus();

  // Record start time and start countdown
  startTime = new Date().getTime();
  timer = setInterval(updateCountdown, 1000);
});

// Update Countdown Timer
function updateCountdown() {
  timeLeft--;
  countdownEl.textContent = `Time Left: ${timeLeft}s`;
  if (timeLeft <= 0) {
    endGame("Time's up! Press Start to try again.");
  }
}

// Input Event Listener for Real-Time Updates
inputEl.addEventListener("input", () => {
  const typedText = inputEl.value;

  // Display typing progress
  displaySentenceProgress(typedText);

  // Update WPM and Accuracy in real time
  updateStats(typedText);

  // Stop the game automatically if the user types the sentence correctly
  if (typedText === currentSentence) {
    endGame("Great job! You completed the sentence!");
  }
});

// Display Typing Progress
function displaySentenceProgress(typedText) {
  const sentenceArray = currentSentence.split("");
  const typedArray = typedText.split("");

  let formattedSentence = "";

  for (let i = 0; i < sentenceArray.length; i++) {
    if (typedArray[i] === undefined) {
      // Not yet typed, show as default
      formattedSentence += `<span>${sentenceArray[i]}</span>`;
    } else if (typedArray[i] === sentenceArray[i]) {
      // Correctly typed character (green)
      formattedSentence += sentenceArray[i] === " " 
        ? `<span style="color: green;"> </span>` 
        : `<span style="color: green;">${sentenceArray[i]}</span>`;
    } else {
      // Incorrectly typed character
      if (sentenceArray[i] === " ") {
        // Incorrect space - show space bar symbol (red)
        formattedSentence += `<span style="color: red;">⎵</span>`;
      } else {
        // Incorrect non-space character
        formattedSentence += `<span style="color: red;">${sentenceArray[i]}</span>`;
      }
    }
  }

  sentenceEl.innerHTML = formattedSentence;
}



// Update WPM and Accuracy
function updateStats(typedText) {
  const elapsedTime = (new Date().getTime() - startTime) / 1000; // Time in seconds
  const wordCount = currentSentence.split(" ").length;

  // Update WPM
  const wpm = Math.round((wordCount / elapsedTime) * 60);
  wpmEl.textContent = `WPM: ${wpm}`;

  // Update Accuracy
  const accuracy = calculateAccuracy(currentSentence, typedText);
  accuracyEl.textContent = `Accuracy: ${accuracy}%`;
}

// Accuracy Calculation
function calculateAccuracy(sentence, typedText) {
  const sentenceChars = sentence.split("");
  const typedChars = typedText.split("");
  let correctChars = 0;

  for (let i = 0; i < typedChars.length; i++) {
    if (typedChars[i] === sentenceChars[i]) {
      correctChars++;
    }
  }

  return Math.round((correctChars / sentenceChars.length) * 100);
}

// End Game
function endGame(message) {
  clearInterval(timer);
  inputEl.disabled = true;
  sentenceEl.textContent = message;
  startBtn.disabled = false;
}

// Reset Game
function resetGame() {
  clearInterval(timer);
  timeLeft = 60;
  countdownEl.textContent = `Time Left: 60s`;
  wpmEl.textContent = "WPM: 0";
  accuracyEl.textContent = "Accuracy: 0%";
  startBtn.disabled = true;
}

// Load High Score
window.onload = () => {
  const savedHighScore = localStorage.getItem("highScore");
  if (savedHighScore) {
    highScore = parseInt(savedHighScore, 10);
    highScoreEl.textContent = `High Score: ${highScore} WPM`;
  }
};

// Toggle Theme
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  toggleThemeBtn.textContent = document.body.classList.contains("light-mode")
    ? "🌙 Dark Mode"
    : "☀️ Light Mode";
});

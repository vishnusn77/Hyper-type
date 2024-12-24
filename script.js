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
let startTime, endTime, currentSentence, timer;
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
  currentSentence = getRandomSentence();
  sentenceEl.textContent = currentSentence;
  inputEl.disabled = false;
  inputEl.value = "";
  inputEl.focus();
  startTime = new Date().getTime();
  timer = setInterval(updateCountdown, 1000);
});

// Update Countdown Timer
function updateCountdown() {
  timeLeft--;
  countdownEl.textContent = `Time Left: ${timeLeft}s`;
  if (timeLeft <= 0) {
    endGame();
  }
}

// Input Listener
inputEl.addEventListener("input", () => {
  const typedText = inputEl.value;

  if (typedText === currentSentence) {
    endTime = new Date().getTime();
    const timeTaken = (endTime - startTime) / 1000;
    const wordCount = currentSentence.split(" ").length;
    const wpm = Math.round((wordCount / timeTaken) * 60);
    const accuracy = calculateAccuracy(currentSentence, typedText);

    wpmEl.textContent = `WPM: ${wpm}`;
    accuracyEl.textContent = `Accuracy: ${accuracy}%`;

    if (wpm > highScore) {
      highScore = wpm;
      highScoreEl.textContent = `High Score: ${highScore} WPM`;
      localStorage.setItem("highScore", highScore);
    }

    resetGame();
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

// End Game
function endGame() {
  clearInterval(timer);
  inputEl.disabled = true;
  startBtn.disabled = false;
  sentenceEl.textContent = "Time's up! Press Start to try again.";
}

// Reset Game
function resetGame() {
  clearInterval(timer);
  timeLeft = 60;
  countdownEl.textContent = `Time Left: 60s`;
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

// Elements
const sentenceEl = document.getElementById("sentence");
const inputEl = document.getElementById("input");
const startBtn = document.getElementById("start-btn");
const nextRoundBtn = document.getElementById("next-round-btn");
const quitBtn = document.getElementById("quit-btn");
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
let currentRound = 1;
let totalRounds = 10;
let roundScores = []; // Stores WPM for each round
let roundAccuracies = []; // Stores accuracy for each round
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

  // Hide buttons for new round
  nextRoundBtn.style.display = "none";
  quitBtn.style.display = "inline-block";
});

// Update Countdown Timer
function updateCountdown() {
  timeLeft--;
  countdownEl.textContent = `Time Left: ${timeLeft}s`;
  if (timeLeft <= 0) {
    endRound("Time's up! Press Next Round to continue.");
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
    endRound("Great job! Round completed.");
  }
});

// Display Typing Progress
function displaySentenceProgress(typedText) {
  const sentenceArray = currentSentence.split("");
  const typedArray = typedText.split("");

  let formattedSentence = "";

  for (let i = 0; i < sentenceArray.length; i++) {
    if (typedArray[i] === undefined) {
      formattedSentence += `<span>${sentenceArray[i]}</span>`;
    } else if (typedArray[i] === sentenceArray[i]) {
      formattedSentence += sentenceArray[i] === " " 
        ? `<span style="color: green;"> </span>` 
        : `<span style="color: green;">${sentenceArray[i]}</span>`;
    } else {
      if (sentenceArray[i] === " ") {
        formattedSentence += `<span style="color: red;">⎵</span>`;
      } else {
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

// End Current Round
function endRound(message) {
  clearInterval(timer);
  inputEl.disabled = true;
  sentenceEl.textContent = message;
  startBtn.style.display = "none";
  nextRoundBtn.style.display = "inline-block";

  // Calculate WPM and Accuracy for the round
  const elapsedTime = (new Date().getTime() - startTime) / 1000;
  const wordCount = currentSentence.split(" ").length;
  const wpm = Math.round((wordCount / elapsedTime) * 60);
  const accuracy = calculateAccuracy(currentSentence, inputEl.value);

  roundScores.push(wpm);
  roundAccuracies.push(accuracy);
}

// Go to Next Round
nextRoundBtn.addEventListener("click", () => {
  if (currentRound < totalRounds) {
    currentRound++;
    startBtn.style.display = "inline-block";
    nextRoundBtn.style.display = "none";
    countdownEl.textContent = `Round ${currentRound} of ${totalRounds}`;
  } else {
    displayFinalScore();
  }
});

// Quit Game
quitBtn.addEventListener("click", () => {
  displayFinalScore();
});

// Display Final Score
function displayFinalScore() {
  const totalScore = roundScores.reduce((sum, score) => sum + score, 0);
  const averageWPM = Math.round(totalScore / roundScores.length);
  const totalAccuracy = roundAccuracies.reduce((sum, acc) => sum + acc, 0);
  const averageAccuracy = Math.round(totalAccuracy / roundAccuracies.length);

  sentenceEl.innerHTML = `
    Game Over!<br>
    Total Score: <strong>${totalScore} WPM</strong><br>
    Average WPM: <strong>${averageWPM}</strong><br>
    Average Accuracy: <strong>${averageAccuracy}%</strong>
  `;

  inputEl.disabled = true;
  startBtn.style.display = "none";
  nextRoundBtn.style.display = "none";
  quitBtn.style.display = "none";
}

// Reset Game
function resetGame() {
  clearInterval(timer);
  timeLeft = 60;
  wpmEl.textContent = "WPM: 0";
  accuracyEl.textContent = "Accuracy: 0%";
  nextRoundBtn.style.display = "none";
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

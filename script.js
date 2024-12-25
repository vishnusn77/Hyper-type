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

// New Game Button (added dynamically)
let newGameBtn = document.createElement("button");
newGameBtn.textContent = "New Game";
newGameBtn.style.display = "none";
newGameBtn.addEventListener("click", startNewGame);
document.querySelector(".game-buttons").appendChild(newGameBtn);

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
let highScore = 0; // Reset high score for the session

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
  newGameBtn.style.display = "none"; // Hide "New Game" button during gameplay
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

  // Calculate WPM and Accuracy for the round
  const elapsedTime = (new Date().getTime() - startTime) / 1000;
  const wordCount = currentSentence.split(" ").length;
  const wpm = Math.round((wordCount / elapsedTime) * 60);
  const accuracy = calculateAccuracy(currentSentence, inputEl.value);

  // Add the scores to the arrays
  roundScores.push(wpm);
  roundAccuracies.push(accuracy);

  sentenceEl.textContent = message;
  startBtn.style.display = "none";
  nextRoundBtn.style.display = "inline-block";
}

// Go to Next Round
nextRoundBtn.addEventListener("click", () => {
  if (currentRound < totalRounds) {
    currentRound++;
    resetGameForNextRound();
    countdownEl.textContent = `Round ${currentRound} of ${totalRounds}`;
    startBtn.style.display = "inline-block";
    nextRoundBtn.style.display = "none";
    sentenceEl.textContent = "Press 'Start' to begin the next round!";
  } else {
    displayFinalScore();
  }
});

// Reset Game for Next Round
function resetGameForNextRound() {
  clearInterval(timer);
  timeLeft = 60;
  wpmEl.textContent = "WPM: 0";
  accuracyEl.textContent = "Accuracy: 0%";
  inputEl.value = "";
  inputEl.disabled = true; // Disable typing until the next round starts
  sentenceEl.textContent = "";
}

// Quit Game
quitBtn.addEventListener("click", () => {
  displayFinalScore();
});

// Display Final Score
function displayFinalScore() {
  // Handle cases where no rounds were completed
  if (roundScores.length === 0) {
    sentenceEl.innerHTML = `
      Game Over!<br>
      No rounds were completed.<br>
      Press "New Game" to start again!
    `;
    inputEl.disabled = true;
    startBtn.style.display = "none";
    nextRoundBtn.style.display = "none";
    quitBtn.style.display = "none";
    newGameBtn.style.display = "inline-block"; // Show "New Game" button
    return;
  }

  // Calculate Total Score
  const totalScore = roundScores.reduce((sum, score) => sum + score, 0);

  // Calculate Average WPM
  const averageWPM = Math.round(totalScore / roundScores.length);

  // Calculate Average Accuracy
  const totalAccuracy = roundAccuracies.reduce((sum, acc) => sum + acc, 0);
  const averageAccuracy = Math.round(totalAccuracy / roundAccuracies.length);

  // Update High Score for the current session
  if (totalScore > highScore) {
    highScore = totalScore;
    highScoreEl.textContent = `High Score: ${highScore} WPM`;
  }

  // Display the final results
  sentenceEl.innerHTML = `
    Game Over!<br>
    Total Score: <strong>${totalScore} WPM</strong><br>
    Average WPM: <strong>${averageWPM}</strong><br>
    Average Accuracy: <strong>${averageAccuracy}%</strong><br>
    <p>Press "New Game" to start again!</p>
  `;

  inputEl.disabled = true;
  startBtn.style.display = "none";
  nextRoundBtn.style.display = "none";
  quitBtn.style.display = "none";
  newGameBtn.style.display = "inline-block"; // Show "New Game" button
}

// Start New Game
function startNewGame() {
  // Reset everything for a fresh game
  roundScores = [];
  roundAccuracies = [];
  currentRound = 1;
  countdownEl.textContent = `Round ${currentRound} of ${totalRounds}`;
  sentenceEl.textContent = "Press 'Start' to begin!";
  resetGame();
  startBtn.style.display = "inline-block";
  newGameBtn.style.display = "none"; // Hide "New Game" button
}

// Reset Game
function resetGame() {
  clearInterval(timer);
  timeLeft = 60;
  wpmEl.textContent = "WPM: 0";
  accuracyEl.textContent = "Accuracy: 0%";
  nextRoundBtn.style.display = "none";
}

// Reset High Score at the start of the session
window.onload = () => {
  highScore = 0; // Reset high score for the session
  highScoreEl.textContent = `High Score: ${highScore} WPM`;
};

// Toggle Theme
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  toggleThemeBtn.textContent = document.body.classList.contains("light-mode")
    ? "🌙 Dark Mode"
    : "☀️ Light Mode";
});

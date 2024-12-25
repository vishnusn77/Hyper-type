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
const themeSwitch = document.getElementById("theme-switch");
const themeText = document.getElementById("theme-mode");

// New Game Button (added dynamically)
let newGameBtn = document.createElement("button");
newGameBtn.textContent = "New Game";
newGameBtn.classList.add("action-btn"); // Add the action-btn class for consistent styling
newGameBtn.style.display = "none"; // Initially hidden
newGameBtn.addEventListener("click", startNewGame);
document.querySelector(".game-buttons").appendChild(newGameBtn);

// Sentences Array
const sentences = [
  "The quick brown fox jumps over the lazy dog while the sun sets behind the mountains and the stars begin to sparkle in the night sky.",
  "A journey of a thousand miles begins with a single step, but it also requires courage, determination, and perseverance to reach the destination.",
  "In the age of rapid technological advancements, staying updated with the latest innovations has become an essential skill for survival and growth.",
  "Typing games are an excellent way to improve speed, accuracy, and confidence while also enhancing focus and hand-eye coordination.",
  "The curious cat cautiously approached the garden, where butterflies danced above colorful flowers blooming under the bright summer sun.",
  "If you believe in yourself and work hard every single day, success will eventually knock on your door and reward your relentless efforts.",
  "The city buzzed with activity as people hurried through the streets, unaware of the magical surprise awaiting them around the next corner.",
  "Learning how to code is like learning a new language, opening doors to endless possibilities, creativity, and problem-solving adventures.",
  "On a cold winter morning, the little boy bundled up in a warm coat and scarf to explore the snow-covered park filled with wonders.",
  "The spaceship soared into the galaxy, leaving behind the vibrant blue planet, as its crew embarked on a daring mission to uncover cosmic mysteries."
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
  return sentences[currentRound - 1]; // Use current round to pick the sentence in order
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
  clearInterval(timer); // Stop the timer
  displayFinalScore();
});

// Display Final Score
function displayFinalScore() {
  clearInterval(timer); // Stop the timer when the game ends

  // Handle cases where no rounds were completed
  if (roundScores.length === 0) {
    sentenceEl.innerHTML = `
      <div style="text-align: center;">
        Game Over!<br>
        No rounds were completed.<br>
        Press "New Game" to start again!
      </div>
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
    <div style="text-align: center;">
      Game Over!<br>
      Total Score: <strong>${totalScore} WPM</strong><br>
      Average WPM: <strong>${averageWPM}</strong><br>
      Average Accuracy: <strong>${averageAccuracy}%</strong><br>
      <p>Press "New Game" to start again!</p>
    </div>
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

// Theme Toggle Functionality
themeSwitch.addEventListener("change", () => {
  const isDarkMode = document.body.classList.toggle("dark-mode");

  // Update the theme text
  themeText.textContent = isDarkMode ? "Dark" : "Light";
});

// Set the initial state for "Dark" as default
window.onload = () => {
  highScore = 0; // Reset high score for the session
  highScoreEl.textContent = `High Score: ${highScore} WPM`;

  // Initialize the theme
  themeSwitch.checked = true; // Default dark mode
  themeText.textContent = "Dark"; // Default text

  // Disable copy-paste in the input box
  inputEl.addEventListener("paste", (e) => e.preventDefault());
  inputEl.addEventListener("copy", (e) => e.preventDefault());
};
const levels = [
  { rows: 2, cols: 3, time: 10 },
  { rows: 3, cols: 4, time: 25 },
  { rows: 4, cols: 4, time: 35 },
  { rows: 4, cols: 5, time: 45 },
  { rows: 5, cols: 6, time: 60 },
  { rows: 6, cols: 6, time: 75 },
  { rows: 6, cols: 7, time: 90 },
];
let emojis = [
  "🍎",
  "🍌",
  "🍇",
  "🍉",
  "🍓",
  "🍒",
  "🥝",
  "🍍",
  "🍊",
  "🍋",
  "🥥",
  "🍑",
  "🥭",
  "🍈",
  "🍏",
];
let currentLevel = 0,
  score = 0,
  matchedPairs = 0;
let cards,
  firstCard,
  secondCard,
  lockBoard = false;
let timeLeft, timerInterval;
let highScores = JSON.parse(localStorage.getItem("highScores")) || [0, 0, 0];
let isPaused = false; // Biến kiểm tra trạng thái tạm dừng thời gian
let gameOver = false;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Popup Message
function showPopup(message, persistent = false) {
  const popup = document.getElementById("popup");
  popup.innerHTML = message;

  if (persistent) {
    popup.innerHTML += `<br><button onclick="closePopup()" style="margin-top:10px; padding:5px 10px; font-size:16px;">Đóng</button>`;
  }

  popup.style.display = "block";

  if (!persistent) {
    setTimeout(() => {
      popup.style.display = "none";
    }, 5000);
  }
}

function closePopup() {
  document.getElementById("popup").style.display = "none";

  if (isPaused) {
    isPaused = false; // Tiếp tục thời gian
    startTimer();
  }
}

function createBoard() {
  const gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = "";

  document.getElementById("nextStep").style.display = "none";
  document.getElementById("playAgain").style.display = "none";
  document.getElementById("highScores").style.display = "block";

  let level = levels[currentLevel];
  let screenWidth = window.innerWidth;
  let cardSize =
    screenWidth < 768 ? Math.floor(screenWidth / level.cols) - 10 : 100;

  gameBoard.style.gridTemplateColumns = `repeat(${level.cols}, ${cardSize}px)`;

  let pairs = (level.rows * level.cols) / 2;
  cards = shuffle([...emojis.slice(0, pairs), ...emojis.slice(0, pairs)]);

  cards.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.style.width = `${cardSize}px`;
    card.style.height = `${cardSize}px`;
    card.style.fontSize = `${cardSize / 3}px`;
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });
  timeLeft = level.time;
  document.getElementById("timer").textContent = timeLeft;
  startTimer();
}

function flipCard() {
  if (
    lockBoard ||
    gameOver ||
    this.classList.contains("flipped") ||
    this.classList.contains("matched")
  )
    return;

  this.classList.add("flipped");
  this.textContent = this.dataset.emoji;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;
  checkMatch();
}

function checkMatch() {
  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    score++;
    matchedPairs++;
    document.getElementById("score").textContent = score;

    if (matchedPairs === cards.length / 2) {
      clearInterval(timerInterval); // Dừng thời gian khi hoàn thành vòng chơi
      updateHighScores(); // Cập nhật điểm số
      setTimeout(
        () => (document.getElementById("nextStep").style.display = "block"),
        1000
      );
    }
    resetBoard();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard.textContent = "";
      secondCard.textContent = "";
      resetBoard();
    }, 1000);
  }
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameOver = true; // Đánh dấu trò chơi kết thúc, chặn lật thẻ
      updateHighScores(); // Cập nhật điểm số
      setTimeout(() => {
        showPopup(`Bạn dở quá è! [GOODLUCK TO YOU] <br>Điểm của bạn: ${score}`);
      }, 1000);
      setTimeout(() => {
        document.getElementById("playAgain").style.display = "block";
      }, 6000);
    }
  }, 1000);
}

function updateHighScores() {
  highScores.push(score);
  highScores.sort((a, b) => b - a);
  highScores = highScores.slice(0, 3);
  localStorage.setItem("highScores", JSON.stringify(highScores));
}

function showHighScores() {
  isPaused = true; // Tạm dừng thời gian
  clearInterval(timerInterval); // Dừng đếm thời gian

  showPopup(
    `🏆 Top điểm cao nhất 🏆<br>
                    🔥 Top 1: ${highScores[0]} điểm<br>
                    💥 Top 2: ${highScores[1]} điểm<br>
                    🚀 Top 3: ${highScores[2]} điểm`,
    true // Popup sẽ không tự đóng
  );
}

function resetGame() {
  score = 0;
  document.getElementById("score").textContent = score;
  currentLevel = 0;
  matchedPairs = 0;
  gameOver = false;
  createBoard();
}

function nextLevel() {
  currentLevel++;
  if (currentLevel >= levels.length) {
    showPopup("Chúc mừng! Bạn đã hoàn thành tất cả các vòng.");
    setTimeout(resetGame, 2000);
  } else {
    matchedPairs = 0;
    createBoard();
  }
}

createBoard();

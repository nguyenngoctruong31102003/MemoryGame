const emojis = ["🍎", "🍌", "🍇", "🍉", "🍓", "🍒", "🥝", "🍍"];
let cards = [...emojis, ...emojis];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let timeLeft = 60;
let timerInterval;
let totalPairs = emojis.length;
let matchedPairs = 0;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  const gameBoard = document.getElementById("gameBoard");
  cards = shuffle(cards);
  cards.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });
  startTimer();
}

function flipCard() {
  if (
    lockBoard ||
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

    if (matchedPairs === totalPairs) {
      setTimeout(endGame, 1000);
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
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(timerInterval);
  alert(`Trò chơi kết thúc! Điểm của bạn: ${score}`);
  location.reload();
}


createBoard();

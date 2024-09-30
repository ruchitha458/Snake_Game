const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const snakeSize = 20;
let snake = [{ x: 200, y: 200 }];
let food = { x: 100, y: 100 };
let dx = snakeSize;
let dy = 0;
let score = 0;
let timer = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameInterval;
let playerName = '';
let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
let level = 1;
let timeInterval;

// DOM elements
const currentScoreEl = document.getElementById('currentScore');
const highScoreEl = document.getElementById('highScore');
const timerEl = document.getElementById('timer');
const levelEl = document.getElementById('level');
const historyListEl = document.getElementById('historyList');
const playerNameInput = document.getElementById('playerName');
const startButton = document.getElementById('startButton');

highScoreEl.textContent = highScore;
displayHistory();

startButton.addEventListener('click', () => {
    playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert('Please enter your name!');
        return;
    }
    resetGame();
    startGame();
});

function startGame() {
    gameInterval = setInterval(moveSnake, 1000 / (level * 10));
    timeInterval = setInterval(updateTimer, 1000);
}

function resetGame() {
    snake = [{ x: 200, y: 200 }];
    dx = snakeSize;
    dy = 0;
    score = 0;
    timer = 0;
    level = 1;
    currentScoreEl.textContent = score;
    timerEl.textContent = timer;
    levelEl.textContent = level;
    placeFood();
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check for wall collisions
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || checkCollision(head)) {
        endGame();
        return;
    }

    snake.unshift(head);

    // Check for food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        currentScoreEl.textContent = score;
        if (score % 5 === 0) {
            level++;
            levelEl.textContent = level;
            clearInterval(gameInterval);
            gameInterval = setInterval(moveSnake, 1000 / (level * 10));
        }
        placeFood();
    } else {
        snake.pop();
    }

    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'lime';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize));

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
}

function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
    food.y = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;
}

function checkCollision(head) {
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(timeInterval);
    alert(`Game Over! Your score: ${score}`);

    // Save game history
    gameHistory.push({ player: playerName, score: score, time: timer, level: level });
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));

    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreEl.textContent = highScore;
    }

    displayHistory();
}

function updateTimer() {
    timer++;
    timerEl.textContent = timer;
}

function displayHistory() {
    historyListEl.innerHTML = '';
    gameHistory.forEach((game, index) => {
        const li = document.createElement('li');
        li.textContent = `Game ${index + 1}: ${game.player} - Score: ${game.score}, Time: ${game.time}s, Level: ${game.level}`;
        historyListEl.appendChild(li);
    });
}

// Key controls for the snake
window.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
            if (dy === 0) {
                dx = 0;
                dy = -snakeSize;
            }
            break;
        case 'ArrowDown':
            if (dy === 0) {
                dx = 0;
                dy = snakeSize;
            }
            break;
        case 'ArrowLeft':
            if (dx === 0) {
                dx = -snakeSize;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx === 0) {
                dx = snakeSize;
                dy = 0;
            }
            break;
    }
});

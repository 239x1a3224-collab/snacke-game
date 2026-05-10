const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

const box = 20;
const canvasSize = 400;

let snake;
let food;
let direction;
let score;
let game;

function initGame() {
    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";
    score = 0;
    scoreDisplay.textContent = score;
    food = generateFood();

    if (game) clearInterval(game);
    game = setInterval(drawGame, 120);
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box,
    };
}

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const key = event.key;

    if (key === "ArrowUp" && direction !== "DOWN") {
        direction = "UP";
    } else if (key === "ArrowDown" && direction !== "UP") {
        direction = "DOWN";
    } else if (key === "ArrowLeft" && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (key === "ArrowRight" && direction !== "LEFT") {
        direction = "RIGHT";
    }
}

function drawGame() {
    // Clear canvas
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#22c55e" : "#86efac";
        ctx.fillRect(segment.x, segment.y, box, box);

        ctx.strokeStyle = "#0f172a";
        ctx.strokeRect(segment.x, segment.y, box, box);
    });

    // Current head position
    let headX = snake[0].x;
    let headY = snake[0].y;

    // Move head
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;

    // Wrap around edges
    if (headX < 0) headX = canvasSize - box;
    if (headX >= canvasSize) headX = 0;
    if (headY < 0) headY = canvasSize - box;
    if (headY >= canvasSize) headY = 0;

    // Eat food
    if (headX === food.x && headY === food.y) {
        score++;
        scoreDisplay.textContent = score;
        food = generateFood();
    } else {
        snake.pop();
    }

    const newHead = { x: headX, y: headY };

    // Check self collision
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === newHead.x && snake[i].y === newHead.y) {
            clearInterval(game);
            alert(`Game Over! Your score: ${score}`);
            return;
        }
    }

    snake.unshift(newHead);
}

restartBtn.addEventListener("click", initGame);

// Start game
initGame();
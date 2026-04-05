
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let baseVelocityX = -2;
let velocityX = baseVelocityX;
let velocityY = 0;
let gravity = 0.4;

let gameState = 'start';
let score = 0;
let highScore = 0;
let soundEnabled = true;

const MAX_VELOCITY = -6;
const MIN_OPENING_SPACE = boardHeight/6;
const BASE_OPENING_SPACE = boardHeight/4;

let pipeIntervalId = null;

let startScreen;
let pauseScreen;
let gameOverScreen;
let highScoreDisplay;
let currentScoreDisplay;
let finalScoreDisplay;
let gameOverHighScoreDisplay;
let startBtn;
let resumeBtn;
let restartBtn;
let restartFromPauseBtn;
let pauseBtn;
let soundToggle;

let audioContext;
let soundEffects = {};

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    startScreen = document.getElementById("startScreen");
    pauseScreen = document.getElementById("pauseScreen");
    gameOverScreen = document.getElementById("gameOverScreen");
    highScoreDisplay = document.getElementById("highScoreDisplay");
    currentScoreDisplay = document.getElementById("currentScore");
    finalScoreDisplay = document.getElementById("finalScore");
    gameOverHighScoreDisplay = document.getElementById("gameOverHighScore");
    startBtn = document.getElementById("startBtn");
    resumeBtn = document.getElementById("resumeBtn");
    restartBtn = document.getElementById("restartBtn");
    restartFromPauseBtn = document.getElementById("restartFromPauseBtn");
    pauseBtn = document.getElementById("pauseBtn");
    soundToggle = document.getElementById("soundToggle");

    loadSettings();

    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    initAudio();

    startBtn.addEventListener("click", startGame);
    resumeBtn.addEventListener("click", resumeGame);
    restartBtn.addEventListener("click", restartGame);
    restartFromPauseBtn.addEventListener("click", restartGame);
    pauseBtn.addEventListener("click", pauseGame);
    soundToggle.addEventListener("change", toggleSound);

    document.addEventListener("keydown", handleKeyDown);
    board.addEventListener("click", handleClick);
    board.addEventListener("touchstart", handleTouch, { passive: false });

    updateHighScoreDisplay();
    updateScoreDisplay();
    requestAnimationFrame(update);
}

function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        loadSound('point', './sfx_point.wav');
        loadSound('die', './sfx_die.wav');
        loadSound('wing', './sfx_wing.wav');
    } catch(e) {
        console.log("Audio not supported");
    }
}

function loadSound(name, src) {
    fetch(src)
        .then(response => response.arrayBuffer())
        .then(buffer => audioContext.decodeAudioData(buffer))
        .then(decodedData => {
            soundEffects[name] = decodedData;
        })
        .catch(e => console.log("Error loading sound:", e));
}

function playSound(name) {
    if (!soundEnabled || !audioContext || !soundEffects[name]) return;
    
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    const source = audioContext.createBufferSource();
    source.buffer = soundEffects[name];
    source.connect(audioContext.destination);
    source.start(0);
}

function toggleSound() {
    soundEnabled = soundToggle.checked;
    saveSettings();
}

function loadSettings() {
    const savedHighScore = localStorage.getItem('flappyBirdHighScore');
    const savedSoundEnabled = localStorage.getItem('flappyBirdSoundEnabled');
    
    if (savedHighScore) {
        highScore = parseInt(savedHighScore);
    }
    
    if (savedSoundEnabled !== null) {
        soundEnabled = savedSoundEnabled === 'true';
        soundToggle.checked = soundEnabled;
    }
}

function saveSettings() {
    localStorage.setItem('flappyBirdHighScore', highScore);
    localStorage.setItem('flappyBirdSoundEnabled', soundEnabled);
}

function updateHighScoreDisplay() {
    highScoreDisplay.textContent = `最高分: ${highScore}`;
    gameOverHighScoreDisplay.textContent = `最高分: ${highScore}`;
}

function updateScoreDisplay() {
    currentScoreDisplay.textContent = Math.floor(score);
}

function startGame() {
    gameState = 'playing';
    startScreen.style.display = 'none';
    pauseBtn.style.display = 'block';
    resetGame();
    startPipeInterval();
}

function pauseGame() {
    if (gameState === 'playing') {
        gameState = 'paused';
        pauseScreen.style.display = 'flex';
        stopPipeInterval();
    }
}

function resumeGame() {
    if (gameState === 'paused') {
        gameState = 'playing';
        pauseScreen.style.display = 'none';
        startPipeInterval();
    }
}

function restartGame() {
    gameState = 'playing';
    pauseScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    pauseBtn.style.display = 'block';
    resetGame();
    startPipeInterval();
}

function resetGame() {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    velocityX = baseVelocityX;
    velocityY = 0;
    updateScoreDisplay();
}

function gameOver() {
    gameState = 'gameOver';
    pauseBtn.style.display = 'none';
    stopPipeInterval();
    
    const finalScore = Math.floor(score);
    if (finalScore > highScore) {
        highScore = finalScore;
        saveSettings();
        updateHighScoreDisplay();
    }
    
    finalScoreDisplay.textContent = finalScore;
    gameOverScreen.style.display = 'flex';
    playSound('die');
}

function startPipeInterval() {
    if (pipeIntervalId !== null) {
        clearInterval(pipeIntervalId);
    }
    pipeIntervalId = setInterval(placePipes, 1500);
}

function stopPipeInterval() {
    if (pipeIntervalId !== null) {
        clearInterval(pipeIntervalId);
        pipeIntervalId = null;
    }
}

function handleKeyDown(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyX') {
        if (gameState === 'playing') {
            jump();
        } else if (gameState === 'gameOver') {
            restartGame();
        }
    } else if (e.code === 'Escape' || e.code === 'KeyP') {
        if (gameState === 'playing') {
            pauseGame();
        } else if (gameState === 'paused') {
            resumeGame();
        }
    }
}

function handleClick(e) {
    if (gameState === 'playing') {
        jump();
    }
}

function handleTouch(e) {
    e.preventDefault();
    if (gameState === 'playing') {
        jump();
    }
}

function jump() {
    velocityY = -6;
    playSound('wing');
}

function calculateDifficulty() {
    const level = Math.floor(score / 5);
    
    velocityX = Math.max(baseVelocityX - level * 0.5, MAX_VELOCITY);
    
    const openingSpace = Math.max(BASE_OPENING_SPACE - level * 10, MIN_OPENING_SPACE);
    
    return openingSpace;
}

function update() {
    requestAnimationFrame(update);
    
    if (gameState !== 'playing') {
        return;
    }
    
    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver();
        return;
    }

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
            updateScoreDisplay();
            playSound('point');
        }

        if (detectCollision(bird, pipe)) {
            gameOver();
            return;
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }
}

function placePipes() {
    if (gameState !== 'playing') {
        return;
    }

    const openingSpace = calculateDifficulty();
    
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

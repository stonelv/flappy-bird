
//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12
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

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

//game state
let gameState = "start"; // start, playing, paused, gameOver
let score = 0;
let highScore = localStorage.getItem("flappyBirdHighScore") || 0;

//difficulty
let difficultyLevel = 1;
let maxDifficulty = 5;
let pipesInterval = 1500;
let pipesIntervalId;

//sound
let soundEnabled = localStorage.getItem("flappyBirdSoundEnabled") === "false" ? false : true;
let sounds = {
    wing: new Audio("./sfx_wing.wav"),
    hit: new Audio("./sfx_hit.wav"),
    point: new Audio("./sfx_point.wav"),
    die: new Audio("./sfx_die.wav"),
    swooshing: new Audio("./sfx_swooshing.wav")
};

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //load images
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function() {
        drawStartScreen();
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    //event listeners
    document.addEventListener("keydown", handleKeyDown);
    board.addEventListener("click", handleClick);
    
    //start game loop
    requestAnimationFrame(update);
}

function update() {
    requestAnimationFrame(update);
    
    if (gameState === "start") {
        drawStartScreen();
        return;
    }
    
    if (gameState === "paused") {
        drawPauseScreen();
        return;
    }
    
    if (gameState === "gameOver") {
        drawGameOverScreen();
        return;
    }
    
    //game is playing
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        endGame();
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
            playSound("point");
            
            //increase difficulty every 5 points
            if (Math.floor(score) % 5 === 0 && difficultyLevel < maxDifficulty) {
                increaseDifficulty();
            }
        }

        if (detectCollision(bird, pipe)) {
            endGame();
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }

    //score
    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText(Math.floor(score), 5, 45);
    
    //high score
    context.font="20px sans-serif";
    context.fillText("High: " + highScore, 5, 70);
    
    //sound toggle
    context.font="16px sans-serif";
    context.fillText(soundEnabled ? "Sound: On" : "Sound: Off", 5, boardHeight - 10);
}

function drawStartScreen() {
    context.clearRect(0, 0, board.width, board.height);
    
    //draw bird
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    
    //title
    context.fillStyle = "white";
    context.font="40px sans-serif";
    context.fillText("Flappy Bird", 20, 150);
    
    //instructions
    context.font="20px sans-serif";
    context.fillText("Press Space or Click", 60, 250);
    context.fillText("to start", 110, 280);
    
    //high score
    context.font="20px sans-serif";
    context.fillText("High Score: " + highScore, 80, 350);
    
    //sound toggle
    context.font="16px sans-serif";
    context.fillText(soundEnabled ? "Sound: On" : "Sound: Off", 5, boardHeight - 10);
    context.fillText("Press M to toggle sound", 5, boardHeight - 30);
}

function drawPauseScreen() {
    //draw semi-transparent overlay
    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.fillRect(0, 0, board.width, board.height);
    
    //pause text
    context.fillStyle = "white";
    context.font="40px sans-serif";
    context.fillText("PAUSED", 80, boardHeight/2 - 20);
    
    //instructions
    context.font="20px sans-serif";
    context.fillText("Press P to resume", 70, boardHeight/2 + 20);
}

function drawGameOverScreen() {
    //draw semi-transparent overlay
    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.fillRect(0, 0, board.width, board.height);
    
    //game over text
    context.fillStyle = "white";
    context.font="40px sans-serif";
    context.fillText("GAME OVER", 30, boardHeight/2 - 60);
    
    //score
    context.font="30px sans-serif";
    context.fillText("Score: " + Math.floor(score), 90, boardHeight/2 - 10);
    
    //high score
    context.font="20px sans-serif";
    context.fillText("High Score: " + highScore, 80, boardHeight/2 + 30);
    
    //instructions
    context.font="20px sans-serif";
    context.fillText("Press Space or Click", 60, boardHeight/2 + 70);
    context.fillText("to restart", 110, boardHeight/2 + 100);
}

function placePipes() {
    if (gameState !== "playing") {
        return;
    }

    //(0-1) * pipeHeight/2.
    // 0 -> -128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4 - (difficultyLevel * 10); //decrease opening space with difficulty
    openingSpace = Math.max(openingSpace, 80); //minimum opening space

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

function handleKeyDown(e) {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        if (gameState === "start") {
            startGame();
        } else if (gameState === "playing") {
            jump();
        } else if (gameState === "gameOver") {
            restartGame();
        }
    } else if (e.code === "KeyP") {
        togglePause();
    } else if (e.code === "KeyM") {
        toggleSound();
    }
}

function handleClick() {
    if (gameState === "start") {
        startGame();
    } else if (gameState === "playing") {
        jump();
    } else if (gameState === "gameOver") {
        restartGame();
    }
}

function startGame() {
    gameState = "playing";
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    velocityX = -2;
    difficultyLevel = 1;
    
    //clear any existing interval
    if (pipesIntervalId) {
        clearInterval(pipesIntervalId);
    }
    
    //start placing pipes
    pipesIntervalId = setInterval(placePipes, 1500);
    
    playSound("swooshing");
}

function jump() {
    velocityY = -6;
    playSound("wing");
}

function togglePause() {
    if (gameState === "playing") {
        gameState = "paused";
    } else if (gameState === "paused") {
        gameState = "playing";
    }
}

function endGame() {
    gameState = "gameOver";
    playSound("hit");
    playSound("die");
    
    //update high score
    if (Math.floor(score) > highScore) {
        highScore = Math.floor(score);
        localStorage.setItem("flappyBirdHighScore", highScore);
    }
    
    //clear pipe interval
    if (pipesIntervalId) {
        clearInterval(pipesIntervalId);
    }
}

function restartGame() {
    startGame();
}

function increaseDifficulty() {
    if (difficultyLevel < maxDifficulty) {
        difficultyLevel++;
        velocityX -= 0.3; //increase pipe speed
        
        //decrease pipe spawn interval
        if (pipesIntervalId) {
            clearInterval(pipesIntervalId);
        }
        pipesInterval = Math.max(1000, pipesInterval - 100); //minimum 1 second interval
        pipesIntervalId = setInterval(placePipes, pipesInterval);
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem("flappyBirdSoundEnabled", soundEnabled);
}

function playSound(soundName) {
    if (soundEnabled && sounds[soundName]) {
        sounds[soundName].currentTime = 0; //rewind to start
        sounds[soundName].play().catch(e => console.log("Audio play failed:", e));
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}
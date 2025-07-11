// snake game
//accessing the elements
let gameBoard =document.querySelector("#gameboard");
let ctx=gameBoard.getContext("2d");    // 2d context
let gameStart = document.querySelector("#start");    
let gamePause = document.querySelector("#pause");    
let gameReset = document.querySelector("#reset"); 
let gameResume = document.querySelector("#resume");
let gameScore = document.querySelector(".score");   
let boardBackgroundColor = "black";
let snakeColor="mediumspringgreen";
let snakeBorderColor="black";
let foodColor="red";
const unitSize=25;  // size of snake and food
let xVelocity=unitSize; //initial x axis velocity
let yVelocity=0;//initial y axis velocity no vertical and diagonal movement
let foodX,foodY;
let score=0;
let snake=[
    {x:unitSize*4,y:0},
    {x:unitSize*3,y:0},
    {x:unitSize*2,y:0},        //drawing the snake in x and y coordinates in a grid
    {x:unitSize*1,y:0},
    {x:0,y:0}
];
let running=false; // game is not running

let isTextDisplayed = false;

// event listeners for the buttons
window.addEventListener("keydown", changeDirection);
gameStart.addEventListener("click",  startGame);
gamePause.addEventListener("click",  pauseGame);
gameReset.addEventListener("click",  resetGame);
gameResume.addEventListener("click", resumeGame);

// Ensure gameWidth and gameHeight are set after DOM is loaded
window.onload = function() {
  gameWidth = gameBoard.width;
  gameHeight = gameBoard.height;
  createFood();
//   startGame(); // Start here after dimensions are set
};

gameStart.addEventListener("click", startGame);
//starting the game
function startGame() {
    if (running) return; // Prevent starting a new game if one is already running
    score = 0;
  running = true;
  gameScore.textContent = score;
  clearBoard();
  createFood();
  nextTick(); // Start the game loop
}


function nextTick(){
    if(running){
        isTextDisplayed = false; // Reset the text display flag
        setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        },120);
    }
    else if (!isTextDisplayed) {
        isTextDisplayed = true; // Set the flag to true to prevent multiple displays
        displayGameOver(); // Display game over message
        ctx.fillStyle = "white";
    }
}

function clearBoard(){
    ctx.fillStyle=boardBackgroundColor;
    ctx.fillRect(0,0,gameWidth,gameHeight); //clearing the board
}

function createFood(){
  const rnd = (min, max) =>
    Math.floor((Math.random() * (max - min) + min) / unitSize) * unitSize;

  foodX = rnd(0, gameWidth  - unitSize);
  foodY = rnd(0, gameHeight - unitSize);
}

function drawFood(){
 ctx.fillStyle=foodColor;
 ctx.fillRect(foodX,foodY,unitSize,unitSize);   
}

function moveSnake(){
    const head={x:snake[0].x + xVelocity,
                y:snake[0].y + yVelocity};
    snake.unshift(head); //adding the head to the snake
    if(snake[0].x===foodX && snake[0].y===foodY){ //if snake eats the food
        score++;
        gameScore.textContent=score;
        createFood();
        drawFood();
    }
    else{
        snake.pop(); //removing the tail of the snake
    }

}

function drawSnake(){
    ctx.fillStyle=snakeColor;
    ctx.strokeStyle=snakeBorderColor;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x,snakePart.y,unitSize,unitSize);
        ctx.strokeRect(snakePart.x,snakePart.y,unitSize,unitSize);
    })
}

function changeDirection(event){
    if(!running) return; // Do not change direction if the game is paused
const keyPressed=event.keyCode;
const LEFT =37;
const UP=38;
const RIGHT=39;
const DOWN=40;

const goingUp=(yVelocity===-unitSize);
const goingDown=(yVelocity===unitSize);
const goingRight=(xVelocity===unitSize);
const goingLeft=(xVelocity===-unitSize);

switch(true){
    case (keyPressed===LEFT && !goingRight): 
        xVelocity=-unitSize;
        yVelocity=0;
        break;
    case (keyPressed===UP && !goingDown):
        xVelocity=0;
        yVelocity=-unitSize;
        break;
    case (keyPressed===RIGHT && !goingLeft):
        xVelocity=unitSize;
        yVelocity=0;
        break;
    case (keyPressed===DOWN && !goingUp):
        xVelocity=0;
        yVelocity=unitSize;
        break;

}
}

function checkGameOver(){
    switch(true){
        case (snake[0].x < 0): //if snake goes out of the board
        running=false;
        break;
        case (snake[0].x > gameWidth-unitSize):
        running=false;
        break;
        case (snake[0].y < 0):
        running=false;
        break;
        case (snake[0].y > gameHeight-unitSize):
        running=false;
        break;
    }
    for(let i=1;i<snake.length;i++){
        if(snake[i].x===snake[0].x && snake[i].y===snake[0].y){
            running=false;
        }
    }
}

function displayGameOver() {
  clearBoard(); // Clear first
  ctx.textAlign = "center"; // Horizontally center text
  ctx.textBaseline = "middle"; // Vertically center text
  ctx.fillStyle = "white";
  ctx.font = "50px MV Boli";
  ctx.textAlign = "center"; // Center text horizontally
  ctx.fillText("Game Over", gameWidth / 2, gameHeight / 2 - 30);
  ctx.font = "25px MV Boli";
  ctx.fillText("Press Start to play again", gameWidth / 2, gameHeight / 2 + 30);
  ctx.fillText("Score: " + score, gameWidth / 2, gameHeight / 2 + 80);
}

function resetGame(){
    score=0;
    xVelocity=unitSize;
    yVelocity=0;
    snake=[
        {x:unitSize*4,y:0},
        {x:unitSize*3,y:0},
        {x:unitSize*2,y:0},        //drawing the snake in x and y coordinates in a grid
        {x:unitSize*1,y:0},
        {x:0,y:0}
    ];
    startGame();
}

function pauseGame() {
  running = false;
  clearBoard(); // Clear before drawing paused text
  ctx.textAlign = "center"; // Horizontally center text
  ctx.textBaseline = "middle"; // Vertically center text
  ctx.fillStyle = "white";
  ctx.font = "50px MV Boli";
  ctx.textAlign = "center";
  ctx.fillText("Paused", gameWidth / 2, gameHeight / 2 - 30);
  ctx.font = "25px MV Boli";
  ctx.fillText("Press Resume to continue", gameWidth / 2, gameHeight / 2 + 30);
}

function resumeGame(){
    running=true;
    nextTick();
}

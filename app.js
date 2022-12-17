/* const canvas = document.getElementById('snakeCanvas');

const ctx = canvas.getContext('2d'); */


const snakeboard = document.getElementById('snakeCanvas')

const snakeboard_ctx = snakeboard.getContext('2d')

const scoreHtml = document.querySelector('.score');
const gameOverHtml = document.querySelector('.game-over')
const restartBtn = document.querySelector('.btn-restart')
const topBtn = document.querySelector('.btn-top');
const leftBtn = document.querySelector('.btn-left')
const rightBtn = document.querySelector('.btn-right')
const bottomBtn = document.querySelector('.btn-bottom')


topBtn.addEventListener('click', moveTop)
bottomBtn.addEventListener('click', moveBottom)
rightBtn.addEventListener('click', moveRight)
leftBtn.addEventListener('click', moveLeft)



let dx = 10
let dy = 10
let speed = 100
let goingRight = true;
let goingLeft = false;
let goingBottom = false;
let goingTop = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0
let highScoreHtml = document.querySelector('.high-scores')
highScoreHtml.textContent = highScore
let foodLoc;




let snake = [ {x: 200, y: 200}, {x: 190, y: 200}, { x: 180, y: 200}, {x: 170, y: 200}, {x: 160, y: 200}]

let ortInt;




function starter() {
  document.querySelector('.btn-start').style.display = 'none';
 ortInt = setInterval(() => {
  
    moveSnake('x')


  },speed)
}

function drawSnakePart(snakePart) {
  
  snakeboard_ctx.fillStyle = 'dodgerblue';  
  snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10); 
}

function drawSnake() {
  snake.forEach(drawSnakePart)
}

drawSnake()


function moveSnake(direction) {
  
  const head = direction === 'x' ? {x: snake[0].x + dx, y: snake[0].y} :  {x: snake[0].x, y: snake[0].y+dy}
  
  snake.unshift(head);
  let {x, y} = snake.pop()
  
  
  if(snake[0].x === foodLoc.x && snake[0].y === foodLoc.y) {
    clearCanvas(foodLoc.x, foodLoc.y)
    snake.push({x: snake[snake.length-1]-10, y: snake[snake.length -1]-10})
    generateFood();
    score++
    scoreHtml.textContent = score;
  }
  
  drawSnake();
  clearCanvas(x,y)
  
  
  
  if(snake[0].x > snakeboard.clientWidth || snake[0].x < 0  || snake[0].y > snakeboard.clientHeight|| snake[0].y < 0) {
     
    gameOver();
    return;
  }
  
  for(let i = 3; i < snake.length; i++) {
    
    const hasCollided = snake[0].x === snake[i].x && snake[0].y === snake[i].y
    
    if(hasCollided) {
      gameOver()
      break;
    }
  }
}




function clearCanvas(x, y) {
  snakeboard_ctx.clearRect(x, y, 10, 10)
  
};

window.addEventListener('keydown', (e) => {
  
  
  //top
  if(e.keyCode == 38 && (goingRight || goingLeft)) {
      
    
    moveTop();
    //bottom
  } else if(e.keyCode == 40 && (goingRight || goingLeft)) {

    moveBottom()
    
    //right
  }  else if(e.keyCode == 39 && (goingTop || goingBottom)) {
      
    moveRight()
    //left
  } else if(e.keyCode == 37 && (goingTop || goingBottom)) {
    
    moveLeft()
  } 
})


function generateFood() {
  
  const x =  getRandomDivisible10();
  const y = getRandomDivisible10();
  
  snakeboard_ctx.fill = 'yellow'
  snakeboard_ctx.fillRect(x, y, 10, 10)
  

  foodLoc = {x, y};
}

generateFood();


function gameOver() {
  syncHighScore()
  clearInterval(ortInt)
  gameOverHtml.style.opacity = 1;
  gameOverHtml.style.zIndex = 100;

}

function getRandomDivisible10() {
  let divisibles = [];
  
  for(let i = 0; i < snakeboard.clientWidth; i++) {
    
    if(i % 10 === 0) {
      divisibles.push(i)
    }
    
  }
  let rand = divisibles[Math.floor(Math.random() * (divisibles.length - 1 ))]
  return rand
}


function restartGame() {
 
  gameOverHtml.style.opacity = 0;
  gameOverHtml.style.zIndex = -100
 
  score = 0
  goingRight = true;
  goingLeft = false;
  goingBottom = false;
  goingTop = false;
  dx = 10
  dy = 10
  
  snakeboard_ctx.clearRect(0, 0, snakeboard.clientWidth, snakeboard.clientHeight)
  snake =  [ {x: 200, y: 200}, {x: 190, y: 200}, { x: 180, y: 200}, {x: 170, y: 200}, {x: 160, y: 200}]
  drawSnake()
  generateFood()
  ortInt = setInterval(() => {

    moveSnake('x')
 },speed)
}

function syncHighScore() {
  highScore = localStorage.getItem('highScore') == null ? localStorage.setItem('highScore', 0): localStorage.getItem('highScore')
  highScoreHtml.textContent= highScore
  if(score > highScore)  {
    localStorage.setItem('highScore', score)
  } 
}


function moveLeft() {
  
  goingLeft = true
    goingTop = false
    goingBottom = false
    clearInterval(ortInt)
    dx = -10;
    ortInt = setInterval(() => {
      
      moveSnake('x')
    }, speed)

}
function moveRight() {

  goingRight = true
    goingTop = false
    goingBottom = false
    clearInterval(ortInt)
    
    
    ortInt = setInterval(() => {
      dx = 10
      
      moveSnake('x')
    }, speed)
}

function moveTop() {
  goingTop = true
    goingLeft = false
    goingRight = false

    clearInterval(ortInt)

    ortInt = setInterval(() => {
      dy = -10;
      moveSnake('y')
    }, speed)
}

function moveBottom() {

  goingRight = false
  goingLeft = false
  goingBottom = true
  
  clearInterval(ortInt)
  
  ortInt = setInterval(() => {
    dy = 10;
    moveSnake('y')
  }, speed)

}
restartBtn.addEventListener('click', restartGame)



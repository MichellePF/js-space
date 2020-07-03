
var btnStart = document.getElementById("btn-start");
var ins = document.getElementById("ins");
var playArea = document.getElementById("playArea");
var shooter = document.getElementById("player-shooter");
var enemigoImgs = ['img/enemigos/enem1.gif', 'img/enemigos/enem2.gif', 'img/enemigos/enem3.gif', 'img/enemigos/enem4.gif'];
var scoreCounter = document.querySelector('#score span');

var audioJustice;
var enemigoInterval;



// ------- settings de teclas -------

btnStart.addEventListener("click", (event) => {
  playGame();
})


function move(event) {
  if (event.key === "ArrowUp") {
    event.preventDefault();
    moveUp();
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    moveDown();
  } else if (event.key === " ") {
    event.preventDefault();
    fire();
  };
};


// ----- inicio del juego ------

function playGame() {
  btnStart.style.display = 'none';
  ins.style.display = 'none';
  
  window.addEventListener("keydown", move);
  audioJustice = new Audio("audio/audioJustice-One-Minute-To-Midnight.m4a");
  audioJustice.play();

  enemigoInterval = setInterval(() => { createEnemigo() }, 2100);
};




// ------- movimiento del jugador -------

function moveUp() {
  var topPosition = window.getComputedStyle(shooter).getPropertyValue('top');

  if (shooter.style.top === "0px") {
    return;

  } else {
    var position = parseInt(topPosition);

    position -= 10;
    shooter.style.top = `${position}px`;
  };
};


function moveDown() {
  var topPosition = window.getComputedStyle(shooter).getPropertyValue('top');

  if (shooter.style.top === "500px") {
    return;

  } else {
    var position = parseInt(topPosition);

    position += 10;
    shooter.style.top = `${position}px`;
  }
}






// ------- creacion del laser --------

function createLaser() {
  var xPosition = parseInt(window.getComputedStyle(shooter).getPropertyValue('left'));
  var yPosition = parseInt(window.getComputedStyle(shooter).getPropertyValue('top'));
  
  var newLaser = document.createElement('img');
  newLaser.src = 'img/laserBlue02_s.png';
  newLaser.classList.add('laser');
  newLaser.style.left = `${xPosition}px`;
  newLaser.style.top = `${yPosition - 10}px`;

  return newLaser;
};





// ------ agregando el laser y sonido -------

function fire() {
  var laser = createLaser();
  playArea.appendChild(laser);
  var audioLaser = new Audio('audio/laser-sfx.m4a');
  audioLaser.play();
  moveLaser(laser);
};




// ------- movimiento del laser -------

function moveLaser(laser) {
  var laserInterval = setInterval(() => {
    var xPosition = parseInt(laser.style.left);
    var enemigos = document.querySelectorAll(".enemigo");

    enemigos.forEach(enemigo => {
      if (laserColl(laser, enemigo)) {
        var explosion = new Audio('audio/explosion.m4a');

        explosion.play();
        enemigo.src = "img/explosion/explosion08_s.png";
        enemigo.classList.remove("enemigo");
        enemigo.classList.add("dead-enemigo");

        scoreCounter.innerText = parseInt(scoreCounter.innerText) + 100;
      };
    });

    if (xPosition === 340) {
      laser.remove();
    } else {
      laser.style.left = `${xPosition + 4}px`;
    };
  }, 10);
};



// ------- Creacion del bicho -------

function createEnemigo() {
  var newEnemigo = document.createElement('img');
  var enemigoImg = enemigoImgs[Math.floor(Math.random()*enemigoImgs.length)];

  newEnemigo.src = enemigoImg;
  newEnemigo.classList.add('enemigo');
  newEnemigo.classList.add('enemigo-transition');
  newEnemigo.style.left = '500px';
  newEnemigo.style.top = `${Math.floor(Math.random() * 400) + 50}px`;

  playArea.appendChild(newEnemigo);
  moveenemigo(newEnemigo);
};




// ------ iteracion del movimiento del bicho -----

function moveenemigo(enemigo) {
  var moveenemigoInterval = setInterval(() => {
    var xPosition = parseInt(window.getComputedStyle(enemigo).getPropertyValue('left'));
    
    if (xPosition <= 50) {
      if (Array.from(enemigo.classList).includes("dead-enemigo")) {
        enemigo.remove();
      } else {
        gameOver();
      }
    } else {
      enemigo.style.left = `${xPosition - 4}px`;
    }
  }, 30);
};





// ------- Colision del laser con el bicho -------

function laserColl(laser, enemigo) {
  var laserLeft = parseInt(laser.style.left);
  var laserTop = parseInt(laser.style.top);
  var laserBottom = laserTop - 20;
  var enemigoTop = parseInt(enemigo.style.top);
  var enemigoBottom = enemigoTop - 30;
  var enemigoLeft = parseInt(enemigo.style.left);

  if (laserLeft != 340 && laserLeft + 40 >= enemigoLeft) {
    if ( (laserTop <= enemigoTop && laserTop >= enemigoBottom) ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  };
};


// ------- termino del juego ------

function gameOver() {
  window.removeEventListener("keydown", move);
  audioJustice.pause();
  var gameOverA = new Audio('audio/game-over.m4a');

  gameOverA.play();
  clearInterval(enemigoInterval);

  var enemigos = document.querySelectorAll(".enemigo");
  enemigos.forEach(enemigo => enemigo.remove());

  var lasers = document.querySelectorAll(".laser");
  lasers.forEach(laser => laser.remove());

  setTimeout(() => {
    alert(`Game Over! Los monstruos invadieron la Tierra!!!! ${scoreCounter.innerText} puntos!`);
    shooter.style.top = "180px";
    btnStart.style.display = "block";
    ins.style.display = "block";
    scoreCounter.innerText = 0;
  }, 1100);
};



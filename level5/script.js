document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const controlsDisplay = document.querySelector(".controls");
  const scoreDisplay = document.querySelector("#hostage-score");
  const enemiesDisplay = document.querySelector("#enemy-kill");
  const timer = document.querySelector("#timer");
  const width = 38; //38*17
  const height = 17; //38*17
  let savedHostages = 0;
  let enemiesKilled = 0;
  let time = 0;
  let totalScore;

  const timeElapse = setInterval(() => {
    time += 1;
    timer.textContent = time;
  }, 1000);

  //iscrtaj tablu - tabla je 38*17
  // prettier-ignore
  const layout = [
    4,1,6,6,6,6,1,6,1,1,1,1,1,1,1,1,6,1,1,3,3,3,3,1,1,1,1,2,7,7,7,7,1,1,1,1,9,9,
    4,1,1,1,1,1,1,1,1,1,1,1,7,7,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,9,
    1,1,8,2,1,1,1,1,1,1,1,1,7,7,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,1,6,1,1,1,1,1,1,
    4,1,1,1,1,1,3,1,2,1,1,1,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    4,1,1,1,1,1,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,1,1,1,1,1,3,1,
    4,1,1,1,1,1,3,1,1,4,1,1,1,8,1,1,1,5,1,1,1,1,1,1,1,3,1,3,1,1,1,1,1,1,1,1,3,1,
    4,1,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,2,3,1,1,1,1,1,1,1,1,3,1,
    4,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,3,1,1,1,1,1,1,1,1,1,3,
    6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,4,1,1,1,1,1,3,1,3,1,1,1,1,1,1,1,1,1,3,
    3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1,1,8,1,1,1,1,1,1,1,3,
    7,1,2,1,1,1,3,1,1,1,1,1,1,1,1,1,1,1,4,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,3,1,1,1,1,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,4,1,1,1,1,1,7,7,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,3,1,1,1,1,1,1,1,6,
    1,1,9,9,1,2,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,6,1,1,1,1,1,5,1,1,1,1,1,6,
    7,1,1,1,1,1,1,1,1,1,1,1,1,2,8,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,1,1,1,1,1,1,1,6,
    7,7,7,1,1,1,1,4,4,4,1,1,1,1,1,1,4,4,4,4,4,4,4,1,1,1,1,1,1,1,1,1,1,1,1,6,6,6,    
  ]

  const squares = [];

  //funkcija za pustanje zvukova
  function playSoundEffect(sound) {
    new Audio(sound).play();
  }

  function createBoard() {
    for (let i = 0; i < layout.length; i++) {
      const square = document.createElement("div");
      square.setAttribute("data-i", i);
      grid.appendChild(square);
      squares.push(square);

      if (layout[i] === 0) {
      } else if (layout[i] === 1) {
        squares[i].classList.add("empty");
      } else if (layout[i] === 2) {
        squares[i].classList.add("hostage");
      } else if (layout[i] === 3) {
        squares[i].classList.add("wall");
        squares[i].classList.add("object1");
      } else if (layout[i] === 4) {
        squares[i].classList.add("wall");
        squares[i].classList.add("object2");
      } else if (layout[i] === 5) {
        squares[i].classList.add("wall");
        squares[i].classList.add("object3");
      } else if (layout[i] === 6) {
        squares[i].classList.add("wall");
        squares[i].classList.add("object4");
      } else if (layout[i] === 7) {
        squares[i].classList.add("wall");
        squares[i].classList.add("object5");
      } else if (layout[i] === 8) {
        squares[i].classList.add("wall");
        squares[i].classList.add("object6");
      } else if (layout[i] === 9) {
        squares[i].classList.add("wall");
        squares[i].classList.add("object7");
      }
    }
  }
  createBoard();
  //hero
  let heroIndex = 604;
  squares[heroIndex].classList.add("hero-right");

  //enemy
  function enemyCreate(pos, look, speed) {
    let enemyIndex = pos;
    squares[enemyIndex].classList.add(look, "enemy");

    const enemyInt = setInterval(() => {
      let enemyMoves = [1, -1, width, -width];
      let random = Math.floor(Math.random() * enemyMoves.length);
      let randMove = enemyMoves[random];

      if (squares[enemyIndex].classList.contains("weapon")) {
        clearInterval(enemyInt);
        squares[enemyIndex].classList.remove(look, "enemy");
        playSoundEffect("../sounds/killenemy.wav");
        enemiesKilled++;
        enemiesDisplay.textContent = enemiesKilled;
      } else {
        if (
          enemyIndex + randMove <= 0 ||
          enemyIndex + randMove >= width * height
        ) {
        } else if ((enemyIndex + 1) % width == 0) {
          squares[enemyIndex].classList.remove(look, "enemy");
          enemyIndex -= 1;
          squares[enemyIndex].classList.add(look, "enemy");
        } else if (enemyIndex % width == 0) {
          squares[enemyIndex].classList.remove(look, "enemy");
          enemyIndex += 1;
          squares[enemyIndex].classList.add(look, "enemy");
        } else {
          squares[enemyIndex].classList.remove(look, "enemy");
          if (
            enemyIndex + (randMove % width) !== 0 &&
            !squares[enemyIndex + randMove].classList.contains("wall")
          ) {
            enemyIndex += randMove;
            squares[enemyIndex].classList.add(look, "enemy");
          }
        }
      }
    }, speed);
  }

  enemyCreate(40, "enemy1", 70);
  enemyCreate(60, "enemy1", 70);
  enemyCreate(80, "enemy1", 70);
  enemyCreate(160, "enemy1", 70);
  enemyCreate(120, "enemy1", 70);
  enemyCreate(440, "enemy1", 70);
  enemyCreate(560, "enemy1", 70);
  enemyCreate(580, "enemy1", 70);
  enemyCreate(540, "enemy1", 70);
  enemyCreate(360, "enemy1", 70);

  enemyCreate(100, "enemy2", 350);
  enemyCreate(200, "enemy2", 350);
  enemyCreate(300, "enemy2", 350);
  enemyCreate(400, "enemy2", 350);
  enemyCreate(500, "enemy2", 350);

  enemyCreate(150, "enemy3", 320);
  enemyCreate(250, "enemy3", 320);

  enemyCreate(175, "enemy4", 453);
  enemyCreate(275, "enemy4", 453);
  enemyCreate(375, "enemy4", 453);
  enemyCreate(475, "enemy4", 453);
  enemyCreate(575, "enemy4", 453);

  enemyCreate(350, "enemy5", 320);
  enemyCreate(450, "enemy5", 320);
  enemyCreate(550, "enemy5", 320);

  //kretanje heroja
  function keyPush(e) {
    switch (e.key) {
      case "ArrowLeft":
        if (squares[heroIndex].classList.contains("hero-right")) {
          squares[heroIndex].classList.remove("hero-right");
          squares[heroIndex].classList.add("hero-left");
        } else {
          //squares[heroIndex].classList.remove('hero-right')
          squares[heroIndex].classList.remove("hero-left");
          if (
            heroIndex % width !== 0 &&
            !squares[heroIndex - 1].classList.contains("wall")
          )
            heroIndex -= 1;
          squares[heroIndex].classList.add("hero-left");
        }
        break;
      case "ArrowUp":
        if (
          heroIndex > width - 1 &&
          !squares[heroIndex - width].classList.contains("wall") &&
          squares[heroIndex].classList.contains("hero-right")
        ) {
          squares[heroIndex].classList.remove("hero-right");
          heroIndex -= 38;
          squares[heroIndex].classList.add("hero-right");
        }
        if (
          heroIndex > width - 1 &&
          !squares[heroIndex - width].classList.contains("wall") &&
          squares[heroIndex].classList.contains("hero-left")
        ) {
          squares[heroIndex].classList.remove("hero-left");
          heroIndex -= 38;
          squares[heroIndex].classList.add("hero-left");
        }
        break;
      case "ArrowRight":
        if (squares[heroIndex].classList.contains("hero-left")) {
          squares[heroIndex].classList.remove("hero-left");
          squares[heroIndex].classList.add("hero-right");
        } else {
          squares[heroIndex].classList.remove("hero-right");
          //squares[heroIndex].classList.remove('hero-left')
          if (
            heroIndex % width < width - 1 &&
            !squares[heroIndex + 1].classList.contains("wall")
          )
            heroIndex += 1;
          squares[heroIndex].classList.add("hero-right");
        }
        break;
      case "ArrowDown":
        if (
          heroIndex < squares.length - width &&
          !squares[heroIndex + width].classList.contains("wall") &&
          squares[heroIndex].classList.contains("hero-right")
        ) {
          squares[heroIndex].classList.remove("hero-right");
          heroIndex += 38;
          squares[heroIndex].classList.add("hero-right");
        }
        if (
          heroIndex < squares.length - width &&
          !squares[heroIndex + width].classList.contains("wall") &&
          squares[heroIndex].classList.contains("hero-left")
        ) {
          squares[heroIndex].classList.remove("hero-left");
          heroIndex += 38;
          squares[heroIndex].classList.add("hero-left");
        }
        break;
      case " ":
        if (squares[heroIndex].classList.contains("hero-right")) shootR();
        if (squares[heroIndex].classList.contains("hero-left")) shootL();
        break;
      case "Enter":
        //console.log('ent');
        break;
    }

    //ako spasi hostage
    if (squares[heroIndex].classList.contains("hostage")) {
      squares[heroIndex].classList.remove("hostage");
      savedHostages++;
      scoreDisplay.textContent = savedHostages;
      playSoundEffect("../sounds/savehostage.wav");
    }
    //ako se heroj dodirne sa neprijateljem (stavio sam u set interval da bi pozivao proveru svaku desetinku da li ima klase enemy u polju heroja, ako ne stavim interval poziva je samo kad se krecem sa herojem)
    setInterval(() => {
      if (squares[heroIndex].classList.contains("enemy")) {
        gameOver();
      }
    }, 0.1);
    //win scenario
    setInterval(() => {
      if (enemiesKilled + savedHostages == 36) {
        gameWin();
      }
    }, 0.1);
  }

  //pucaljka
  function shootR() {
    let bullet = heroIndex - 1;
    function bulletShoot() {
      bullet++;
      squares[bullet + 1].classList.add("weapon");
      squares[bullet].classList.remove("weapon");
      //ako udari u wall
      if (squares[bullet].classList.contains("wall")) myStopShoot();
      //ako udari u desnu ivicu
      if (bullet % width == width - 1) myStopShoot();
      //ako udari u zadnje polje (treba resiti pucanje za zadnje polje squares jer ne radi)
      if (bullet == squares.length - 2) myStopShoot();
      //ako metak pogodi hostage
      if (squares[bullet].classList.contains("hostage")) gameOver();
    }
    const shootLine = setInterval(bulletShoot, 80);
    function myStopShoot() {
      clearInterval(shootLine);
      squares[bullet + 1].classList.remove("weapon");
    }
    setTimeout(myStopShoot, 1000);
  }

  function shootL() {
    let bullet = heroIndex + 1;
    function bulletShoot() {
      bullet--;
      squares[bullet - 1].classList.add("weapon");
      squares[bullet].classList.remove("weapon");
      //ako udari u wall
      if (squares[bullet].classList.contains("wall")) myStopShoot();
      //ako udari u desnu ivicu
      if (bullet % width == 0) myStopShoot();
      //ako udari u yadnje polje (treba resiti pucanje za zadnje polje squares jer ne radi)
      if (bullet == 1) myStopShoot();
      //ako metak pogodi hostage
      if (squares[bullet].classList.contains("hostage")) gameOver();
    }
    const shootLine = setInterval(bulletShoot, 80);

    function myStopShoot() {
      clearInterval(shootLine);
      squares[bullet - 1].classList.remove("weapon");
    }
    setTimeout(myStopShoot, 1000);
  }

  //funkcija za game over
  function gameOver() {
    playSoundEffect("../sounds/gameover.mp3");
    totalScore = (savedHostages + enemiesKilled) * 10 - time;
    controlsDisplay.textContent = "Game Over! Your score=" + totalScore;
    document.removeEventListener("keydown", keyPush);
    document.querySelector(".play-again").style.display = "inline-block";
    clearAllInt();
  }
  //funkcija za game win
  function gameWin() {
    playSoundEffect("../sounds/winlevel.mp3");
    totalScore = (savedHostages + enemiesKilled) * 10 - time;
    controlsDisplay.textContent = "You win!!!!! Your score=" + totalScore;
    document.removeEventListener("keydown", keyPush);
    document.querySelector(".next-level").style.display = "inline-block";
    clearAllInt();
  }

  //brisanje svih setInterval
  function clearAllInt() {
    for (var i = 1; i < 99999; i++) window.clearInterval(i);
  }

  //okidanje dugmica
  document.addEventListener("keydown", keyPush);
});

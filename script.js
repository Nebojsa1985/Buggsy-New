const startBtn = document.querySelector("#startbtn");
const levelOneBtn = document.querySelector("#level1btn");
const levelTwoBtn = document.querySelector("#level2btn");
const levelThreeBtn = document.querySelector("#level3btn");
const levelFourBtn = document.querySelector("#level4btn");
const levelFiveBtn = document.querySelector("#level5btn");

startBtn.addEventListener("click", () => {
  window.location = "level1/index.html";
});

function startLevel(lvl) {
  window.location = lvl;
}

allButtons = document.querySelectorAll(".lvlbtn");
for (let i = 0; i < allButtons.length; i++) {
  allButtons[i].addEventListener("click", () => {
    startLevel("level" + (parseInt(i) + 1) + "/index.html");
  });
}

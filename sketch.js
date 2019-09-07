/// <reference path="./p5.global-mode.d.ts" />
var buttonList = [] ;
var flexMeter = 0; // max of 100%

function setup() {
  createCanvas(1000, 600);
  Button([100, 100, 200, 200], color(200, 100, 100), console.log, "yeeeey")
}

function draw() {
  background(240, 240, 240)
  drawStatsPanel()
  drawButtons()
}

function drawStatsPanel() {
    //info panel
    push()
    translate(width-250, 0)
    fill(87, 167, 247);
    strokeWeight(3)
    rect(0, 3, 247, 100);
    fill(0);
    textSize(30);
    var secondsLeft = Math.floor((18000-frameCount)/60)
    text(Math.floor(secondsLeft/60) + ":" + (secondsLeft % 60 < 10 ? "0" : "") + secondsLeft % 60, 10, 30)
    textSize(15)
    text("before dad finds out you're", 72, 15)
    text("using his credit card", 72, 30)

    // FLEXMETER
    fill(255)
    rect(20, 50, 180, 20)
    fill(120)
    textStyle(ITALIC)
    text("F  L  E  X   M  E  T  E  R", 25, 65)
    textStyle(NORMAL)
    strokeWeight(0)
    fill(255, 100+flexMeter*sin(frameCount/40), 0)
    rect(22, 52, map(mouseX, 0, width, 0, 176), 17)
    pop()
}

function mousePressed() {
  for (button of buttonList) {
   button.checkClick()
  }
}

function drawButtons() {
  for (button of buttonList) {
    button.drawButton()
  }
}

/// <reference path="./p5.global-mode.d.ts" />
buttonList = [[100, 100, 200, 100, console.log]] ;
var framesLeft = 18000;
var flexMeter = 0;

function setup() {
  createCanvas(1000, 600);
}

function draw() {
  background(240, 240, 240)
  framesLeft--;
  drawStatsPanel()
  drawButton()
}

function mousePressed() {
  for (val of buttonList) {
   if (mouseX >= val[0] && mouseX <= val[0] + val[2] && mouseY >= val[1] && mouseY <= val[1] + val[3])
    val[4]("yaaaaay");
  }

}

function drawButton(){
  for (val of buttonList){
    fill (0, 0, 255);
    rect(val[0], val[1], val[2], val[3]);
  }
}

function drawStatsPanel() {
    //info panel
    fill(87, 167, 247);
    strokeWeight(3)
    rect(width - 250, 3, 247, 100);
    fill(0);
    textSize(30);
    // text("Timer until dad comes home", width - 250, 20);
    // text("dollaridoos: 99999", width - 250, 40);
    // text("big flex comes  here", width - 250, 60);
    // text(timeLeft/30, width-250, 80);
    secondsLeft = Math.floor(framesLeft/60)
    text(Math.floor(secondsLeft/60) + ":" + (secondsLeft % 60 < 10 ? "0" + secondsLeft % 60 : secondsLeft % 60), width-240, 30)
    textSize(15)
    text("before dad finds out you're", width-178, 15)
    text("using his credit card", width-178, 30)

    // FLEXMETER
    fill(255)
    rect(width-230, 50, 180, 20)
    fill(120)
    textStyle(ITALIC)
    text("F  L  E  X   M  E  T  E  R", width - 225, 65)
    textStyle(NORMAL)
    strokeWeight(0)
    fill(255, 100+frameCount%80, 120)
    rect(width - 228, 52, map(mouseX, 0, width, 0, 176), 17)
}

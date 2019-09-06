/// <reference path="./p5.global-mode.d.ts" />
 buttonList = [[100, 100, 200, 100, console.log]] ;
function setup() {
  createCanvas(800, 600);
}

function draw() {
  drawStatsPanel();
  drawButton();
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
    fill(189, 187, 187);
    rect(width - 200, 0, 199, 100);
    fill(255, 255, 255);
    textSize(15);
    text("Timer until dad comes home",width - 199, 20);
    text("dollaridoos: 99999", width - 199, 40);
    text("big flex comes  here", width - 199, 60);
}


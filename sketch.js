/// <reference path="./p5.global-mode.d.ts" />

function setup() {
  createCanvas(800, 600);
}

function draw() {
  drawStatsPanel()
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
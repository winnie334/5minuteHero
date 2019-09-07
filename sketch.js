/// <reference path="./p5.global-mode.d.ts" />
buttonList = [];
var flexMeter = 0; // max of 100%
var allImages = []; // array of array containing all the pictures by rarity

var currentlyDisplaying; // todo gooi dit weg

const imageAmounts = [87, 37, 14, 6];
const rarity = ["common", "uncommon", "rare", "legendary"]


function preload() { // we load in all the images before showing the game
  for (var i = 0; i < 4; i++) {
    var images = [] // all images for this rarity
    for (var imageIndex = 0; imageIndex <= imageAmounts[i]; imageIndex++) {
      images.push(loadImage("images/" + rarity[i] + imageIndex + ".png"));
    }
    allImages.push(images);
  }
}

function setup() {
  createCanvas(1000, 600);
  for (var i = 0; i < 4; i++) {
    new Button([30+180*i, 300, 130, 30], [200, 100, 100], screenClicked, i)
  }
  console.log(buttonList)
}

function draw() {
  background(240, 240, 240)
  drawScreens();
  drawStatsPanel();
  drawButtons();
  if (currentlyDisplaying) image(currentlyDisplaying, 400, 400)
}

function drawScreens() {
  for (var i = 0; i < 4; i++) {
    strokeWeight(3)
    fill(240, 240, 240)
    rect(20 + 180*i, 30, 150, 300)
  }
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


function screenClicked(screenNumber) {
  // for now fixen we gewoon instant een drop
  currentlyDisplaying = getDrop()[1]
  currentlyDisplaying.resize(64, 64)
}

function getDrop() {
  var yourRNG = Math.random() * 100
  var tier = 0;
  if (yourRNG < 60) {
    tier = 0;
  } else if (yourRNG < 85) {
    tier = 1;
  } else if (yourRNG < 95) {
    tier = 2;
  } else {
    tier = 3;
  }
  // todo verhoog flexmeter of coins, fix nog wat andere dingen
  return [tier, allImages[tier][Math.floor(Math.random()*allImages[tier].length)]];
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

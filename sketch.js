/// <reference path="./p5.global-mode.d.ts" />
buttonList = [];
var flexMeter = 0; // max of 100%
var allImages = []; // array of array containing all the pictures by rarity
var currentlyOnButton = false; // set to true to change pointer
let rpgFont; // onze megacoole totaal niet gestolen font

var currentlyDisplaying; // todo gooi dit weg

const imageAmounts = [87, 37, 14, 6];
const rarity = ["common", "uncommon", "rare", "legendary"]


function preload() { // we load in all the images before showing the game
  rpgFont = loadFont('Breathe Fire.otf');
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
    new Button([30+180*i, 300, 130, 30], [54, 110, 216], [0, 0, 0], screenClicked, i)
    new Button([width-249, 198+100*i, 247, 100], [224, 139, 41], [143, 85, 20], screenClicked, i)
  }
  textFont(rpgFont);
}

function draw() {
  background(255, 0, 0)
  fill(191, 211, 255) // Dit is onze background nu
  rect(1, 1, width-253, height-3)
  drawScreens();
  drawStatsPanel();
  drawButtons();
  fixPointer();
  if (currentlyDisplaying) image(currentlyDisplaying, 400, 400)
}

function fixPointer() {
  currentlyOnButton ? document.body.style.cursor = 'pointer' : document.body.style.cursor = 'default';
  currentlyOnButton = false;
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
    translate(width-249, 0)
    fill(232, 141, 37);
    strokeWeight(3)
    rect(0, 1, 247, 100);
    fill(0);
    textSize(30);
    var secondsLeft = Math.floor((18000-frameCount)/60)
    text(Math.floor(secondsLeft/60) + ":" + (secondsLeft % 60 < 10 ? "0" : "") + secondsLeft % 60, 10, 30)
    textSize(15)
    text("before dad finds out you're", 72, 15)
    text("using his credit card", 72, 30)

    // FLEXMETER
    fill(255)
    beginShape();
    vertex(20, 70);
    vertex(248, 70);
    vertex(248, 50);
    vertex(30, 50);
    vertex(20, 70);
    endShape();
    fill(120)
    textStyle(ITALIC)
    text("F   L   E   X    M   E   T   E   R", 38, 65)
    strokeWeight(0)
    fill(255, 100+flexMeter*sin(frameCount/40), 0)
    beginShape();
    vertex(22, 68);
    vertex(map(flexMeter, 0, 100, 22, 198), 68);
    if (flexMeter > 5) {
      vertex(map(flexMeter, 0, 100, 22, 198), 52);
      vertex(30, 52);
    } else {
      vertex(map(flexMeter, 0, 100, 22, 198), map(flexMeter, 0, 5, 68, 52))
    }
    vertex(22, 69)
    endShape();
    pop()
}


function screenClicked(screenNumber) {
  // for now fixen we gewoon instant een drop
  currentlyDisplaying = getDrop()[1]
  flexMeter++
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
   if (button.inside()) button.callFunction()
  }
}

function drawButtons() {
  for (button of buttonList) {
    button.drawButton()
  }
}

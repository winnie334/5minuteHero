/// <reference path="./p5.global-mode.d.ts" />
var inventory = [];
var upgradeButtons = [];
var screenList = [];
var allImages = []; // array of array containing all the pictures by rarity
var currentlyOnButton = false; // set to true to change pointer
var gameState = "playing"; // set to start to display start screen, playing for game, and win or lose //todo verander naar start bij release

let rpgFont; // onze megacoole totaal niet gestolen font
let chestImages = [];
let coinImage;
let upgradeImages = [];

var currentlyDisplaying; // todo gooi dit weg

// globale variables voor vanalles hieronder
var flexMeter = 0; // max of 100%
var coins = 123; // todo mss een start amount geven?
var upgradesBought = [0, 0, 0, 0];

const imageAmounts = [87, 37, 14, 6];
const rarity = ["common", "uncommon", "rare", "legendary"]


function preload() { // we load in all the images before showing the game
  rpgFont = loadFont('Breathe Fire.otf');
  coinImage = loadImage("images/coin.png");

  upgradeImages.push(loadImage("images/flexM.png"))

  for (var i = 0; i < 14; i++) {
    chestImages.push(loadImage("images/chestL/chest"+i+".png"))
  }

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
    upgradeButtons.push(new Button([width-249, 198+100*i, 247, 100], [224, 139, 41], [143, 85, 20], buyUpgrade, i, 0))
    screenList.push(new Screen([20 + 180*i, 30, 150, 300], i == 0, 50 * Math.pow(2, i)))
  }
  textFont(rpgFont);
}

function draw() {
  switch (gameState) {
    case "start":
      drawStart();
     // gameState = "playing";

      break;

    case "playing":
      drawGame();
      break;

    case "win":
      drawWin();
      break;

    case "lose":
      drawLose();
      break;
  }

  if (currentlyDisplaying) image(currentlyDisplaying, 400, 400)
}


function fixPointer() {
  currentlyOnButton ? document.body.style.cursor = 'pointer' : document.body.style.cursor = 'default';
  currentlyOnButton = false;
}

function drawStart() {
  push();
  noStroke();
  background(177, 179, 177);
  textSize(40);
  textAlign(CENTER);
  text("Welcome to 5 minute flexer." , width *0.5, height * 0.3 );
  textSize(25)
  text("recently your adventuring guild has been increasing its standards for its members.",  width *0.5, (height * 0.3) + 40 );
  text("Unfortunately you do not meet them so go out into the world and collect loot to fill your flexmeter",  width *0.5, height * 0.3 + 65);
  text("and collect currency, use this currency on upgrades to aquire loot faster.",  width *0.5, height * 0.3 + 90);
  textSize(20);
  text("-click Anywhere to start-", width *0.5, height * 0.3 + 130);
  pop();
  startGame();
}

function drawGame() {
  drawBackground();
  drawScreens();
  drawStatsPanel();
  drawButtons();
  drawInventory();
  drawUpgrades();
  fixPointer();
 
}

function drawWin() {

}

function drawLose() {

}

function startGame(){
  if (gameState == "start" && mouseIsPressed){
    gameState = "playing";
  }
}

function screenClicked(screenNumber) {
  // for now fixen we gewoon instant een drop
  if (inventory.length <= 20){
  inventory.push(getDrop()[1]);
  flexMeter++
  }
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
  for (var button of upgradeButtons) {
   if (button.inside()) button.callFunction()
  }
  for (var screen of screenList) {
    screen.checkClick();
  }
}

// here goes all upgrade balancing
function getUpgradePrice(upgradeNumber) {
  switch (upgradeNumber) {
    case 0:
      return Math.floor(50 * Math.pow(1.27, (1 + upgradesBought[0])));
  }
}

function buyUpgrade(upgradeNumber) {
  if (getUpgradePrice(upgradeNumber) < coins) {
    coins -= getUpgradePrice(upgradeNumber);
    upgradesBought[upgradeNumber]++;
  }
}

function drawBackground() {
  background(255, 0, 0)
  fill(191, 211, 255) // Dit is onze background nu
  strokeWeight(3);
  rect(1, 1, width-253, height-3)
  
}

function drawButtons() {
  for (var button of upgradeButtons) {
    button.drawButton()
  }
}

function drawScreens() {
  for (var screen of screenList) {
    screen.drawScreen();
  }
}

function drawInventory() {
  for (var i = 0; i < 8; i++) {
    push();
    fill(255,0,0);
    rect(70*i + 10*i + 40, height-120,70,70);
    rect(70*i + 10*i +40, height- 220,70,70);
    pop();
  }  
}

function drawStatsPanel() {
  //info panel
  push()
  translate(width-249, 0)
  fill(232, 141, 37);
  strokeWeight(3)
  rect(0, 1, 247, 140);
  fill(0);
  textSize(30);
  var secondsLeft = Math.floor((18000-frameCount)/60)
  text(Math.floor(secondsLeft/60) + ":" + (secondsLeft % 60 < 10 ? "0" : "") + secondsLeft % 60, 10, 30)
  textSize(15)
  text("before you're kicked", 72, 15)
  text("out of the guild", 72, 30)

  fill(198, 116, 21)
  strokeWeight(0);
  rect(10, 80, 60 + textWidth(str(coins)) * 2.5, 53)
  fill(0);
  strokeWeight(3)

  image(coinImage, 15, 85)
  textSize(40);
  text(coins, 60, 120)

  fill(224, 139, 41);
  rect(0, 141, 247, 55)
  fill(0)
  text("Upgrades", 55, 180)

  // FLEXMETER
  textSize(15)
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
  text("F   L   E   X       M   E   T   E   R", 40, 65)
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

function drawUpgrades() {
  push();
  translate(width-247, 201)
  fill(240);
  stroke(100, 60, 20);
  strokeWeight(5);
  rect(10, 10, 73, 73)
  image(upgradeImages[0], 12, 14)
  fill(0);
  noStroke();
  textSize(20)
  text("Grow muscles to", 90, 25)
  text("open chests faster!", 90, 45)
  image(coinImage, 90, 54, 24, 30)
  textSize(25)
  text(getUpgradePrice(0), 120, 77)
  textSize(21)
  text("Lv. " + upgradesBought[0], 236-textWidth("Lv. " + upgradesBought[0]), 77)
  pop();
}

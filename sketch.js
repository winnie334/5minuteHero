/// <reference path="./p5.global-mode.d.ts" />
var inventory = [null, null, null, null, null, null, null, null];
var upgradeButtons = [];
var sellButtons = [];
var screenList = [];
var allImages = []; // array of array containing all the pictures by rarity
var currentlyOnButton = false; // set to true to change pointer
var gameState = "playing"; // set to start to display start screen, playing for game, and win or lose //todo verander naar start bij release

let rpgFont; // onze megacoole totaal niet gestolen font
let chestImages = [];
let coinImage;
let upgradeImages = [];
let colorList;

// globale variables voor vanalles hieronder
var flexMeter = 0; // max of 100%
var coins = 12003; // todo mss een start amount geven?
var upgradesBought = [0, 0, 0, 0];

const imageAmounts = [87, 37, 14, 6];
const rarity = ["common", "uncommon", "rare", "legendary"]


function preload() { // we load in all the images before showing the game
  rpgFont = loadFont('Breathe Fire.otf');
  coinImage = loadImage("images/coin.png");

  upgradeImages.push(loadImage("images/flexM.png"))
  upgradeImages.push(loadImage("images/backpack.png"))

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
  rarityColor = [color(232, 235, 233), color(30, 150, 70), color(127, 10, 145), color(227, 180, 25)];
  createCanvas(1000, 600);
  for (var i = 0; i < 4; i++) {
    upgradeButtons.push(new Button([width-249, 198+100*i, 247, 100], [224, 139, 41], [143, 85, 20], buyUpgrade, i))
    screenList.push(new Screen([20 + 180*i, 30, 150, 300], i == 0, 50 * Math.pow(2, i)))
  }

  for (var i = 0; i < 16; i++) {
    // todo laat coords matchen met 64x64 inventory
    sellButtons.push(new Button([40 + 80*(i - 8*(i>=8)), height - 220 + 100*(i>=8), 70, 70], [0, 0, 0], [0, 0, 0], sellItem, i))
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

function sellItem(invIndex) {
  // todo
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
      return Math.floor(20 * Math.pow(1.6, (upgradesBought[0])));
    case 1:
      if (upgradesBought[1] == 8) return "MAX"
      return Math.floor(60 * Math.pow(1.5, (upgradesBought[1])));
    case 2:
      return Math.floor(20 * Math.pow(1.6, (upgradesBought[0])));
    case 3:
      return Math.floor(20 * Math.pow(1.6, (upgradesBought[0])));
  }
}

function buyUpgrade(upgradeNumber) {
  if (getUpgradePrice(upgradeNumber) < coins) {
    if (upgradeNumber == 1) {
      if (inventory.length >= 16) return;
      inventory.push(null);
    } 
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
  push();
  for (var button of upgradeButtons) {
    button.drawButton()
  }
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i] == null) continue;
    var button = sellButtons[i];
    button.drawButton();
  }
  pop();
}

function drawScreens() {
  for (var screen of screenList) {
    screen.drawScreen();
  }
}

function drawInventory() {
  // oke dit zit er probably retarded uit omdat ik 3 keer dingen doe in exact dezelfde loop
  // maar de reden hiervoor is dat nu ALLE squares worden getekend, dan ALLE items, en dan ALLE overlays
  // als ik 1 per 1 deed zou het kunnen dat een item "achter" een square kwam te zitten tijdens zijn animatie
  push();
  textSize(30);
  fill(0);
  text("INVENTORY", 284, 365)
  for (var i = 0; i < inventory.length; i++) {
    coord = [40 + 80*(i - 8*(i>=8)), height - 220 + 100*(i>=8)]
    if (inventory[i] == null) fill(198, 116, 21);
    else fill(rarityColor[inventory[i].tier]);
    rect(coord[0], coord[1], 70, 70)
  }

  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i] != null) inventory[i].update();
  }

  for (var i = 0; i < inventory.length; i++) {
    coord = [40 + 80*(i - 8*(i>=8)), height - 220 + 100*(i>=8)]
    if (sellButtons[i].inside() && inventory[i] != null) {
      fill(0, 0, 0, 120);
      rect(coord[0], coord[1], 70, 70)
      fill(255)
      textSize(23)
      text('SELL', coord[0] + 13, coord[1]+25)
      image(coinImage, coord[0] + 5, coord[1] + 40, 17, 25)
      text(inventory[i].moneyValue, coord[0] + 27, coord[1] + 60)
    }
  }
  pop();
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

  // F L E X M E T E R
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

  for (var i = 0; i < upgradeImages.length; i++) {
    fill(240);
    stroke(100, 60, 20);
    strokeWeight(5);
    rect(10, 10 + 100*i, 73, 73)

    fill(0);
    noStroke();
    image(coinImage, 90, 54+100*i, 24, 30)
    textSize(25)
    text(getUpgradePrice(i), 120, 77+100*i)
    textSize(21)
    text("Lv. " + upgradesBought[i], 236-textWidth("Lv. " + upgradesBought[i]), 77+100*i)
  }

  // muscle
  image(upgradeImages[0], 12, 14)
  textSize(20)
  text("Grow muscles to", 90, 25)
  text("open chests faster!", 90, 45)
  
  // backpack
  translate(0, 100);
  image(upgradeImages[1], 15, 15)
  fill(0);
  noStroke();
  textSize(20)
  text("Expand backpack", 90, 25)
  text("to keep more items!", 90, 45)

  pop();
}

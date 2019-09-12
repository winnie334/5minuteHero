/// <reference path="./p5.global-mode.d.ts" />
var inventory = [null, null, null, null, null, null, null, null];
var upgradeButtons = [];
var sellButtons = [];
var screenList = [];
var allImages = []; // array of array containing all the pictures by rarity
var currentlyOnButton = false; // set to true to change pointer
var autoSell = false;
var gameState = "start"; // set to start to display start screen, playing for game, and win or lose //todo verander naar start bij release
var startFrame = 0;
var endFrame = 0;

let rpgFont; // onze megacoole totaal niet gestolen font
let chestImages = [];
let coinImage;
let upgradeImages = [];
let colorList;
let loseBg;
let victoryBg;

// globale variables voor vanalles hieronder
var flexMeter = 0; // max of 100%
var coins = 4;
var upgradesBought = [0, 0, 0, 0];

const imageAmounts = [87, 37, 14, 6];
const rarity = ["common", "uncommon", "rare", "legendary"]


function preload() { // we load in all the images before showing the game
  rpgFont = loadFont('BreatheFire52.otf');
  coinImage = loadImage("images/coin.png");

  loseBg = loadImage("images/Background.png");
  victoryBg = loadImage("images/victoryBG.png")

  upgradeImages.push(loadImage("images/flexM.png"))
  upgradeImages.push(loadImage("images/backpack.png"))
  upgradeImages.push(loadImage("images/thrash.png"))

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
  inventory[2] = new Item(0, allImages[0][Math.floor(Math.random()*allImages[0].length)], [203, height - 218])
  inventory[2].isMoving = false;
  inventory[6] = new Item(0, allImages[0][Math.floor(Math.random()*allImages[0].length)], [523, height - 218])
  inventory[6].isMoving = false;
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
  //image(loseBg, 0, 0, 1000, 600);
  image(loseBg, -frameCount % width, 0, width, height);
  image(loseBg, -frameCount % width + width, 0, width, height);
  textSize(50);
  textAlign(CENTER);
  stroke(0, 0, 0);
  fill(196, 157, 27);
  strokeWeight(5);
  text("Welcome to Five Minute Flexer", width *0.5, height * 0.18 + 23 * sin(frameCount/60));
  fill(255, 255, 255);
  stroke(0, 0, 0);
  strokeWeight(3);
  textSize(26)
  text("Your favorite adventuring guild is looking for new members - and you want in !",  width *0.5-10, (height * 0.3) + 40 );
  text("However, they only want the coolest adventurers, those with rare and legendary items!",  width *0.5-10, height * 0.3 + 68);
  text("This might be the time to open your endless pile of chests you have gathered over the years...", width *0.5-10, height * 0.3 + 96)
  text("Collect rare items to flex with and sell the rest for upgrades!",  width *0.5-10, height * 0.3 + 124);
  textSize(20);
  text("-click anywhere to start-", width *0.5, height * 0.75);
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
  imageMode(CORNER)
  image(victoryBg, 0, 0)
  var coolItems = [];
  for  (var i = 0; i < inventory.length; i++) {
    if (inventory[i] != null )//&& inventory[i].tier >= 2)
      coolItems.push(inventory[i]);
  }
  imageMode(CENTER)
  for (var i = 0; i < coolItems.length; i++) {
    image(coolItems[i].itemImage, 284 + 140*cos(frameCount/100 + i*2*Math.PI/coolItems.length), 170 + 140*sin(frameCount/100 + i*2*Math.PI/coolItems.length))
  }
  textSize(50);
  fill(196, 157, 27);
  stroke(0);
  strokeWeight(5)
  text("CONGRATULATIONS !", 500, 130)
  fill(0);
  noStroke();
  textSize(25);
  text("You managed to collect enough rare items ")
}

function drawLose() {
  push();
  image(loseBg, -frameCount % width, 0, width, height);
  image(loseBg, -frameCount % width + width, 0, width, height);
  textSize(40);
  textAlign(CENTER);
  stroke(0);
  fill(196, 157, 27);
  strokeWeight(5);
  text("Game Over" , width *0.5, height * 0.18);
  textSize(25)
  strokeWeight(1);
  fill(255);
  text("You didn't manage to collect enough rare items to flex with,",  width *0.5, (height * 0.35) + 32 );
  text("so you were not invited to the guild. Perhaps another time...",  width *0.5, (height * 0.35) + 52 );
  text("Tip: Try to keep purple and yellow items, they contribute a lot to the flexmeter.",  width *0.5, height * 0.35 + 95);
  text("-Refresh (F5) to restart-", width *0.5, height * 0.75)

  textSize(25)

}

function startGame(){
  if (gameState == "start" && mouseIsPressed){
    startFrame = frameCount;
    gameState = "playing";
  }
}

function getDrop() {
  var yourRNG = Math.random() * 100;
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
  if (inventory[invIndex] == null) return;
  inventory[invIndex].sell();
  inventory[invIndex] = null;
}

function mousePressed() {
  for (var button of upgradeButtons.concat(sellButtons)) {
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
      if (upgradesBought[1] == 8) return "MAX";
      return Math.floor(60 * Math.pow(1.5, (upgradesBought[1])));
    case 2:
        if (upgradesBought[2] >= 1) return "MAX";
      return 500;
    case 3:
      return 0;
      //return Math.floor(20 * Math.pow(1.6, (upgradesBought[0])));
  }
}

function buyUpgrade(upgradeNumber) {
  if (getUpgradePrice(upgradeNumber) <= coins) {
    if (upgradeNumber == 1) {
      if (inventory.length >= 16) return;
      inventory.push(null);
    } else if (upgradeNumber == 2 && upgradesBought[2] >= 1) return;
    coins -= getUpgradePrice(upgradeNumber);
    upgradesBought[upgradeNumber]++;
    if (upgradeNumber == 2) {
      upgradeButtons.push(new Button([width-100, 455, 80, 30], [200, 200, 200], [100, 100, 100], switchAutoSell, null))
      autoSell = true;
    }
  }
}

function switchAutoSell() {
  autoSell = !autoSell;
}

function drawBackground() {
  background(255, 0, 0)
  fill(191, 211, 255) // Dit is onze background nu
  strokeWeight(3);
  rect(1, 1, width-253, height-3)
  //image(loseBg, 0, -100, loseBg.width, loseBg.height - 80)
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
    strokeWeight(5)
    if (inventory[i] == null) {
      fill(198, 116, 21);
      stroke(143, 85, 20)
    } else {
      fill(rarityColor[inventory[i].tier]);
      stroke(rarityColor[inventory[i].tier].levels[0]*0.4, rarityColor[inventory[i].tier].levels[1]*0.4, rarityColor[inventory[i].tier].levels[2]*0.4)
    }
    rect(coord[0], coord[1], 70, 70)
  }

  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i] != null) inventory[i].update();
  }

  for (var i = 0; i < inventory.length; i++) {
    coord = [40 + 80*(i - 8*(i>=8)), height - 220 + 100*(i>=8)]
    if (sellButtons[i].inside() && inventory[i] != null) {
      noStroke();
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
  var secondsLeft = Math.floor((18060-(frameCount-startFrame))/60)
  text(Math.floor(secondsLeft/60) + ":" + (secondsLeft % 60 < 10 ? "0" : "") + secondsLeft % 60, 15, 33)
  textSize(22)
  text("before sign-ups end", 82, 28)
  //text("out of the guild", 77, 34)

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
    fill(200);
    stroke(100, 60, 20);
    strokeWeight(5);
    rect(10, 10 + 100*i, 73, 73)

    fill(0);
    noStroke();
    textSize(25)
    if (!(i == 2 && upgradesBought[2] >= 1)) {
      image(coinImage, 90, 54+100*i, 24, 30)
      text(getUpgradePrice(i), 120, 77+100*i)
    }
    textSize(21)
    if (i != 2)
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

  // trashSell
  translate(0, 100);
  image(upgradeImages[2], 13, 15, 40, 64)
  image(coinImage, 55, 47, 24, 30)
  image(coinImage, 55, 17, 24, 30)
  fill(0);
  noStroke();
  textSize(20)
  text("Automatically", 90, 25)
  text("sell white items !", 90, 45)
  if (upgradesBought[2] >= 1) {
    textSize(25)
    text(autoSell ? "ON" : "OFF", 93, 77)
    text("Toggle", 153, 77)
  }
  pop();
}

function Screen(coords, unlocked, price) {

    this.coords = coords;
    this.unlocked = unlocked;
    this.price = price;
    this.animationFrame = 0;
    this.currentDrop = null;

    this.buyButton = new Button([10 + coords[0], this.coords[1] + 120, this.coords[2] - 20, this.coords[3] - 270], [54, 110, 216], [0, 0, 0], null, null)
    this.unboxButton = new Button([10 + coords[0], this.coords[1] + 270, this.coords[2] - 20, this.coords[3] - 270], [54, 110, 216], [0, 0, 0], null, null)


    this.drawScreen = function() {
        push();
        strokeWeight(3);
        if (this.unlocked) {
            fill(200, 200, 255);
            rect(coords[0], coords[1], coords[2], coords[3])
            this.unboxButton.drawButton();
            fill(240);
            textAlign(CENTER);
            textSize(23);
            if (this.animationFrame == 0)
                text("Open !", coords[0] + coords[2] / 2, coords[1] + coords[3] - 8)
            else if (this.animationFrame < waitFrame)
                text("Opening...", coords[0] + coords[2] / 2, coords[1] + coords[3] - 8)
            else if (this.animationFrame == waitFrame)
                text("Collect", coords[0] + coords[2] / 2, coords[1] + coords[3] - 8)
            else if (this.animationFrame >= waitFrame)
                text("Closing...", coords[0] + coords[2] / 2, coords[1] + coords[3] - 8)
        } else {
            fill(70);
            rect(coords[0], coords[1], coords[2], coords[3])
            this.buyButton.drawButton();
            image(coinImage, 45 + coords[0], 124.5 + coords[1], 18, 22)
            fill(240);
            textSize(20);
            text(this.price, coords[0] + 70, coords[1] + 143)
            textAlign(CENTER);
            textSize(23)
            text("Buy an extra", coords[0] + coords[2] / 2, coords[1] + 40)
            text("chest room !", coords[0] + coords[2] / 2, coords[1] + 60)
        }
        this.drawAnimation();
        pop();
    }

    this.buy = function() {
        if (this.unlocked) return;
        if (coins > this.price) {
            coins -= this.price;
            this.unlocked = true;
        }
    }

    const unboxFrames = 300;
    const itemShowFrames = 400;
    const waitFrame = 401;
    const closingFrames = 440;

    this.drawAnimation = function() {
        if (!this.unlocked) return;
        if (this.animationFrame == 0) {
            image(chestImages[0], coords[0] + 28, coords[1] + coords[3] - 130);
        } else {
            // We are currently unboxing
            if (this.animationFrame < unboxFrames) {
                image(chestImages[Math.floor(this.animationFrame / 42)], coords[0] + 28, coords[1] + coords[3] - 130);
            } else if (this.animationFrame <= itemShowFrames) {
                image(chestImages[7], coords[0] + 28, coords[1] + coords[3] - 130);
                var imageSize = map(this.animationFrame, unboxFrames, itemShowFrames, 0.1, 64)
                var imagePosition = map(this.animationFrame, unboxFrames, itemShowFrames, coords[1] + coords[3] - 90, coords[1] + 35)
                image(this.currentDrop[1], coords[0] + coords[2] / 2 - imageSize / 2, imagePosition, imageSize, imageSize)
            } else if (this.animationFrame == waitFrame) {
                image(chestImages[7], coords[0] + 28, coords[1] + coords[3] - 130);
                image(this.currentDrop[1], coords[0] + coords[2] / 2 - 32, coords[1] + 35, 64, 64)
            } else {
                image(chestImages[Math.floor(map(this.animationFrame, waitFrame, closingFrames, 7, 13))], coords[0] + 28, coords[1] + coords[3] - 130);
            }


            // trust dat dit werkt
            if (this.animationFrame < unboxFrames) this.animationFrame += 1 + upgradesBought[0] / 2;
            else if (this.animationFrame <= itemShowFrames) this.animationFrame = Math.floor(this.animationFrame + 1)
            else if (this.animationFrame == waitFrame) {} // pass
            else if (this.animationFrame < closingFrames) this.animationFrame++;
            else if (this.animationFrame >= closingFrames) this.animationFrame = 0;
            else console.log("uh oh, an error has occured. Here's some data: " + this.animationFrame + " at " + coords[0])
        }
    }

    
    this.unbox = function() {
        this.currentDrop = getDrop();
        this.animationFrame = 1;
    }

    this.collect = function() {     
        if (inventory.indexOf(null) != -1) {
            var collectedItem = new Item(this.currentDrop[0], this.currentDrop[1], [coords[0] + coords[2] / 2 - 32, coords[1] + 35])
            inventory[inventory.indexOf(null)] = collectedItem;
            this.animationFrame++; 
         } else return;  
    }

    this.checkClick = function() {
        if (this.unlocked) {
            if (this.unboxButton.inside()) {
                if (this.animationFrame == 0)
                    this.unbox();
                else if (this.animationFrame == waitFrame)
                    this.collect();
            }
                
        } else if (this.buyButton.inside()) 
            this.buy();
    }
}
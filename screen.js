function Screen(coords, unlocked, price) {

    this.coords = coords;
    this.unlocked = unlocked;
    this.price = price;
    this.animationFrame = 0;
    this.currentDrop = null;

    this.drawScreen = function() {
        push();
        strokeWeight(3);
        if (this.unlocked) {
            fill(200, 200, 255);
            rect(coords[0], coords[1], coords[2], coords[3])
            this.unboxButton.drawButton();
        } else {
            fill(100);
            rect(coords[0], coords[1], coords[2], coords[3])
            this.buyButton.drawButton();
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
    const itemShowFrames = 600;
    const fullAnimation = 601;

    this.drawAnimation = function() {
        if (!this.unlocked) return;
        if (this.animationFrame == 0) {
            image(chestImages[0], coords[0] + 28, coords[1] + coords[3] - 130);
        } else {
            // We are currently unboxing
            if (this.animationFrame < unboxFrames) {
                image(chestImages[Math.floor(this.animationFrame / 42)], coords[0] + 28, coords[1] + coords[3] - 130);
            } else if (this.animationFrame < itemShowFrames) {
                image(chestImages[7], coords[0] + 28, coords[1] + coords[3] - 130);
                var imageSize = map(this.animationFrame, unboxFrames, itemShowFrames, 0.1, 64)
                var imagePosition = map(this.animationFrame, unboxFrames, itemShowFrames, coords[1] + coords[3] - 90, coords[1] + 35)
                image(this.currentDrop[1], coords[0] + coords[2] / 2 - imageSize / 2, imagePosition, imageSize, imageSize)
            } else {
                image(chestImages[7], coords[0] + 28, coords[1] + coords[3] - 130);
                image(this.currentDrop[1], coords[0] + coords[2] / 2 - 32, coords[1] + 35, 64, 64)
            }


            // trust dat dit werkt
            if (this.animationFrame != fullAnimation) this.animationFrame += 1 + upgradesBought[1] / 2;
            if (this.animationFrame > fullAnimation) this.animationFrame = fullAnimation;
        }
    }

    
    this.unbox = function() {
        this.currentDrop = getDrop();
        this.animationFrame = 1;
    }

    this.checkClick = function() {
        if (this.unlocked) {if (this.unboxButton.inside()) this.unboxButton.callFunction();}
        else if (this.buyButton.inside()) this.buyButton.callFunction();
    }

    this.buyButton = new Button([10 + coords[0], this.coords[1] + 120, this.coords[2] - 20, this.coords[3] - 270], [54, 110, 216], [0, 0, 0], this, null, 1)
    this.unboxButton = new Button([10 + coords[0], this.coords[1] + 270, this.coords[2] - 20, this.coords[3] - 270], [54, 110, 216], [0, 0, 0], this, null, 2)

}
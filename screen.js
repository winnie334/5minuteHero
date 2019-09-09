function Screen(coords, unlocked, price) {

    this.coords = coords;
    this.unlocked = unlocked;
    this.price = price;

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
        pop();
    }

    this.buy = function() {
        if (this.unlocked) return;
        if (coins > this.price) {
            coins -= this.price;
            this.unlocked = true;
        }
    }

    
    this.unbox = function() {

    }

    this.checkClick = function() {
        if (unlocked) {if (this.unboxButton.inside()) this.unboxButton.callFunction();}
        else if (this.buyButton.inside()) this.buyButton.callFunction();
    }

    this.buyButton = new Button([10 + coords[0], this.coords[1] + 120, this.coords[2] - 20, this.coords[3] - 270], [54, 110, 216], [0, 0, 0], this, null, 1)
    this.unboxButton = new Button([10 + coords[0], this.coords[1] + 270, this.coords[2] - 20, this.coords[3] - 270], [54, 110, 216], [0, 0, 0], this, null, 2)

}
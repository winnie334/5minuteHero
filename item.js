function Item(tier, itemImage, startPos) {
    this.tier = tier;
    this.itemImage = itemImage;
    this.startPos = startPos;
    this.curPos = startPos.slice();
    this.isMoving = true;
    this.endPos = [];

    // very advanced algorithms
    //spaghet
    this.moneyValue = Math.floor(10*Math.floor(random(Math.pow(2, this.tier), Math.pow(3, this.tier))+random(Math.pow(2, this.tier), Math.pow(3, this.tier))) + random(-10, 10))
    if (this.moneyValue >= 999) this.moneyValue = 999;
    this.flexValue = 2 * Math.pow(2, this.tier);
    flexMeter += this.flexValue;

    // todo get position in inventory
    
    this.update = function() {
        if (this.isMoving) {
            this.curPos[0] = this.curPos[0] + (this.endPos[0] - this.curPos[0]) / 8
            this.curPos[1] = this.curPos[1] + (this.endPos[1] - this.curPos[1]) / 8
            if (Math.abs(this.curPos[0] - this.endPos[0]) < 1 && Math.abs(this.curPos[1] - this.endPos[1]) < 1) {
                this.curPos = this.endPos;
                this.isMoving = false;
            }
        }
        image(this.itemImage, this.curPos[0], this.curPos[1])
    }

    this.sell = function() {
        flexMeter -= this.flexValue;
        coins += this.moneyValue;
    }
}
function Item(tier, itemImage, startPos) {
    this.tier = tier;
    this.itemImage = itemImage;
    this.startPos = startPos;
    this.curPos = startPos.slice();
    this.isMoving = true;

    // very advanced algorithms
    this.moneyValue = Math.floor(10*Math.floor(random(Math.pow(2, this.tier), Math.pow(3, this.tier))+random(Math.pow(2, this.tier), Math.pow(3, this.tier))) + random(-10, 10))
    this.flexValue = Math.pow(2, this.tier);
    flexMeter += this.flexValue;

    // todo get position in inventory
    this.endPos = [random(22, 700), random(386, 573)];
    this.endSize = 40;

    allItems.push(this);

    this.update = function() {
        if (this.isMoving) {
            this.curPos[0] = this.curPos[0] + (this.endPos[0] - this.curPos[0]) / 8
            this.curPos[1] = this.curPos[1] + (this.endPos[1] - this.curPos[1]) / 8
            var imageSize = map(this.curPos[0], this.startPos[0], this.endPos[0], 64, this.endSize)
            if (Math.abs(this.curPos[0] - this.endPos[0]) < 1 && Math.abs(this.curPos[1] - this.endPos[1]) < 1) {
                this.curPos = this.endPos;
                this.isMoving = false;
            }
        } else {
            var imageSize = this.endSize;
        }
        image(this.itemImage, this.curPos[0], this.curPos[1], imageSize, imageSize)
    }

    this.sell = function() {
        // todo remove self from inv list
        coins += this.moneyValue;
    }
}
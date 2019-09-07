function Button(coords, color, functionToCall, argument) {

    this.coords = coords;
    this.color = color;
    this.functionToCall = functionToCall;
    this.argument = argument;

    buttonList.push(this);

    this.drawButton = function() {
        fill(this.color)
        rect(this.coords[0], this.coords[1], this.coords[2], this.coords[3])
    }

    this.checkClick = function() {
        if (mouseX >= this.coords[0] && mouseX <= this.coords[0] + this.coords[2] &&
            mouseY >= this.coords[1] && mouseY <= this.coords[1] + this.coords[3]) {
                this.functionToCall(this.argument)
        }

    }
}
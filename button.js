function Button(coords, color, strokeColor, functionToCall, argument) {

    this.coords = coords;
    this.color = color;
    this.strokeColor = strokeColor;
    this.functionToCall = functionToCall;
    this.argument = argument;

    this.drawButton = function() {
        push();
        if (this.inside()) {
            fill(1.1 * this.color[0], 1.1 * this.color[1], 1.1 * this.color[2])
            currentlyOnButton = true;
        }
        else fill(this.color[0], this.color[1], this.color[2])
        stroke(this.strokeColor[0], this.strokeColor[1], this.strokeColor[2])
        rect(this.coords[0], this.coords[1], this.coords[2], this.coords[3])
        pop();
    }

    this.inside = function() {
        return (mouseX >= this.coords[0] && mouseX <= this.coords[0] + this.coords[2] &&
                mouseY >= this.coords[1] && mouseY <= this.coords[1] + this.coords[3])
    }

    this.callFunction = function() {
        this.functionToCall(this.argument);
    }
}
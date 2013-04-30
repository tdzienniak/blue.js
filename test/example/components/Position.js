(function () {
    function Position (x, y) {
        this.type = "Position";
        
        this.x = this.prevX = x;
        this.y = this.prevY = y;
    }

    this.Position = Position;
})();
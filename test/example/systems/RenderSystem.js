(function () {
    function RenderSystem (ctx) {
        /*this.core = core;*/
        this.ctx = ctx;
    }

    RenderSystem.prototype = {
        beforUpdate: function () {/*do nothing*/},
        update: function (delta) {
            var renderNodes = this.core.getNodes("RenderNode");
            //console.log(components);
            this.ctx.clearRect(0, 0, 512, 512);

            for (var i = 0, len = renderNodes.length; i < len; i++) {
                var position = renderNodes[i].position,
                    render = renderNodes[i].render;


                //console.log(this.ctx);
                this.ctx.beginPath();
                this.ctx.arc(position.x, position.y, 20, 0, Math.PI * 2, false);
                this.ctx.fillStyle = render.color;
                this.ctx.fill();
            }
        },
        afterUpdate: function () {/*do nothing*/}
    };

    this.RenderSystem = RenderSystem;
})();
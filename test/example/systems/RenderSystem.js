(function () {
    function RenderSystem (ctx) {
        /*this.core = core;*/
        this.ctx = ctx;
    }

    RenderSystem.prototype = {
        beforUpdate: function () {/*do nothing*/},
        update: function (delta) {
            var components = this.core.getComponentsGroupedByEntity(["Position", "RenderCircle"]);
            //console.log(components);
            this.ctx.clearRect(0, 0, 512, 512);

            for (var id in components) {
                var position = components[id][0],
                    render = components[id][1];


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
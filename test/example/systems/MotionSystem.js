(function () {
    function MotionSystem () {
        /*this.core = core;*/
    }

    MotionSystem.prototype = {
        beforUpdate: function () {/*do nothing*/},
        update: function (delta) {
            var motionNodes = this.core.getNodes("MotionNode");

            for (var i = 0, len = motionNodes.length; i < len; i++) {
                var position = motionNodes[i].position,
                    velocity = motionNodes[i].velocity;

                position.prevX = position.x;
                position.prevY = position.y;

                position.x += delta / 1000 * velocity.velocity.x;
                position.y += delta / 1000 * velocity.velocity.y;

                //console.log(position);
            }
        },
        afterUpdate: function () {/*do nothing*/}
    };

    this.MotionSystem = MotionSystem;
})();
(function () {
    function MotionSystem () {
        /*this.core = core;*/
    }

    MotionSystem.prototype = {
        beforUpdate: function () {/*do nothing*/},
        update: function (delta) {
            var motionComponents = this.core.getComponentsGroupedByEntity(["Position", "Velocity"]);

            for (var id in motionComponents) {
                var position = motionComponents[id][0],
                    velocity = motionComponents[id][1];

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
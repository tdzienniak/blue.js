(function () {
    function CollisionSystem () {
        /*this.core = core;*/
    }

    CollisionSystem.prototype = {
        beforUpdate: function () {/*do nothing*/},
        update: function (delta) {
            var dimensions = this.core.getComponentsByType("StageDimensions")[0],
                components = this.core.getComponentsGroupedByEntity(["Position", "Velocity", "Collision"]);

            for (var id in components) {
                var position = components[id][0],
                    velocity = components[id][1],
                    collision = components[id][2];
                //console.log(position);

                if (position.x <= collision.radius || position.x >= (dimensions.width - collision.radius)) {
                    console.log("reverse x");
                    velocity.velocity.reverseX();
                } else if (position.y <= collision.radius || position.y >= (dimensions.height - collision.radius)) {
                    velocity.velocity.reverseY();
                } else {
                    /*do nothing*/
                }
            }

           // console.log(position);
        },
        afterUpdate: function () {/*do nothing*/}
    };

    this.CollisionSystem = CollisionSystem;
})();
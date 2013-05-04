(function () {
    function CollisionSystem () {
        /*this.core = core;*/
    }

    CollisionSystem.prototype = {
        beforUpdate: function () {/*do nothing*/},
        update: function (delta) {
            var dimensions = this.core.getComponentsByType("StageDimensions")[0],
                collisionNodes = this.core.getNodes("CollisionNode");

            for (var i = 0, len = collisionNodes.length; i < len; i++) {
                var position = collisionNodes[i].position,
                    velocity = collisionNodes[i].velocity,
                    collision = collisionNodes[i].collision;
                //console.log(position);

                if (position.x <= collision.radius || position.x >= (dimensions.width - collision.radius)) {
                    //console.log("reverse x");
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
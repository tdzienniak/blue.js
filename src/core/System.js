this.BlueJS = this.BlueJS || {};

(function (app) {
    function System (core) {
        this.core = core;
    }

    System.prototype = {
        beforUpdate: function () {},
        update: function () {},
        afterUpdate: function () {}
    };

    app.System = System;
})(this.BlueJS);
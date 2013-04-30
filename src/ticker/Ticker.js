this.BlueJS = this.BlueJS || {};

(function (app) {
    var FPS = 60,
        MAX_FRAME_TIME = 1000 / FPS * 2,
        PAUSE = false,
        USE_RAF = true,
        ticks = 0,
        callbacks = [],
        ticker,
        lastTimeValue = 0,
        isRunning = false,
        currentFPS = FPS;

    function Ticker () {
        throw new Error("Do not instantiate. Use as static class.");
    }

    function tick (time) {
        if (PAUSE) {
            isRunning = false;
            return;
        }

        //if ( ! useRAF) {
            var time = time || new Date().getTime();
        //}

        var delta = time - lastTimeValue;

        if (delta >= MAX_FRAME_TIME) {
            delta = 1000 / FPS;
        }

        lastTimeValue = time;

        var event = {
            delta: delta,
            ticks: ticks,
            paused: PAUSE
        };

        for (var i = 0, len = callbacks.length; i < len; i++) {
            callbacks[i](delta);
        }

        ticks++;

        ticker(tick, FPS);
    }

    Ticker = {
        useRAF: function (bool) {
            USE_RAF = bool;
        },
        currentFPS: function () {
            return currentFPS;
        },
        setFPS: function (fps) {
            FPS = fps || FPS;
        },
        getFPS: function () {
            return FPS;
        },
        setPaused: function (bool) {
            PAUSE = bool;

            if ( ! bool && ! isRunning) {
                isRunning = true;
                tick();
            }
        },
        addListener: function (callback) {
            callbacks.push(callback);
        },
        start: function () {
            if (USE_RAF) {
                ticker = (function () {
                    return  window.requestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            function(callback, fps) {
                                window.setTimeout(callback, 1000 / fps);
                            };
                })();
            } else {
                ticker = function (callback, fps) {
                    window.setTimeout(callback, 1000 / fps);
                };
            }

            console.log(ticker);

            isRunning = true;
            tick();
        }
    };

    app.Ticker = Ticker;
})(this.BlueJS);
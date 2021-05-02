var gGlobal = {
    ViewPointID: "id_ViewPoint1",
    FireworkCount: 10,
    FireworkArray: [],
    FireworkBaseVelocityX: 100,
    FireworkBaseVelocityY: 150,

    SparkCount: 10,
    SparkBaseVelocity: 100,


    BoomTime: 2.0,
    SparkDieTime: 4.0,

    LastIterationTime: 0
};

// Program Functions

function Fireworks(iX, iY, iRadius, iDx, iDy) {
    return {
        x: iX,
        y: iY,
        radius: iRadius,
        dx: iDx,
        dy: iDy,
        Sparks: [],
        State: 0,
        Timer: 0
    };
}


function Sparks(iX, iY, iRadius, iDx, iDy) {
    return {
        x: iX,
        y: iY,
        radius: iRadius,
        dx: iDx,
        dy: iDy
    };
}

function gameloop() {

    // Time Calculation
    var wDate = new Date();
    var wDt = wDate.getTime() - gGlobal.LastIterationTime;
    wDt /= 1000;
    gGlobal.LastIterationTime = wDate.getTime();


    var wCanvas = document.getElementById(gGlobal.ViewPointID);
    if (null == wCanvas) {
        return;
    }

    var wCtx = wCanvas.getContext("2d");

    if (null == wCtx) {
        return;
    }

    // Simulation Phase
    for (var wi = 0; wi < gGlobal.FireworkArray.length; ++wi) {
        var wFirework = gGlobal.FireworkArray[wi];

        wFirework.dy += 9.81 * wDt;
        wFirework.x += wFirework.dx * wDt;
        wFirework.y += wFirework.dy * wDt;

        for (var wj = 0; wj < wFirework.Sparks.length; ++wj) {
            var wSpark = wFirework.Sparks[wj];

            wSpark.dy += 9.81 * wDt;
            wSpark.x += wSpark.dx * wDt;
            wSpark.y += wSpark.dy * wDt;
        }


        if (wFirework.dy > 0) {
            wFirework.Timer += wDt;
        }

        if (wFirework.Timer > gGlobal.BoomTime) {

            if (wFirework.State == 0) {
                wFirework.State = 1;

                for (var wj = 0; wj < wFirework.Sparks.length; ++wj) {
                    var wSpark = wFirework.Sparks[wj];

                    wSpark.x = wFirework.x;
                    wSpark.y = wFirework.y;
                    wSpark.dx = 2 * (Math.random() - 0.5) * gGlobal.SparkBaseVelocity;
                    wSpark.dy = 2 * (Math.random() - 0.5) * gGlobal.SparkBaseVelocity;
                }
            }
        }

        if (wFirework.Timer > gGlobal.BoomTime + gGlobal.SparkDieTime) {
            wFirework.State = 2;
        }

        if ((wFirework.x < 0) || (wFirework.x > wCanvas.width)
            || (wFirework.y < 0) || (wFirework.y > wCanvas.height)) {
            wFirework.State = 2;
        
        }

        if (wFirework.State == 2) {

            wFirework.x = wCanvas.width * 0.5;
            wFirework.y = wCanvas.height;
            
            //Replace with Kinematic equation to better fill page
            //wFirework.dy = -1.0 * Math.random() * gGlobal.FireworkBaseVelocityY;
            //wFirework.dx = 2.0 * (Math.random() - 0.5) * gGlobal.FireworkBaseVelocityX;
            
            wFirework.dy = -1.0 *Math.sqrt(2*9.81* (Math.random() * wCanvas.height));
            wFirework.dx = 2.0 * (Math.random() - 0.5) * Math.abs(0.5*wFirework.dy);

            wFirework.State = 0;
            wFirework.Timer = 0;

            for (var wj = 0; wj < wFirework.Sparks.length; ++wj) {
                var wSpark = wFirework.Sparks[wj];

                wSpark.x = wFirework.x;
                wSpark.y = wFirework.y;
                wSpark.dx = wFirework.dx;
                wSpark.dy = wFirework.dy;
            }
        }

    }

    // Animation Phase

    wCtx.clearRect(0, 0, wCanvas.width, wCanvas.height);

    wCtx.lineWidth = 1;

    for (var wi = 0; wi < gGlobal.FireworkArray.length; ++wi) {
        var wFirework = gGlobal.FireworkArray[wi];

        if (wFirework.State == 0) {
            
            wCtx.fillStyle = "blue";

            wCtx.beginPath();
            wCtx.arc(wFirework.x, wFirework.y, wFirework.radius, 0, 2 * Math.PI, false);
            wCtx.fill();
            wCtx.stroke();

        }
        else {
            for (var wj = 0; wj < wFirework.Sparks.length; ++wj) {
                var wSpark = wFirework.Sparks[wj];

                wCtx.strokeStyle = "cyan";
                wCtx.fillStyle = "cyan";

                wCtx.beginPath();
                wCtx.arc(wSpark.x, wSpark.y, wSpark.radius, 0, 2 * Math.PI, false);
                wCtx.fill();
                wCtx.stroke();

            }

        }

    }

    requestAnimationFrame(gameloop);

}

function initialization() {

    resize();
    window.addEventListener("resize", resize);

    var wCanvas = document.getElementById(gGlobal.ViewPointID);
    if (null != wCanvas) {
        for (var wi = 0; wi < gGlobal.FireworkCount; ++wi) {

            var wX = Math.random() * wCanvas.width;
            var wY = Math.random() * wCanvas.height;
            var wRadius = Math.random() * (10 - 5) + 5;

            var wDx = 2.0 * (Math.random() - 0.5) * gGlobal.FireworkBaseVelocityX;
            var wDy = 2.0 * (Math.random() - 0.5) * gGlobal.FireworkBaseVelocityY;

            var wNewFirework = new Fireworks(wX, wY, wRadius, wDx, wDy);

            for (var wj = 0; wj < gGlobal.SparkCount; ++wj) {

                var wSpark = new Sparks(wX, wY, 5, wDx, wDy);
                wNewFirework.Sparks.push(wSpark);
            }

            gGlobal.FireworkArray.push(wNewFirework);

        }

    }

    var wDate = new Date();
    gGlobal.LastIterationTime = wDate.getTime();
    gameloop();
}

function resize() {
    var wCanvas = document.getElementById(gGlobal.ViewPointID);
    if (null != wCanvas) {
        wCanvas.width = wCanvas.parentNode.offsetWidth;
        wCanvas.height = wCanvas.parentNode.offsetHeight;
    }
}

window.addEventListener("load", initialization);
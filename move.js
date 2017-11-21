/*
 * @ 2维空间运动： 水平放置，车头朝左
 * @ 起始点 | 终点 | 请求间隔时间 | 每帧动画间隔(最低1s/30帧) | 运动的对象
 */
var D2Motion = function(initPoints, targetPoints, wholeTime, intervalTime, marker) {
    this.initPos = initPoints;
    this.tarPos = targetPoints;
    this.intervalTime = wholeTime;
    this.inIntervalTime = intervalTime;
    this.marker = marker;
};

D2Motion.prototype.effect = function() {
    var b = arguments[0],
        c = arguments[1] - arguments[0],
        t = arguments[2],
        d = arguments[3];
    return c * t / d + b;
};

D2Motion.prototype.rotation = function() {
    var deg = 0;
    var targetPos = this.tarPos;
    var curPos = this.initPos;
    if (targetPos.x != curPos.x) {
        var tan = (targetPos.y - curPos.y) / (targetPos.x - curPos.x),
            atan = Math.atan(tan);
        deg = atan * 360 / (2 * Math.PI);
        var deltaY = targetPos.y - curPos.y;
        if (tan > 0 && deltaY < 0) {
            deg = deg + 180;
        }
        if (tan < 0 && deltaY > 0) {
            deg = deg - 180;
        }
        if (deg == 0 && 1 / deg < 0) {
            deg = 180;
        }

    } else {
        var disy = targetPos.y - curPos.y;
        var bias = 0;
        if (disy > 0) {
            bias = 1;
        } else if (disy < 0) {
            bias = -1;
        }
        deg = bias * 90;
    }

    return deg;
};

D2Motion.prototype.move = function() {
    //将球面坐标转换为平面坐标
    var that = this;
    var oPoint = this.initPos;
    var nPoint = this.tarPos;
    //当前帧数
    var currentCount = 0;
    //动画次数
    var count = Math.floor(this.intervalTime / this.inIntervalTime);

    var _runtime = setInterval(function() {
        if (currentCount == count) {
            clearInterval(_runtime);
        } else {
            currentCount++;
            var x = that.effect(oPoint.x, nPoint.x, currentCount, count),
                y = that.effect(oPoint.y, nPoint.y, currentCount, count);
            that.marker.css({
                "left": x + "%",
                "top": y + "%",
                "transform": "rotate(" + that.rotation(oPoint, nPoint) + "deg)"
            });
        }
    }, this.inIntervalTime);
}

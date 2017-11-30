/*
* 批量坐标转换
* by Wilfredo
* 规定： 
* 	1. 请自行配置全局变量 lng | lat | marKey
* 	2. 调用GpsToBd方法，传值：原始返回结果
* 	3. 调用myTransResult方法，获取最大长度为100的转换后结果
*/

var posIndex = 0;
var pointsArray = new Array();
var gpsPoints = new Array();	//原始坐标点
var maxCnt = 100;				//每次转换100个点
var lng = 'longitude';		//经度
var lat = 'latitude';		//维度
var mapKey = '你的ak';	//百度地图密钥

//坐标转换
var myTransMore = function (points) {
    var i = 0;
    var str = '';
    for (; i < points.length; i++) {
        str += points[i].longitude + ',' + points[i].latitude + ';';
    }
    str = str.substr(0, str.length - 1);
    var xyUrl = "http://api.map.baidu.com/geoconv/v1/?coords=" + str
                + "&from=1&to=5&ak=" + mapKey + "&callback=myCallback";
    var oScript = document.createElement('script');
    oScript.type = "text/javascript";
    oScript.src = xyUrl;
    document.getElementsByTagName('head')[0].append(oScript);
};

// 过滤掉坐标不存在或者为0的点
// 返回所有正常的点
var getPoints = function (points) {
    var pointsArr = new Array();
    for (var i = 0; i < points.length; i++) {
        if (points[i][lng] != 0 && points[i][lat] != 0 && points[i][lng] != null && points[i][lat] != null) {
            if (70 < points[i][lng] && points[i][lng] < 136 && 3 < points[i][lat] && points[i][lat] < 54) {
                pointsArr.push(points[i]);
            }
        }
    }
    return pointsArr;
};

//封装GPS坐标, 100个为一组
//返回二维数组
var wrapGpsPoints = function (gpsPoints) {
    var i = 0, arrId = 0;
    var pointsArray = new Array();
    for (; i < gpsPoints.length; i++) {
        if (i % maxCnt == 0) {
            arrId = Math.floor(i / maxCnt);
            pointsArray[arrId] = [];
        }
        pointsArray[arrId].push(gpsPoints[i]);
    };

    return pointsArray;
};

//回调
var myCallback = function (data) {
    if (data.status != 0) {
        alert("地图坐标转换出错");
        return;
    }

    var points = data.result;
    var currentStartIndex = posIndex * maxCnt;
    for (var i in points) {
        var index = eval(currentStartIndex + Number(i));
        gpsPoints[index][lng] = points[i].x;
        gpsPoints[index][lat] = points[i].y;
    }

    myTransResult(gpsPoints.slice(currentStartIndex, currentStartIndex + points.length));	//每次回调的返回结果

    posIndex++;	//维度
    if (posIndex < pointsArray.length) {
        myTransMore(pointsArray[posIndex]);
    } else {	//坐标转换结束
        console.log("坐标已全部转换完成，本次总共转换了 " + gpsPoints.length + "个有效坐标");
        posIndex = 0;
        gpsPoints = null;
        pointsArray = null;
        myTransEnd && myTransEnd();     //坐标转换结束钩子
    }
}

function GpsToBd(points) {
    gpsPoints = getPoints(points);
    pointsArray = wrapGpsPoints(gpsPoints);
    myTransMore(pointsArray[posIndex]);
}

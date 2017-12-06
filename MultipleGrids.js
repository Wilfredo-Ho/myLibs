    /*
    * 
    * @By Wilfredo
    * @多域折线图对象
    * @params: *(data, elem, title), (title, gridHeight, baseTop, colors)
    * @调用 new MultipleGrids().setOption
    * @对data数据的格式要求：（time需跟this.time对应）
    *     {
    *        "cpu": [855, 20, 567, 365],
    *        "memory": [122, 111, 966, 250],
    *        "time": ["2017-11-01", "2017-11-02", "2017-11-03", "2017-11-04"],
    *        "trouble": [728, 502, 599, 604]
    *     }
    *     
     */

    var MultipleGrids = function(data, elem, title, gridHeight, baseTop, colors) {
        this.data = data;
        this.elem = elem;
        this.yAxisArr = []; //Y轴类目名称
        this.title = title;
        this.baseTop = baseTop || 40;
        this.gridHeight = gridHeight || 60;
        this.colors = colors || ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3", "#e5cf0d"];
        this.time = 'time'; //统一的坐标轴
        this.optionArr = {};
    }

    MultipleGrids.prototype = {

        makeOption: function() {
            var gridArr = [],
                xAxisArr = [],
                yAxisArr = [],
                seriesArr = []; //数组: 区域、x轴、y轴、数据
            var dataZoomIndexArr = [],
                dataZoomTop = 0;
            var index = 0;

            var time = this.data[this.time];
            delete this.data[this.time];
            this.data[this.time] = time;
            time = null;

            for (var i in this.data) {
                var xAxisTemp = {
                    type: 'category',
                    gridIndex: index,
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    data: data[this.time], //data
                    axisPointer: {
                        lineStyle: {
                            color: 'transparent'
                        }
                    }
                };

                var yAxisTemp = {
                    name: i,
                    type: 'value',
                    gridIndex: index,
                    nameLocation: 'middle',
                    nameTextStyle: {
                        color: '#333'
                    },
                    nameRotate: 0,
                    boundaryGap: ['30%', '30%'],
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        }
                    },
                    axisLabel: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                };

                var gridTemp = {};

                var seriesTemp = {
                    name: i,
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 2,
                    xAxisIndex: index,
                    yAxisIndex: index,
                    itemStyle: {
                        normal: {
                            color: this.colors[index]
                        }
                    },
                    data: data[i]
                }

                //dataZoom
                dataZoomIndexArr.push(index);


                //this.yAxisArr
                this.yAxisArr.push(i);

                if (i === this.time) {

                    //xAxisTemp
                    xAxisTemp['position'] = 'bottom';
                    xAxisTemp['show'] = true;
                    xAxisTemp['axisLine'] = {
                        show: false
                    };
                    xAxisTemp['splitLine'] = {
                        show: true
                    };
                    xAxisTemp['axisLabel'] = {
                        show: true,
                        textStyle: {
                            color: '#555'
                        }
                    };
                    xAxisTemp['axisPointer'] = {
                        show: true,
                        lineStyle: {
                            color: '#478cf1',
                            width: 1.5
                        }
                    };

                    //yAxisTemp
                    yAxisTemp['name'] = null;

                    //gridTemp
                    gridTemp = {
                        show: true,
                        top: this.baseTop,
                        height: this.gridHeight * index,
                        borderColor: '#ccc',
                        borderWidth: 1,
                        z: 10
                    };

                    //seriesTemp
                    seriesTemp['symbol'] = 'none';

                } else {

                    //gridTemp
                    gridTemp = {
                        top: this.baseTop + index * this.gridHeight,
                        height: this.gridHeight
                    }
                }

                gridArr.push(gridTemp);
                xAxisArr.push(xAxisTemp);
                yAxisArr.push(yAxisTemp);
                seriesArr.push(seriesTemp);
                index++;
            }

            dataZoomTop = this.baseTop + this.gridHeight * (index - 1) + 30;

            this.optionArr = {
                grid: gridArr,
                xAxis: xAxisArr,
                yAxis: yAxisArr,
                series: seriesArr,
                dataZoom: [{
                    type: 'slider',
                    top: dataZoomTop,
                    xAxisIndex: dataZoomIndexArr
                }, {
                    type: 'inside',
                    xAxisIndex: dataZoomIndexArr
                }]
            }

        },

        setOption: function() {

            this.makeOption();

            var arr = this.yAxisArr;

            var option = {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: '#fff',
                    borderColor: 'rgba(0, 0, 200, 0.2)',
                    borderWidth: 1,
                    borderRadius: 0,
                    padding: 10,
                    formatter: function(params) {
                        if (params.length) {
                            return echarts.util.map(arr, function(seriesName) {
                                for (var i = 0; i < params.length; i++) {
                                    var param = params[i];
                                    var style = 'color: ' + param.color;
                                    if (param.seriesName === seriesName) {
                                        return '<span style="' + style + '">' + param.seriesName + '：</span><span style="' + style + '">' + param.value + '</span>';
                                    }
                                }
                            }).join('<br>');
                        }
                    }
                },
                title: {
                    text: this.title,
                    left: 'center'
                },
                axisPointer: {
                    link: [{
                        xAxisIndex: 'all'
                    }],
                    snap: true
                },
                grid: this.optionArr.grid,
                xAxis: this.optionArr.xAxis,
                yAxis: this.optionArr.yAxis,
                dataZoom: this.optionArr.dataZoom,
                series: this.optionArr.series
            };

            this.elem.setOption(option);
        }
    }

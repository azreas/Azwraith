/**
 * Created by HC on 2016/4/13.
 */
(function(){

    $('.nav-menu li').eq(1).addClass('item-click');

    $('.baseInfo a').click(function(){
        $(this).addClass('btn-prim').siblings().removeClass('btn-prim');
        var index_a = $(this).index();
        $('#detail-content-box>div').eq(index_a).show().siblings().hide();
    });

    $(document).on('click','.event-sign',function(){
        if(!$(this).hasClass('live')){
            $(this).addClass('live');
            $(this).parent().siblings('.time-line-message').slideDown();
        }else{
            $(this).removeClass('live');
            $(this).parent().siblings('.time-line-message').slideUp();
        }
    });
    $(document).on('click','.event-title',function(){

        if(!$(this).hasClass('live')){
            $(this).addClass('live').find('.event-sign').addClass('live');

            $(this).find('.time-line-message').slideDown('fast');
        }else{
            $(this).removeClass('live').find('.event-sign').removeClass('live');
            $(this).find('.time-line-message').slideUp('fast');
        }
        return false;
    });


    var containerid = $("#containerID").val();
    var containername = $("#master").val();

    //console.log(containerid);

    //添加实例实时监控，日志
    $('.MONITOR,.LOG').click(function(){
        //连接websocket后端服务器
        var socket = io.connect('ws://'+window.location.host);

        $("#podLogs").text('');
        // 监听服务端发来的日志
        socket.on('log', function(data){
            //console.log(data.log);
            if(data.log == ''){
                var dbtr=$('<div style="color: rgba(55, 252, 52, 0.58);"><font style="color: rgba(55, 252, 52, 0.58)">没有日志产生。</font></div>');
                dbtr.appendTo($("#podLogs"));
            }else{
                var dbtr=$('<div style="color: rgba(55, 252, 52, 0.58);"><font style="color: rgba(255, 255, 0, 0.58)">[历史记录]</font><font style="color: rgba(55, 252, 52, 0.58)">'+data.log+'</font></div>');
                dbtr.appendTo($("#podLogs"));
            }
        });

        //highcharts实时动态图
        Highcharts.setOptions({
            global: {
                useUTC: false//是否使用世界标准时间
            }
        });
        var chart;

        //动态更新cpu状态
        $('.charterHoderCpu').highcharts({
            credits: {
                enabled: false // 禁用版权信息
            },
            chart: {
                type: 'spline',
                animation: Highcharts.svg,
                marginRight: 10,
                events: {
                    load: function() {
                        var series = this.series[0];

                        socket.on('monitor', function(data){
                            //console.log("cpu ---> "+data.cpu);
                            //console.log("memory ---> "+data.memory);
                            //console.log("netRx ---> "+data.netRx);
                            //console.log("netTx ---> "+data.netTx);
                            var x = (new Date()).getTime();
                            var y = data.cpu;
                            series.addPoint([x, y], true, true);    //生成实时点
                        });
                    }
                }
            },
            title: {
                text: null,
                x: -20 //center
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 100
            },
            yAxis: {
                title: {
                    text: null
                },
                min: 0,  //Y轴最小值
                minRange: 50,
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            //图例属性
            legend: {
                layout: 'vertical',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0
            },
            exporting: {
                enabled: false
            },
            lang: {
                noData: "No Data"
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: '#303030'
                }
            },
            series: [{
                name: containername,
                color: "#3BBFEA",
                marker: {
                    enabled: false  // 显不显示线小圆点儿
                },
                data: (function() { //初始化
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time,
                            y: 0
                        });
                    }
                    return data;
                })()
            }]
        });

        //动态更新memory状态
        $('.charterHoderMemory').highcharts({
            credits: {
                enabled: false // 禁用版权信息
            },
            chart: {
                type: 'spline',
                animation: Highcharts.svg,
                marginRight: 10,
                events: {
                    load: function() {
                        var series = this.series[0];

                        socket.on('monitor', function(data){
                            //console.log("cpu ---> "+data.cpu);
                            //console.log("memory ---> "+data.memory);
                            //console.log("netRx ---> "+data.netRx);
                            //console.log("netTx ---> "+data.netTx);
                            var x = (new Date()).getTime();
                            var y = data.memory;
                            series.addPoint([x, y], true, true);    //生成实时点
                        });
                    }
                }
            },
            title: {
                text: null,
                x: -20 //center
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 100
            },
            yAxis: {
                title: {
                    text: null
                },
                minRange: 20,
                min: 0,  //Y轴最小值
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            //图例属性
            legend: {
                layout: 'vertical',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0
            },
            exporting: {
                enabled: false
            },
            lang: {
                noData: "No Data"
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: '#303030'
                }
            },
            series: [{
                name: containername,
                color: "#587CA0",
                marker: {
                    enabled: false  // 显不显示线小圆点儿
                },
                data: (function() { //初始化
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time,
                            y: 0
                        });
                    }
                    return data;
                })()
            }]
        });

        //动态更新NetworkIn状态
        $('.charterHoderNetworkIn').highcharts({
            credits: {
                enabled: false // 禁用版权信息
            },
            chart: {
                type: 'spline',
                animation: Highcharts.svg,
                marginRight: 10,
                events: {
                    load: function() {
                        var series = this.series[0];

                        socket.on('monitor', function(data){
                            //console.log("cpu ---> "+data.cpu);
                            //console.log("memory ---> "+data.memory);
                            console.log("netRx ---> "+data.netRx);
                            //console.log("netTx ---> "+data.netTx);
                            var x = (new Date()).getTime();
                            var y = data.netRx;
                            series.addPoint([x, y], true, true);    //生成实时点
                        });
                    }
                }
            },
            title: {
                text: null,
                x: -20 //center
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 100
            },
            yAxis: {
                title: {
                    text: null
                },
                minRange: 20,
                min: 0,  //Y轴最小值
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            //图例属性
            legend: {
                layout: 'vertical',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0
            },
            exporting: {
                enabled: false
            },
            lang: {
                noData: "No Data"
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: '#303030'
                }
            },
            series: [{
                name: containername,
                color: "#F7A400",
                marker: {
                    enabled: false  // 显不显示线小圆点儿
                },
                data: (function() { //初始化
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time,
                            y: 0
                        });
                    }
                    return data;
                })()
            }]
        });

        //动态更新NetworkOut状态
        $('.charterHoderNetworkOut').highcharts({
            credits: {
                enabled: false // 禁用版权信息
            },
            chart: {
                type: 'spline',
                animation: Highcharts.svg,
                marginRight: 10,
                events: {
                    load: function() {
                        var series = this.series[0];

                        socket.on('monitor', function(data){
                            //console.log("cpu ---> "+data.cpu);
                            //console.log("memory ---> "+data.memory);
                            //console.log("netRx ---> "+data.netRx);
                            //console.log("netTx ---> "+data.netTx);
                            var x = (new Date()).getTime();
                            var y = data.netTx;
                            series.addPoint([x, y], true, true);    //生成实时点
                        });
                    }
                }
            },
            title: {
                text: null,
                x: -20 //center
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 100
            },
            yAxis: {
                title: {
                    text: null
                },
                minRange: 20,
                min: 0,  //Y轴最小值
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            //图例属性
            legend: {
                layout: 'vertical',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0
            },
            exporting: {
                enabled: false
            },
            lang: {
                noData: "No Data"
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: '#303030'
                }
            },
            series: [{
                name: containername,
                color: "#42C043",
                marker: {
                    enabled: false  // 显不显示线小圆点儿
                },
                data: (function() { //初始化
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time,
                            y: 0
                        });
                    }
                    return data;
                })()
            }]
        });

        // 根据容器实例id获取监控
        socket.emit('getMonitorByInstanceId', containerid);

        // 根据容器实例id获取日志
        socket.emit('getLogByInstanceId', containerid);
    });




})();
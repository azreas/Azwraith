/**
 * 实时日志 socket
 * Created by lingyuwang on 2016/4/17.
 */

var http = require('http');
var uuid = require('node-uuid');
var dockerConfig = require("../settings").dockerConfig;

// docker 连接响应对象 map
var logDockerRes = {};

/**
 * 创建 日志 socket
 * @param server 服务对象
 */
exports.createLogSocket = function(server) {
    var io = require('socket.io')(server);
    io.on('connection', function(socket){
        socket.name = uuid.v4();

        // 监听实时监控事件
        socket.on('getMonitorByInstanceId',function(instanceId){
            var headers = {
                'Content-Type' : 'application/plain; charset=utf-8'
            };
            var options = {
                host : dockerConfig.host,
                port : dockerConfig.port,
                path : '/containers/'+instanceId+'/stats?stream=1',
                method : 'GET',
                headers : headers
            }
            var monitorData = null;
            var dataJson = null;
            var reqGet = http.request(options, function(resGet) {
                if (socket.name in logDockerRes) {
                    logDockerRes[socket.name]["monitor"] = resGet; // docker 连接
                } else {
                    logDockerRes[socket.name] = {
                        monitor : resGet
                    };
                }
                resGet.on('data', function(data) {
                    try {
                        console.log(data.toString());

                        dataJson = JSON.parse(data.toString());
                        monitorData = {
                            cpu : dataJson.cpu_stats.cpu_usage.total_usage,
                            memory : dataJson.memory_stats.usage,
                            netRx : dataJson.networks.eth0.rx_bytes,
                            netTx : dataJson.networks.eth0.tx_bytes
                        };
                        //console.log(JSON.stringify(monitorData));

                        // 向指定页面发监控数据
                        socket.emit("monitor", monitorData);
                    } catch (e) {
                        console.log(e);
                    }
                });
                resGet.on('end', function() {
                    resGet.destroy(); // 断开 docker 连接
                });
            });
            reqGet.end();
            reqGet.on('error', function(e) {
                console.error(e);
            });
        });

        // 监听获取日志事件
        socket.on('getLogByInstanceId',function(instanceId){
            var headers = {
                'Content-Type' : 'application/plain; charset=utf-8'
            };
            var options = {
                host : dockerConfig.host,
                port : dockerConfig.port,
                path : '/containers/'+instanceId+'/logs?stderr=1&stdout=1&follow=1',
                method : 'GET',
                headers : headers
            }
            var reqGet = http.request(options, function(resGet) {
                if (socket.name in logDockerRes) {
                    logDockerRes[socket.name]["log"] = resGet; // docker 连接
                } else {
                    logDockerRes[socket.name] = {
                        log : resGet
                    };
                }
                resGet.on('data', function(data) {
                    try {
                        //console.log(data.toString());
                        // 向指定页面发日志
                        socket.emit("log", {log : data.toString()});
                    } catch (e) {
                        console.log(e);
                    }
                });
                resGet.on('end', function() {
                    resGet.destroy(); // 断开 docker 连接
                });
            });
            reqGet.end();
            reqGet.on('error', function(e) {
                console.error(e);
            });
        });

        // 断开 socket 和 docker 连接事件
        socket.on("disconnect", function(){
            try {
                console.log("disconnnect ---> "+socket.name);
                logDockerRes[socket.name]["log"].destroy(); // 断开 docker 连接
                logDockerRes[socket.name]["monitor"].destroy(); // 断开 docker 连接
            } catch(e) {
                console.log("disconnect error："+e);
            } finally {
                delete logDockerRes[socket.name]; // 删除存入的信息
            }
        });
    });
}



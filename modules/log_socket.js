/**
 * 实时日志 socket
 * Created by lingyuwang on 2016/4/17.
 */

var http = require('http');
var uuid = require('node-uuid');
var dockerConfig = require("../../settings").dockerConfig;

// docker 连接响应对象 map
var logDockerRes = {};

/**
 * 创建 日志 socket
 * @param server 服务对象
 */
exports.createLogSocket = function(server) {
    var io = require('socket.io')(server);
    io.on('connection', function(socket){
        // 监听获取日志事件
        socket.on('getLogByInstanceId',function(instanceId){
            socket.name = uuid.v4();
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
                logDockerRes[socket.name] = resGet; // docker 连接
                resGet.on('data', function(data) {
                    console.log(data.toString());
                    // 向指定页面发日志
                    socket.emit("log", {log : data.toString()});
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
                logDockerRes[socket.name].destroy(); // 断开 docker 连接
            } catch(e) {
                console.log("disconnect error："+e);
            } finally {
                delete logDockerRes[socket.name]; // 删除存入的信息
            }
        });
    });
}



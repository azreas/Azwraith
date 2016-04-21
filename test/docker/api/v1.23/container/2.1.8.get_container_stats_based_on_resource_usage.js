/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1

var http = require('http');
// var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;

var containerid='52d724c0ccdf';

var headers = {
    'Content-Type' : 'application/plain; charset=utf-8'
};
var options = {
    host : dockerapitest.host,
    port : dockerapitest.port,
    path : '/containers/'+containerid+'/stats?stream=1',
    method : 'GET',
    headers : headers
}
var reqGet = http.request(options, function(resGet) {
    // logDockerRes[socket.name] = resGet; // docker 连接
    resGet.on('data', function(data) {
        console.log(data.toString());
        // 向指定页面发日志
        // socket.emit("log", {log : data.toString()});
    });
    resGet.on('end', function() {
        resGet.destroy(); // 断开 docker 连接
    });
});
reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});


// var dataLength = 0;
// rest.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/containers/'+containerid+'/stats?stream=1').once('complete', function (result, response) {
//     console.log('j');
// });
//     .on('end', function () {  // done
//         console.log('The length was:', dataLength);
//     });
//     .on('complete', function(result, response) {
//     console.log('co');
// }).on('success',function (data, response) {
//     console.log('su');
//     // console.log(data);
//     console.log(response)
// }).on('fail',function (data, response) {
//     console.log('fa');
// }).on('error',function (err, response) {
//     console.log('er');
// }).on('abort',function () {
//     console.log('ab');
// }).on('timeout',function (ms) {
//     console.log('ti');
// });

// rest.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/containers/'+containerid+'/stats?stream=true').
// var writeStream = fs.createWriteStream(fileName);
// request(url, function(err, res) {
//     writeStream.pipe(res);
//     writeStream.on('end', function() {
//         //res.end({"status":"Completed"});
//     });
// });
// ► Run code snippet
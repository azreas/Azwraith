/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1

var http = require('http');
var dockerapitest=require('../../../../../settings').dockerapitest;

var moment = require('moment');


var qs = require('querystring');

var post_data = {
    a: 123,
    time: new Date().getTime()
};//这是需要提交的数据


var content = qs.stringify(post_data);
var imagename = 'busybox';
var tag = 'latest';
var options = {
    hostname: '192.168.1.241',
    port: 2375,
    path: '/images/create?fromImage=' + imagename + '&tag=' + tag,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

var req = http.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    var layerCount = 0;//记录文件层数
    var pullSuccessCount = 0;
    var id = [];
    res.on('data', function (chunk) {
        chunk = JSON.parse(chunk);
        console.log('================================');
        console.log(moment().format('h:mm:ss'));
        console.log(chunk);
        console.log('================================');
        // console.log(chunk.status);
        //记录文件层数和对应id
        if (chunk.status === 'Pulling fs layer') {
            id[layerCount] = chunk.id;
            layerCount++;

        }

        for (var i = 0; i < layerCount; i++) {
            if (chunk.status === 'Pull complete') {
                if (chunk.id == id[i]) {
                    pullSuccessCount++;
                }
            }
        }


    });

    res.on('end', function () {
        console.log('>>>>>>>>>>>>>>>>end');
        console.log(id);
        console.log(layerCount);
        console.log(pullSuccessCount);
    });

});

req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
});

req.end();

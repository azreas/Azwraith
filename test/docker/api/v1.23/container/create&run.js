/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1

//创建容器
//POST /containers/create
var rest = require('restler');
var moment = require('moment');
var http = require('http');
var dockerapitest = require('../../../../../settings').dockerapitest;
var async = require('async');
var postdata = {
    Image: 'mysql',
    Env: ['MYSQL_ROOT_PASSWORD=test'],
    "HostConfig": {
        "Binds": [
            "/etc/localtime:/etc/localtime:ro"
        ],
        // "Links": ["mysql:mysql"],
        "PublishAllPorts": true,
        "RestartPolicy": {
            "Name": "unless-stopped"
        },
        "MemoryReservation": 1024 * 1024 * 4,
        "NetworkMode": "xzj_net"
        // MYSQL_ROOT_PASSWORD
    }
};
// var contents = qs.stringify(postdata);
var contents = JSON.stringify(postdata);
var agent = http.globalAgent;
var creatOptions = {
    hostname: dockerapitest.host,
    port: dockerapitest.port,
    path: '/containers/create',
    method: 'POST',
    agent: agent,
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': contents.length
    }
};

var creatAndStart = function (callback) {
//创建容器
    var id;
    var time1 = new Date().getTime();
    var req = http.request(creatOptions, function (res) {
        res.setEncoding("utf8");
        if (res.statusCode === 201) {
            res.on("data", function (data) {
                // console.log(data);
                data = JSON.parse(data);
                id = data.Id;
                //启动容器
                var startOptions = {
                    hostname: dockerapitest.host,
                    port: dockerapitest.port,
                    path: '/containers/' + id + '/start',
                    method: 'POST',
                    agent: agent,
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': 0
                    }
                };
                var req2 = http.request(startOptions, function (res) {
                    var time4 = new Date().getTime();
                    res.setEncoding("utf8");
                    if (res.statusCode === 204) {
                        console.log('总响应时间' + (time4 - time1) / 1000);
                        callback(null, '总响应时间' + (time4 - time1) / 1000);
                    } else {
                        callback('启动失败' + res.statusCode);
                    }
                    res.on('data', function (data) {
                        console.log(data);
                    })
                });
                req2.end();
            });
        } else {
            callback('创建失败' + res.statusCode);
        }
    });
    req.write(contents);
    req.end();
};
var conntainerNumber = 1;
async.waterfall([
    function (callback) {
        var createContainerFuns = [];
        for (var i = 0; i < conntainerNumber; i++) {
            createContainerFuns[i] = creatAndStart;
        }
        async.parallel(//调用异步方程组
            createContainerFuns
            , function (err, datas) {
                if (err) {
                    console.log("error ---> " + err);
                    callback(err);
                } else {
                    console.log(datas);
                    callback(null);
                }
            });
    }
], function (err, result) {
    // console.log(errorCreateNumber);
    // console.log(errorStartNumber);
    if (err) {
        console.log(err);
    } else {
        console.log('创建成功');
    }
})


var req = http.request(creatOptions, function (res) {
    res.setEncoding("utf8");
    res.on("data", function (data) {
        console.log('data:  ' + data);
    });
});
req.on("error", function (e) {
    console.log('err:' + e);
});
req.write(contents);
req.end();


rest.postJson('http://' + dockerapitest.host + ':' + dockerapitest.port + '/containers/create', postdata).on('complete', function (data, response) {
    console.log(response.statusCode);
    console.log(data);
    id = data.Id;
    postdata = null;
    rest.postJson('http://' + dockerapitest.host + ':' + dockerapitest.port + '/containers/' + id + '/start', postdata).on('complete', function (data, response) {
        console.log(response.statusCode);
        console.log(data);
    });
});


//返回
// 201
// { Id: '67e1dab39226315f1d3b4a086b664772391c0ae7bd8fc46895321158a77c6b58',
//     Warnings: null }

// 201 – no error
// 404 – no such container
// 406 – impossible to attach (container not running)
// 500 – server error
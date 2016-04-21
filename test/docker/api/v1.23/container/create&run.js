/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1

//创建容器
//POST /containers/create
var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;

var postdata=      {
    Image: 'tomcat',
    // "Labels": {
    //     "interlock.hostname": "test",
    //     "interlock.domain": "local"
    // },
    // "ExposedPorts": {
    //     "8080/tcp": {}
    // },
    "HostConfig": {
        // "PortBindings": { "8080/tcp": [{ "HostPort": "38300" }] },
        "PublishAllPorts": true,
        // "MemorySwap":16*1024*1024,
        // "Memory": 1024*1024*256,
        "MemoryReservation": 1024*1024*4,
        // "CpuShares":2,
        "NetworkMode": "c6db4b630478a7fc748e1e022c73eb2bce32645caa079c8785578cacb6c14d6f"
    }
};
var id;
rest.postJson('http://'+dockerapitest.host+':'+dockerapitest.port+'/containers/create', postdata).on('complete', function(data, response) {
    console.log(response.statusCode );
    console.log(data);
    id=data.Id;
    postdata=null;
    rest.postJson('http://'+dockerapitest.host+':'+dockerapitest.port+'/containers/'+id+'/start', postdata).on('complete', function(data, response) {
        console.log(response.statusCode );
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
/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1

//启动容器
//POST /containers/(id or name)/start
var rest = require('restler');
var dockerapitest = require('../../../../../settings').dockerapitest;
var postdata = {
    "HostConfig": {
        //     "PublishAllPorts": true,
        "NetworkMode": "440ce07ee19a3c15db2820a9a9587d7506fa16b9117b6d74959d95dbe5a94f04"
    }
};
postdata = null;
var id = '58907979ddd19b4f9dbb2ada8e0ae2403febcad63e9b4457154a06837092de42 ';
rest.postJson('http://192.168.1.240:3375/containers/' + id + '/start', null).on('complete', function (data, response) {
    console.log(data);
    console.log(response.statusCode);
});

//

// Status Codes:
//
// 204 – no error
// 304 – container already started
// 404 – no such container
// 500 – server error
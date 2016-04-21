/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1

//启动容器
//POST /containers/(id or name)/start
var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;
var postdata=      {
    "HostConfig": {
    //     "PublishAllPorts": true,
        "NetworkMode": "440ce07ee19a3c15db2820a9a9587d7506fa16b9117b6d74959d95dbe5a94f04"
    }
};
postdata=null;
var id='c355539655b19e1f1765be7aad29911d7fc161242d263d7aabc0b5abd26b570e';
rest.postJson('http://'+dockerapitest.host+':'+dockerapitest.port+'/containers/'+id+'/start', postdata).on('complete', function(data, response) {
    console.log(response.statusCode );
    console.log(data);
});

//

// Status Codes:
//
// 204 – no error
// 304 – container already stopped
// 404 – no such container
// 500 – server error
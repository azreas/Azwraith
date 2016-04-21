/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1

// POST /containers/(id or name)/kill

var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;
// 参数
// t – number of seconds to wait before killing the container
var postdata=      {
};
var id='d4c2abee1c7f1e46c1ea75cc23d1b87c23a6fd5f9661b75a2f66fe480b813f28';
rest.postJson('http://'+dockerapitest.host+':'+dockerapitest.port+'/containers/'+id+'/kill', postdata).on('complete', function(data, response) {
    console.log(response.statusCode );
    console.log(data);
});
//
// 204 – no error
// 404 – no such container
// 500 – server error
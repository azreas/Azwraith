/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1

// POST /containers/(id or name)/stop

var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;
// 参数
// t – number of seconds to wait before killing the container
var postdata=      {
};
var id='85356051abf9551c43eaf0888231fe4edfa65763f18e7e147696416c3e55732f';
rest.postJson('http://'+dockerapitest.host+':'+dockerapitest.port+'/containers/'+id+'/stop', postdata).on('complete', function(data, response) {
    console.log(response.statusCode );
    console.log(data);
});

//
// 204 – no error
// 304 – container already started
// 404 – no such container
// 500 – server error
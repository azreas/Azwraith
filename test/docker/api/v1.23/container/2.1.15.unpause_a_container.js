/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1
// POST /containers/(id or name)/unpause
var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;
var postdata= null;
var containerid='78c586174cd13f05e851dadab4c9fa72a4605c55815fbd7d77b14b58c7540a6f';
rest.postJson('http://'+dockerapitest.host+':'+dockerapitest.port+'/containers/'+containerid+'/unpause', postdata).on('complete', function(data, response) {
    console.log(response.statusCode );
    console.log(data);
});
//
// 204 – no error
// 404 – no such container
// 500 – server error
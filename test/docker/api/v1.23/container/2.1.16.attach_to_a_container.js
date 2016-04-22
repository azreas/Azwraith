/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1

// POST /containers/(id or name)/attach

// 参数
// detachKeys – Override the key sequence for detaching a container. Format is a single character [a-Z] or ctrl-<value> where <value> is one of: a-z, @, ^, [, , or _.
// logs – 1/True/true or 0/False/false, return logs. Default false.
// stream – 1/True/true or 0/False/false, return stream. Default false.
// stdin – 1/True/true or 0/False/false, if stream=true, attach to stdin. Default false.
// stdout – 1/True/true or 0/False/false, if logs=true, return stdout log, if stream=true, attach to stdout. Default false.
// stderr – 1/True/true or 0/False/false, if logs=true, return stderr log, if stream=true, attach to stderr. Default false.
var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;
var postdata= null;
var containerid='78c586174cd13f05e851dadab4c9fa72a4605c55815fbd7d77b14b58c7540a6f';
rest.postJson('http://'+dockerapitest.host+':'+dockerapitest.port+'/containers/'+containerid+'/attach?stdout=1', postdata).on('complete', function(data, response) {
    console.log(response.statusCode );
    console.log(data);
});
//
// 101 – no error, hints proxy about hijacking
// 200 – no error, no upgrade header found
// 400 – bad parameter
// 404 – no such container
// 500 – server error
/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1
// GET /containers/(id or name)/attach/ws
var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;
var io = require('socket.io');
// 参数
//     detachKeys – Override the key sequence for detaching a container. Format is a single character [a-Z] or ctrl-<value> where <value> is one of: a-z, @, ^, [, , or _.
//     logs – 1/True/true or 0/False/false, return logs. Default false.
//     stream – 1/True/true or 0/False/false, return stream. Default false.
//     stdin – 1/True/true or 0/False/false, if stream=true, attach to stdin. Default false.
//     stdout – 1/True/true or 0/False/false, if logs=true, return stdout log, if stream=true, attach to stdout. Default false.
//     stderr – 1/True/true or 0/False/false, if logs=true, return stderr log, if stream=true, attach to stderr. Default false.
var containerid='515d987db13e053ab17c75d78d303575504c589e6976005acecb62be3ad14a57';
rest.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/containers/'+containerid+'/attach/ws?&stream=1').on('complete', function(result) {
    if (result instanceof Error) {
        console.log('Error:', result.message);
        this.retry(5000); // try again after 5 sec
    } else {
        console.log(result);
        console.log(JSON.stringify(result));
    }
});
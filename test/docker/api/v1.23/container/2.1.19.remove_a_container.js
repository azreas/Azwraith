/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1
// DELETE /containers/(id or name)
var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;
var containerid='cec7649710299031ef4b5f8a78dc0c0f0d55fc8eb6debc52e1de0b1cb4983a57';
// 参数
// v – 1/True/true or 0/False/false, Remove the volumes associated to the container. Default false.
// force - 1/True/true or 0/False/false, Kill then remove the container. Default false.

rest.del('http://'+dockerapitest.host+':'+dockerapitest.port+'/containers/'+containerid+'?v=1&force=1').on('complete', function(result,response) {
    console.log(response.statusCode );
    console.log(response.statusMessage );
    console.log('http://'+dockerapitest.host+':'+dockerapitest.port+'/containers/'+containerid+'v=1&force=1' );
    if(response.statusCode==204){
        console.log('success');
    }
});


// 204 – no error
// 400 – bad parameter
// 404 – no such container
// 500 – server error
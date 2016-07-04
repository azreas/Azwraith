/**
 * Created by feidD on 2016/4/18.
 */
var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;

//POST /auth
var postdata={
    "username": "hannibal",
    "password": "xxxx",
    "serveraddress": "https://index.docker.io/v1/"
};
rest.postJson('http://192.168.1.243:3375'+'/containers/create', postdata).on('complete', function(data, response) {
    var time2=new Date().getTime();
    console.log(time2-time1);
    console.log(response.statusCode);
    //console.log(response);
    console.log(data);
});
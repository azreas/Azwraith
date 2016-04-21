/**
 *
 *
 * Created by feidD on 2016/4/18.
 */
// Query Parameters:
//
//     force – 1/True/true or 0/False/false, default false
//     noprune – 1/True/true or 0/False/false, default false
// Status Codes:
//
//     200 – no error
// 404 – no such image
// 409 – conflict
// 500 – server error
//TODO 1

var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;


rest.del('http://'+dockerapitest.host+':'+dockerapitest.port+'/images/alexwhen/docker-2048:latest').on('complete', function(result) {
    if (result instanceof Error) {
        console.log('Error:', result.message);
        // this.retry(5000); // try again after 5 sec
    } else {
        console.log(result);
    }
});

//no such image
rest.del('http://'+dockerapitest.host+':'+dockerapitest.port+'/images/aaaalexwhen/docker-2048:latest').on('complete', function(result) {
    if (result instanceof Error) {
        console.log('Error:', result.message);
        // this.retry(5000); // try again after 5 sec
    } else {
        console.log(result);
    }
});
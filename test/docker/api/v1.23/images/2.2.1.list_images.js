/**
 * GET /images/json
 *
 * all(1/True/true or 0/False/false, default false).是否显示所有
 * filter
 * Created by feidD on 2016/4/18.
 */
//TODO 1

var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;

// rest.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/images/json').on('complete', function(result) {
//     if (result instanceof Error) {
//         console.log('Error:', result.message);
//         // this.retry(5000); // try again after 5 sec
//     } else {
//         console.log(result);
//     }
// });

// GET /images/json?all=0 HTTP/1.1
// rest.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/images/json?all=0').on('complete', function(result) {
//     if (result instanceof Error) {
//         console.log('Error:', result.message);
//         // this.retry(5000); // try again after 5 sec
//     } else {
//         console.log(result);
//     }
// });

// GET /images/json?all=1 HTTP/1.1
rest.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/images/json?all=1').on('complete', function(result) {
    if (result instanceof Error) {
        console.log('Error:', result.message);
        // this.retry(5000); // try again after 5 sec
    } else {
        console.log(result);
    }
});
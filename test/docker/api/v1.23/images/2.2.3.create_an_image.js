/**
 * POST /images/create
 *
 * Created by feidD on 2016/4/18.
 */
//TODO 1

var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;

rest.post('http://'+dockerapitest.host+':'+dockerapitest.port+'/images/create?fromImage=alexwhen/docker-2048:latest', {

}).on('success', function(data, response) {
    // if (response.statusCode == 201) {
    //     // you can get at the raw response like this...
    // }
    console.log(response);
});

// rest.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/images/create?fromImage=alexwhen/docker-2048:latest').on('complete', function(result) {
//     if (result instanceof Error) {
//         console.log('Error:', result.message);
//         // this.retry(5000); // try again after 5 sec
//     } else {
//         console.log(result);
//     }
// });
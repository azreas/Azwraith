/**
 * Created by feidD on 2016/4/18.
 */
//TODO 2
// POST /images/(name)/tag
var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;

rest.post('http://'+dockerapitest.host+':'+dockerapitest.port+'/images/test/tag?repo=1024&force=0', {

}).on('success', function(data, response) {
    // if (response.statusCode == 201) {
    //     // you can get at the raw response like this...
    // }
    console.log(response);
    console.log(data);
});
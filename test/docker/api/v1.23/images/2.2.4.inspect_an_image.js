/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1
// GET /images/(name)/json

var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;


var imagesName='hello-world';

rest.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/images/'+imagesName+'/json').on('complete', function(result,response) {
    if (result instanceof Error) {
        console.log('Error:', result.message);
        this.retry(5000); // try again after 5 sec
    } else {
        console.log(response.statusCode);
        console.log(result);
    }
});
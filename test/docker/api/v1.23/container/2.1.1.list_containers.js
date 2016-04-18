/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1
var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;

rest.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/containers/json').on('complete', function(result) {
    if (result instanceof Error) {
        console.log('Error:', result.message);
        this.retry(5000); // try again after 5 sec
    } else {
        console.log(result);
    }
});
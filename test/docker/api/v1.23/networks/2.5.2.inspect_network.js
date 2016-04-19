/**
 * Created by feidD on 2016/4/18.
 */
// GET /networks/<network-id>

var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;

var networkid='db168fc4a4f11ed61de5cd5b2da9262fb2632a62711d08240c4fc3b78e77975d';
rest.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/networks/'+networkid).on('complete', function(result) {
    if (result instanceof Error) {
        console.log('Error:', result.message);
        this.retry(5000); // try again after 5 sec
    } else {
        console.log(result);
    }
});

// 200 - no error
// 404 - network not found
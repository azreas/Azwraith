/**
 * Created by feidD on 2016/4/18.
 */
// GET /networks/<network-id>

var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;

var networkid='9774671eb4edf3938115b3d0ce094136bc8d8da83f945e07a792c2690742a5ca';
rest.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/networks/'+networkid).on('complete', function(result) {
    if (result instanceof Error) {
        console.log('Error:', result.message);
        this.retry(5000); // try again after 5 sec
    } else {
        console.log(result);
        console.log(JSON.stringify(result));
    }
});

// 200 - no error
// 404 - network not found
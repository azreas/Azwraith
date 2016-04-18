/**
 * Created by feidD on 2016/4/18.
 */
var rest = require('restler');

rest.get('http://192.168.1.238:2375/containers/json').on('complete', function(result) {
    if (result instanceof Error) {
        console.log('Error:', result.message);
        this.retry(5000); // try again after 5 sec
    } else {
        console.log(result);
    }
});
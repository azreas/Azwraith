/**
 * Created by feidD on 2016/4/18.
 */
// DELETE /networks/(id)

var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;
var networkid='xzj2';
rest.del('http://'+dockerapitest.host+':'+dockerapitest.port+'/networks/'+networkid).on('complete', function(result,response) {
        console.log(response.statusCode );
});
//
// 204 - no error
// 404 - no such network
// 500 - server error
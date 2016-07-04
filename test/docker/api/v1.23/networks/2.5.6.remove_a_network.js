/**
 * Created by feidD on 2016/4/18.
 */
// DELETE /networks/(id)

var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;
var networkid='3bd19df11874b00abc5b8a60fbd7495f95a66c38768faff457633e90dbee547d';
rest.del('http://'+dockerapitest.host+':'+dockerapitest.port+'/networks/'+networkid+'').on('complete', function(result,response) {
        console.log(response.statusCode );
        console.log(result );
});
//
// 204 - no error
// 404 - no such network
// 500 - server error
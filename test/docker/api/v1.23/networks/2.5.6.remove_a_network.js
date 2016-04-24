/**
 * Created by feidD on 2016/4/18.
 */
// DELETE /networks/(id)

var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;
var networkid='c93a3516c17ca205832ec8d9f4d7954341665b9b66218c3dfd1f0abd2a3aa62e';
rest.del('http://'+dockerapitest.host+':'+dockerapitest.port+'/networks/'+networkid+'').on('complete', function(result,response) {
        console.log(response.statusCode );
});
//
// 204 - no error
// 404 - no such network
// 500 - server error
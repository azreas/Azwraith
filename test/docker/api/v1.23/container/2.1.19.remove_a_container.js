/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1
// DELETE /containers/(id or name)
var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;
var containerid='xzj2';
rest.del('http://'+dockerapitest.host+':'+dockerapitest.port+' /containers/'+containerid).on('complete', function(result,response) {
    console.log(response.statusCode );
});


// 204 – no error
// 400 – bad parameter
// 404 – no such container
// 500 – server error
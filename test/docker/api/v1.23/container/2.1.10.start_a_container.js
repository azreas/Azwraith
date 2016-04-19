/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1

//启动容器
//POST /containers/(id or name)/start
var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;
var postdata=      {
};
var id='4764bb91a896f2401af2832fa2eb5767e7091c7551d60e1d051a0e7827801c66';
rest.postJson('http://'+dockerapitest.host+':'+dockerapitest.port+'/containers/'+id+'/start', postdata).on('complete', function(data, response) {
    console.log(response.statusCode );
    console.log(data);
});
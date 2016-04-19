/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1
var rest = require('restler');
var http=require('http');;
var dockerapitest=require('../../../../../settings').dockerapitest;

//GET /containers/(id or name)/stats
//参数
//stream – 1/True/true or 0/False/false, pull stats once then disconnect. Default true.

var name='hopeful_meitner';

http.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/containers/'+name+'/stats', function(res) {
    res.setEncoding('utf8');
    res.on('data', function (data) {
        console.log(data);
    });
});
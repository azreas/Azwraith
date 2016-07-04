/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1
var rest = require('restler');
var http=require('http');;
var dockerapitest=require('../../../../../settings').dockerapitest;
//GET /containers/(id or name)/logs
//参数
// follow – 1/True/true or 0/False/false, 是否以流的形式返回. 默认false
// stdout – 1/True/true or 0/False/false, show stdout log. 默认false
// stderr – 1/True/true or 0/False/false, show stderr log. 默认false
// since – UNIX timestamp (integer) to filter logs. Specifying a timestamp will only output log-entries since that timestamp. Default: 0 (unfiltered)
// timestamps – 1/True/true or 0/False/false, 每个日志行打印时间戳。默认false。
// tail –  all or <number>  输出指定行数的日志，默认所有.

var name='zdiscovery';

// http.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/containers/'+name+'/logs?stderr=1&stdout=1&follow=1&tail=10', function(res) {
//     res.setEncoding('utf8');
//     res.on('data', function (data) {
//         console.log(data);
//     });
// });

rest.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/containers/'+name+'/logs?stderr=1&stdout=1&follow=1&tail=10').on('success', function(data, response) {
    // if (response.statusCode == 201) {
    //     // you can get at the raw response like this...
    // }
    console.log(response);
    console.log(data);
});
/**
 * Created by feidD on 2016/4/18.
 */

//GET /networks
// 参数
// filters
//     name=<network-name>  匹配指定网络名称
//     id=<network-id> Matches all or part of a network id.
//     type=["custom"|"builtin"] Filters networks by type. The custom keyword returns all user-defined networks.
var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;


var time1=new Date().getMilliseconds();
rest.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/networks').on('complete', function(result,response) {
    if (result instanceof Error) {
        console.log('Error:', result.message);
        this.retry(5000); // try again after 5 sec
    } else {
        var time2=new Date().getMilliseconds();
        console.log(time2-time1);
        console.log(response.statusCode);
        console.log(result);
        // console.log(JSON.stringify(result));

    }
});
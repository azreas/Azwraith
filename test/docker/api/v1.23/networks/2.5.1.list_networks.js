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


rest.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/networks').on('complete', function(result) {
    if (result instanceof Error) {
        console.log('Error:', result.message);
        this.retry(5000); // try again after 5 sec
    } else {
        console.log(result);
        console.log(JSON.stringify(result));

    }
});
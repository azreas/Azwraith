/**
 * List containers
 * GET /containers/json
 * @pram size  1/true or 0/flase    返回 SizeRw,SizeRootFs
 * @parm limit  1/2/3/..   限制返回条数
 * Created by feidD on 2016/4/18.
 */
//TODO 1
var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;


//获取容器列表
//GET /containers/json
//参数
//all       1/True/true or 0/False/false   是否显示所有容器，默认flase，仅显示运行中的
//limit     1/2/3/...  限制返回结果数
//since     容器ID    显示该ID之后创建的所有容器
//before    容器ID    显示该ID之前创建的所有容器
//size      1/True/true or 0/False/false       是否返回 SizeRw,SizeRootFs
//filters   json形式，过滤结果
// {"label":["key1","key2"],"status":["exited"]}
//      exited=<int> 容器以i指定数字退出
//      status=(created|restarting|running|paused|exited|dead)   容器状态
//      label=key or label="key=value"                           容器label
//      isolation=(default|process|hyperv) (Windows daemon only)
//      ancestor=(<image-name>[:<tag>], <image id> or <image@digest>)
//      before=(<container id> or <container name>)
//      since=(<container id> or <container name>)
//      volume=(<volume name> or <mount point destination>)


rest.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/containers/json?limit=1&size=true').on('complete', function(result) {
    if (result instanceof Error) {
        console.log('Error:', result.message);
        this.retry(5000); // try again after 5 sec
    } else {
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        console.log(result);
    }
});

var filter='{"status":["exited"]}'
rest.get('http://192.168.1.238:2375/containers/json?filters='+filter).on('complete', function(data) {
    console.log("55555555555555555555555555555555~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log(data);
    // console.log(data[1]);
});
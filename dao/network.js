/**
 * 调用底层服务 网络 API
 * Created by xzj on 2016/4/26 0026.
 */


var rest = require('restler');
var dockerConfig = require("../settings").dockerConfig;

/**
 * 创建网络
 * @param postdata
 * postdata=     {
                    "Name" : serveConfig.network, // 网络名
                    "Driver" : "overlay",//网络类型
                    "EnableIPv6" : false,
                    "Internal" : false
                };
 * @param callback
 */
exports.creat = function (postdata, callback) {
    rest.postJson('http://'+dockerConfig.host+':'+dockerConfig.port+'/networks/create', postdata).on('complete', function(data, response) {
        try {
            if (response.statusCode != 201) { // 创建网络失败
                throw new Error(data);
            }
        } catch (e) {
            return callback(e);
        }
        return callback(null, data);
    });
};

/**
 * 删除网络
 * @param networkid 网络id
 * @param callback
 */
exports.remove=function(networkid,callback){
    rest.del('http://'+dockerapitest.host+':'+dockerapitest.port+'/networks/'+networkid+'').on('complete', function(result,response) {
        console.log(response.statusCode );
        try{
            if (response.statusCode != 204 ) { // 删除网络失败
                throw new Error(data);
            }
        }catch (e){
            return callback(e);
        }
        return callback(null, data);
    });
}
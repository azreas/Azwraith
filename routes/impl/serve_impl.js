/**
 * 容器服务 路由 实现
 * Created by lingyuwang on 2016/4/19.
 */

var uuid = require('node-uuid');

var httpUtil = require("../../modules/util/httpUtil");

var async = require("async");

var dockerservice = require("../../settings").dockerservice;

/**
 * 创建服务
 * 1.根据 token 获取用户id
 * 2.根据用户 id 获取用户基本信息，再根据邮箱名称和服务名称，生成网络名和子域名
 * 3.保存服务配置信息
 * @param req
 * @param res
 */
exports.create = function (req, res){
    try {
        // 服务配置
        var serveConfig = {
            id : uuid.v4(), // 服务 id
            owner : "", // 用户 id，通过 token 获取
            name : req.body.name, // 服务名称
            image : req.body.image, // 镜像名称
            imagetag : req.body.imagetag, // 镜像版本
            conflevel : req.body.conflevel, // 配置级别
            instance : parseInt(req.body.instance,10), // 实例个数
            expandPattern : req.body.expandPattern, // 拓展方式，1表示自动，2表示手动
            command : req.body.command, // 执行命令
            network : "", // 网络名（email-name+appname）
            subdomain : "", // 子域名（email-name+appname）
            status : 1 // 服务状态，1.启动中，2.运行中，3.停止中，4.已停止,5.启动失败,6.停止失败
        }

        // 多个函数依次执行，且前一个的输出为后一个的输入
        async.waterfall([
            function(callback){ // 根据 token 获取用户id
                httpUtil.get("/v1/auth/"+req.cookies.token, function(tokenResult){
                    try {
                        console.log("token result ---> "+tokenResult);
                        tokenResult = JSON.parse(tokenResult);

                        if (tokenResult.result !== true) {
                            callback(tokenResult.info.script);
                            return;
                        }
                        serveConfig.owner = tokenResult.id;
                        callback(null); // 触发下一步
                    } catch (e) {
                        console.log("根据 "+req.cookies.token+" 获取用户id失败："+e);
                        callback("获取用户信息失败");  // 直接跳到返回结果函数，进行异常处理
                    }
                });
            },function (callback) { // 根据用户 id 获取用户基本信息，再根据邮箱名称和服务名称，生成网络名和子域名
                httpUtil.get("/v1/user/"+serveConfig.owner, function(result){
                    try {
                        console.log("get user result ---> "+result);
                        result = JSON.parse(result);

                        if (result.result !== true) {
                            callback(result.info.script);
                            return;
                        }
                        // 根据邮箱名称和服务名称，生成网络名和子域名
                        var networkAndSubdomain = result.account["email-name"]+serveConfig.name;
                        serveConfig.network = networkAndSubdomain;
                        serveConfig.subdomain = networkAndSubdomain;
                        callback(null); // 触发下一步
                    } catch (e) {
                        console.log("根据用户 "+serveConfig.owner+" 获取用户基本信息失败："+e);
                        callback("根据用户获取用户基本信息失败");  // 直接跳到返回结果函数，进行异常处理
                    }
                });
            },function (callback) { // 保存服务配置信息
                httpUtil.post({host:dockerservice.host, port:dockerservice.port, path:"/v1/app"}, serveConfig, function(appResult){
                    try {
                        console.log("app result ---> "+appResult);
                        appResult = JSON.parse(appResult);
    
                        if (appResult.result !== true) {
                            callback(appResult.info.script);
                            return;
                        }
                        callback(null); // 触发下一步
                    } catch (e) {
                        console.log("保存服务 "+serveConfig.id+" 配置信息失败："+e)
                        callback("保存服务配置信息失败"); // 直接跳到返回结果函数，进行异常处理
                    }
                });
            }
        ],function(err, result) {
            if (err) {
                console.log("保存服务配置失败："+err);
                res.redirect("/test");
            } else {
                console.log("serveConfig ---> "+JSON.stringify(serveConfig));
                res.redirect("/test");
            }
        });
    } catch (e) {
        console.log("保存服务配置失败："+e);
        res.redirect("/test");
    }
}
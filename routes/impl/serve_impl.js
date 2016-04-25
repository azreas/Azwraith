/**
 * 容器服务 路由 实现
 * Created by lingyuwang on 2016/4/19.
 */

var uuid = require('node-uuid');

var httpUtil = require("../../modules/util/httpUtil");

var async = require("async");

var dockerservice = require("../../settings").dockerservice;

var dockerConfig = require("../../settings").dockerConfig;

var rest = require('restler');

/**
 * 创建服务
 * 1.根据 token 获取用户id
 * 2.根据用户 id 获取用户基本信息，再根据邮箱名称和服务名称，生成网络名和子域名
 * 3.根据网络名称生成网络，然后记录网络 id
 * 4.保存服务配置信息
 * 5.存储服务事件（异步，不管成功与否）
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
            imagetag : req.body.imagetag ? req.body.imagetag : "latest", // 镜像版本
            conflevel : req.body.conflevel, // 配置级别
            instance : parseInt(req.body.instance,10), // 实例个数
            expandPattern : 1, // 拓展方式，1表示自动，2表示手动
            command : req.body.command, // 执行命令
            network : "", // 网络名（email-name+appname）
            networkid : "", // 网络 id
            subdomain : "", // 子域名（email-name+appname）
            status : 1, // 服务状态，1.启动中，2.运行中，3.停止中，4.已停止,5.启动失败,6.停止失败
            createtime : new Date().getTime(), // 创建时间
            updatetime : new Date().getTime(), // 更新时间
            address : "-" // 服务地址
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
                        var networkAndSubdomain = result.account.profile.subdomain+"."+serveConfig.name+".app";
                        serveConfig.network = networkAndSubdomain;
                        serveConfig.subdomain = networkAndSubdomain;
                        callback(null); // 触发下一步
                    } catch (e) {
                        console.log("根据用户 "+serveConfig.owner+" 获取用户基本信息失败："+e);
                        callback("根据用户获取用户基本信息失败");  // 直接跳到返回结果函数，进行异常处理
                    }
                });
            },function(callback){ // 根据网络名称生成网络，然后记录网络 id
                var postdata=     {
                    "Name" : serveConfig.network, // 网络名
                    "Driver" : "overlay",
                    "EnableIPv6" : false,
                    "Internal" : false
                };
                rest.postJson('http://'+dockerConfig.host+':'+dockerConfig.port+'/networks/create', postdata).on('complete', function(data, response) {
                    try {
                        if (response.statusCode === 201) { // 创建网络成功
                            console.log("创建网络 "+serveConfig.network+" 返回的数据："+JSON.stringify(data));
                            serveConfig.networkid = data.Id; // 网络 id
                            callback(null); // 触发下一步
                        } else {
                            throw new Error("创建网络 "+serveConfig.network+" 失败："+data);
                        }
                    } catch (e) {
                        callback(e);
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
            },function (callback) { // 存储服务事件（异步，不管成功与否）
                var containerEventConfig = {
                    appid : serveConfig.id,
                    event : "创建成功",
                    titme:new Date().getTime(),
                    script : "create app ："+serveConfig.id
                }
                httpUtil.post({host:dockerservice.host, port:dockerservice.port, path:"/v1/appevent"}, containerEventConfig, function(result){
                    try {
                        console.log("server event result ---> "+result);
                        result = JSON.parse(result);

                        console.log("服务 "+serveConfig.id+" 保存创建事件情况："+result.info.script);
                    } catch (e) {
                        console.log("服务 "+serveConfig.id+" 保存创建事件失败："+e);
                    }
                });
                callback(null); // 触发下一步
            }
        ],function(err, result) {
            if (err) {
                console.log("保存服务配置失败："+err);
                res.status(500);
                res.render('error', {
                    message: err,
                    error: err
                });
            } else {
                console.log("serveConfig ---> "+JSON.stringify(serveConfig));

                // 保存服务配置成功，则发异步请求创建实例
                var hostAndPort = req.headers.host.split(":");
                httpUtil.get({host:hostAndPort[0], port:hostAndPort[1], path:"/container/create/"+serveConfig.id}, function(result){
                    try {
                        console.log("container start result ---> "+result);
                        result = JSON.parse(result);

                        console.log("服务 "+serveConfig.name+" 的实例启动情况："+result.info.script);
                    } catch (e) {
                        console.log("服务 "+serveConfig.name+" 的实例启动失败："+e);
                    }
                });

              res.redirect("/detail/"+serveConfig.id); // 重定向到服务详情页
            }
        });
    } catch (e) {
        console.log("保存服务配置失败："+e);
        res.status(e.status || 500);
        res.render('error', {
            message: e.message,
            error: e
        });
    }
}
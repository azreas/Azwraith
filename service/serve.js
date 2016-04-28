/**
 * 服务业务
 * Created by lingyuwang on 2016/4/26.
 */

var userDao=require('../dao/user');
var networkDao=require('../dao/network');
var serveDao=require('../dao/serve');
var async=require('async');
var moment=require('moment');
var logger = require("../modules/log/log").logger();

/**
 * 创建服务
 * 1.根据 token 获取用户id
 * 2.根据用户 id 获取用户基本信息，再根据邮箱名称和服务名称，生成网络名和子域名
 * 3.根据网络名称生成网络，然后记录网络 id
 * 4.保存服务配置信息
 * 5.存储服务事件（异步，不管成功与否）
 * @param token
 * @param serveConfig 服务配置
 * @param res
 */
exports.create = function (token,serveConfig,callback){
    // 多个函数依次执行，且前一个的输出为后一个的输入
    async.waterfall([
        function (waterfallCallback) {// 根据 token 获取用户id
            userDao.checkLogin(token,function (err,result) {
               try {
                   if (!err) {
                       logger.debug(moment().format('h:mm:ss')+'   获取用户ID');
                       serveConfig.owner = result.id;
                       waterfallCallback(null);//触发下一步
                   } else {
                       logger.info("根据token "+token+" 获取用户id失败："+err);
                       waterfallCallback(err);
                   }
               }catch (e){
                   logger.info("根据token "+token+" 获取用户id失败："+e);
                   waterfallCallback("根据token获取用户id失败");
               }
            });
        },function (waterfallCallback) {// 根据用户 id 获取用户基本信息，再根据邮箱名称和服务名称，生成网络名和子域名
            userDao.get(serveConfig.owner,function(err,result){
                 try {
                     if (!err) {
                         logger.debug(moment().format('h:mm:ss')+'   获取用户基本信息');
                         var networkAndSubdomain = result.account.profile.subdomain + "." + serveConfig.name + ".app";
                         serveConfig.network = networkAndSubdomain;
                         serveConfig.subdomain = networkAndSubdomain;
                         waterfallCallback(null);//触发下一步
                     } else {
                         logger.info("根据id "+serveConfig.owner+" 获取用户基本信息失败："+err);
                         waterfallCallback(err);
                     }
                 }catch(e){
                     logger.info("根据id "+serveConfig.owner+" 获取用户基本信息失败："+e);
                     waterfallCallback("据id获取用户信息失败");
                 }
            });
        },function (waterfallCallback) {// 根据网络名称生成网络，然后记录网络 id
            var postdata=     {
                "Name" : serveConfig.network, // 网络名
                "Driver" : "overlay",
                "EnableIPv6" : false,
                "Internal" : false
            };
            networkDao.creat(postdata,function (err,result) {
                try{
                    if(!err){
                        logger.debug(moment().format('h:mm:ss')+'   创建网络'+ serveConfig.network+'成功');
                        serveConfig.networkid = result.Id;
                        waterfallCallback(null);//触发下一步
                    }else{
                        logger.info('创建网络失败：'+err);
                        waterfallCallback(err);
                    }
                }catch(e){
                    logger.info('创建网络失败：'+e);
                    waterfallCallback('创建网络失败');
                }
            });
        },function (waterfallCallback) { // 保存服务配置信息
            serveDao.save(serveConfig,function (err, result) {
                try {
                    if(!err){
                        logger.debug(moment().format('h:mm:ss')+'   保存服务配置信息');
                        waterfallCallback(null);//触发下一步
                    }else{
                        logger.info('保存服务配置失败:'+err);
                        waterfallCallback(err);
                    }
                }catch (e){
                    logger.info('保存服务配置失败:'+e);
                    waterfallCallback('保存服务配置失败');
                }
            });
        },function (waterfallCallback) {// 存储服务事件
            var containerEventConfig = {
                appid : serveConfig.id,
                event : "创建成功",
                titme:new Date().getTime(),
                script : "create app ："+serveConfig.id
            }
            serveDao.saveEvent(containerEventConfig,function (err, result) {
                try{
                    if(!err){
                        logger.debug(moment().format('h:mm:ss')+'   存储服务事件');
                        waterfallCallback(null);//触发下一步
                    }else{
                        logger.info('存储服务事件失败:'+err);
                        waterfallCallback(err);
                    }
                }catch (e){
                    logger.info('存储服务事件失败:'+e);
                    waterfallCallback('存储服务事件失败');
                }
            });
        }
    ],function (err) {
        if(err){
            logger.info("创建服务失败："+err);
            return callback("创建服务失败："+err);
        }else {
            logger.debug("创建服务成功");
            return callback(null,serveConfig);
        }
    });
}

/**
 * 根据服务id更新实例个数和实例类型
 * @param req
 * @param res
 */
exports.resource = function (resourceParams, res) {
    // 根据服务id获取服务信息
    // 检查实例类型是否有变
    // 若有变，则删掉之前的实例，更新配置（根据服务id，启动新的实例）
    // 若不变，则直接更新配置（根据服务配置，启动新实例——添加实例）

    try{
        async.waterfall([
            
        ],function (err, result) {

        });



    }catch (e){
        logger.info("根据服务 "+req.body.id+" 更新资源失败："+e);
        res.json({
            result: false,
            info: {
                code: "00000",
                script: "根据服务 "+req.body.id+" 更新资源失败"
            }
        });
    }

}


























/**
 * 服务控制层
 * Created by xzj on 2016/4/27 0027.
 */

var serveService=require('../service/serve');
var containerService =require('../service/container');
var uuid = require('node-uuid');
/**
 *
 * @param req
 * @param res
 * @param next
 */
exports.create=function (req, res, next) {
    try{
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
        };
        serveService.create(req.cookies.token,serveConfig,function (err, result) {
            if(!err){// 保存服务配置成功，则发异步请求创建实例
                serveConfig=result;
                console.log('==================================保存服务配置成功==================================');
                containerService.create(serveConfig.id,function (error, data) {
                    if(!error){
                        console.log('==================================实例创建成功==================================');
                    }else{
                        console.log(error);
                    }
                });
                res.redirect("/detail/"+serveConfig.id); // 重定向到服务详情页
            }else {
                next(err);
            }
        });
    }catch (e){
        next(e);
    }
}
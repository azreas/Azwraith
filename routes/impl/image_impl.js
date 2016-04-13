/**
 * 镜像 路由 的 实现
 * Created by lingyuwang on 2016/3/29.
 */

var docker = require("../../modules/docker");

var dockerservice = require("../../settings").dockerservice;

var httpUtil = require("../../modules/util/httpUtil");

/**
 * 获取所有镜像
 * @param req
 * @param res
 */
exports.listAll = function (req, res){
    docker.listImages({all: true}, function (err, images) {
        var result;
        if (!err) {
            result = {
                code : "200",
                msg : "获取所有镜像成功",
                imageList : images
            }
        } else {
            result = {
                code : "500",
                msg : "获取所有镜像失败,"+err
            }
        }
        res.render('test', { title: 'Express' });
    });
}

/**
 * 根据 label 和 kind 获取镜像信息
 * @param req
 * @param res
 */
exports.listByLabelAndKind = function (req, res){
    /*var params = {
        label : req.query.label,
        kind : req.query.kind
    }*/
    var params = {
        label : "normal",
        kind : "dataorcache"
    }
    // 调用底层服务接口
    httpUtil.get({host:dockerservice.host, port:dockerservice.port, path:"/v1/image"}, params, function(result){
        try {
            console.log("listByLabelAndKind result ---> "+result);
            result = JSON.parse(result);
            console.log("listByLabelAndKind result.result ---> "+result.result);

            if (result.result === true) {
                res.json(result);
            } else {
                throw new Error(500);
            }
        } catch (e) {
            console.log(e);
            res.json({
                result: false,
                info: {
                    code: "00000",
                    script: "获取镜像失败"
                }
            });
        }
    });
}

/**
 * 根据镜像名称获取指定镜像
 * @param req
 * @param res
 */
exports.get = function (req, res){
    var image = docker.getImage(request.params.name);
    image.inspect(function(err,data){
        var result;
        if (!err) {
            result = {
                code : "200",
                msg : "获取镜像成功",
                image : data
            }
        } else {
            result = {
                code : "500",
                msg : "获取镜像失败,"+err
            }
        }
        res.render('index', { title: 'Express' });
    });
}
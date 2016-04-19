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

/**
 * 到 docker hub 搜索镜像（返回 json）
 * @param req
 * @param res
 */
exports.search = function (req, res){
    var opts = {
        term: req.params.term
    };
    docker.searchImages(opts,function(err,data){
        try {
            if (err) {
                throw new Error(err);
            }
            console.log("返回的镜像数组："+JSON.stringify(data));
            /*
             参数说明：
             star_count: 星
             is_official: 是否是官方的
             name: 名称
             is_trusted: 是否可信任
             is_automated: 是否是自动化的
             description: 描述信息
             */
            res.json({
                result: true,
                info: {
                    code: "10000",
                    script: "根据 "+req.params.term+" 搜索镜像成功"
                },
                data: data // 镜像数组
            });
        } catch (e) {
            console.log("根据 "+req.params.term+" 搜索镜像失败："+e.message);
            res.json({
                result: false,
                info: {
                    code: "00000",
                    script: "根据 "+req.params.term+" 搜索镜像失败，"+e.message
                }
            });
        }
    });
}
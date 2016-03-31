/**
 * 镜像 路由 的 实现
 * Created by lingyuwang on 2016/3/29.
 */

var docker = require("../../modules/docker");

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
        res.render('index', { title: 'Express' });
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
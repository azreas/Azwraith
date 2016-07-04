/**
 * Created by xzj on 2016/6/24 0024.
 */
'use strict'
var compoSeserver = require('../service/composer');
var logger = require("../modules/log/log").logger();
var async = require('async');

/**
 * 服务编排
 * @param req
 * @param res
 * @param next
 */
function compose(req, res, next) {
    let composeId = req.body.composeId,
        conflevel = req.body.conflevel,
        token = req.cookies.token;
    logger.debug(composeId);
    logger.debug(conflevel);
    if (composeId && conflevel) {
        compoSeserver.serverByComposeId(composeId, conflevel, token, err=> {
            try {
                if (!err) {
                    res.json({
                        result: true,
                        msg: '编排成功'
                    });
                } else {
                    res.json({
                        result: false,
                        msg: err
                    });
                }
            } catch (e) {
                logger.info(e);
                next(e);
            }
        });
    } else {
        res.json({
            result: false,
            msg: '参数错误'
        });
    }

}


function getCompose(req, res, next) {
    compoSeserver.getCompose(req.cookies.token,
        (err, data) => {
            try {
                if (!err) {
                    res.json({
                        result: true,
                        compose: data
                    });
                } else {
                    res.json({
                        result: false,
                        err: err,
                        compose: data
                    });
                }
            } catch (e) {
                next(e);
            }
        });
}

function saveCompose(req, res, next) {
    let composeName = req.body.composeName;
    let composeJson = req.body.composeJson;
    if (composeName && composeJson) {
        compoSeserver.saveCompose(req.cookies.token, composeName, composeJson, (err)=> {
            try {
                if (!err) {
                    res.json({
                        result: true,
                        msg: '保存compose成功'
                    });
                } else {
                    res.json({
                        result: false,
                        msg: err
                    });
                }
            } catch (e) {
                logger.info(e);
                next(e);
            }
        });
    } else {
        res.json({
            result: false,
            msg: '参数错误'
        });
    }
}

function updateCompose() {

}

function deleteCompose() {

}

function composeUp(req, res, next) {

    let serveConfig = {
        id: uuid.v4(), // 服务 id
        owner: "", // 用户 id，通过 token 获取
        name: req.body.name, // 服务名称
        image: req.body.image, // 镜像名称
        imagetag: req.body.imagetag ? req.body.imagetag : "latest", // 镜像版本
        conflevel: req.body.conflevel, // 配置级别
        instance: parseInt(req.body.instance, 10), // 实例个数
        autoscale: req.body.autoscale, // 拓展方式，true表示自动，false表示手动
        command: req.body.command, // 执行命令
        env: env,//环境变量
        network: "", // 网络名（email-name+appname）
        networkid: "", // 网络 id
        subdomain: "", // 子域名（email-name+appname）
        status: 1, // 服务状态，1.启动中，2.运行中，3.停止中，4.已停止,5.启动失败,6.停止失败,7.创建失败
        createtime: new Date().getTime(), // 创建时间
        updatetime: new Date().getTime(), // 更新时间
        address: "-" // 服务地址

    };
}

module.exports = {
    getCompose,
    saveCompose,
    compose
};
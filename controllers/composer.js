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
    let name = req.body.serverName,
        composeJson = req.body.composeJson;
    logger.debug(name);
    logger.debug(composeJson);
    if (name && composeJson) {
        compoSeserver(name, composeJson, err=> {
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

};


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
    let compose = req.body.compose;
    if (composeName && compose) {
        compoSeserver.saveCompose(req.cookies.token, composeName, compose, (err)=> {
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

module.exports = {
    getCompose,
    saveCompose,
    compose
};
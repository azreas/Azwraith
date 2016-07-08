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
function composeStart(req, res, next) {
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

function updateCompose(req, res, next) {
    try {
        let composeName = req.body.composeName,
            composeJson = req.body.composeJson,
            composeId = req.params.id;
        if (composeName && composeJson && composeId) {
            let compose = {composeId, composeName, composeJson};
            compoSeserver.updateComposeById(compose, (err)=> {
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
    } catch (e) {
        logger.info(e);
        next(e);
    }
}

function deleteCompose(req, res, next) {
    let composeId = req.params.composeId;
    try {
        if (composeId) {
            compoSeserver.deleteComposeById(composeId, err=> {
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
    } catch (e) {
        logger.info(e);
        next(e);
    }
}

function getPublicCompose(req, res, next) {
    try {
        compoSeserver.getpublicCompose((err, publicCompose)=> {
            try {
                if (!err) {
                    res.json({
                        result: true,
                        msg: '获取公有编排成功',
                        data: publicCompose
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
        })
    } catch (e) {
        logger.info(e);
        next(e);
    }
}


module.exports = {
    getCompose,
    saveCompose,
    composeStart,
    updateCompose,
    deleteCompose,
    getPublicCompose
};
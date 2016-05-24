/**
 * index controller impl
 * Created by lingyuwang on 2016/3/23.
 */

var mongoPool = require("../../modules/db/mongodb").mongoPool;
var httpUtil = require("../../modules/util/httpUtil");

var logger = require("../../modules/log/log").logger();

/**
 * 进入服务中心界面
 * @param req
 * @param res
 */
exports.center = function(req, res) {
    res.render('servesCenter', { });
};

/**
 * 进入容器服务界面
 * @param req
 * @param res
 */
exports.container = function(req, res) {
    res.render('container', { });
};

/**
 * 进入代码构建界面
 * @param req
 * @param res
 */
exports.build = function(req, res) {
    res.render('build', { });
};

/**
 * 进入代码构建界面
 * @param req
 * @param res
 */
exports.square = function(req, res) {
    res.render('square', { });
};

/**
 * 测试界面
 * @param req
 * @param res
 */
exports.test = function(req, res) {
    logger.info("开始访问测试页");
    res.render('test', { title: '测试' });
};

/**
 * 服务详情界面
 * @param req
 * @param res
 */
exports.detail = function(req,res) {
    res.render('detail',{id : req.params.id})
};

/**
 * 用户详情界面
 * @param req
 * @param res
 */
exports.account = function(req,res) {
    res.render('account',{
        value: req.params.id
    })
};

/**
 * 邮箱验证成功
 * @param req
 * @param res
 */
exports.emailsuccess = function(req,res) {
    res.render('emailSuccess',{ })
};

/**
 * 邮箱验证失败
 * @param req
 * @param res
 */
exports.emailfail = function(req,res) {
    res.render('emailFail',{ })
};

/**
 * 404页面
 * @param req
 * @param res
 */
exports.notfound = function(req,res) {
    res.render('500',{ })
};
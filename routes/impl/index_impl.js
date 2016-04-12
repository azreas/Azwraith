/**
 * index controller impl
 * Created by lingyuwang on 2016/3/23.
 */

var mongoPool = require("../../modules/db/mongodb").mongoPool;
var httpUtil = require("../../modules/util/httpUtil");

/**
 * 进入控制台（服务界面）
 * @param req
 * @param res
 */
exports.console = function(req, res) {
    res.render('console', { title: '控制台' });
};

/**
 * 测试界面
 * @param req
 * @param res
 */
exports.test = function(req, res) {
    res.render('test', { title: '测试' });
};

/**
 * 服务详情界面
 * @param req
 * @param res
 */
exports.detail = function(req,res) {
    res.render('detail',{
        name: 'hello',
        image: 'asdf'
    })
};
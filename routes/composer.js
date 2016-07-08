/**
 * 服务编排路由
 * Created by xzj on 2016/6/28 0028.
 */

var express = require('express');
var router = express.Router();
var composer = require('../controllers/composer');
module.exports = function (app) {

    //根据编排启动服务
    router.post('/create', composer.composeStart);

    //根据用户获取编排列表
    router.get('/list', composer.getCompose);

    //获取公有编排
    router.get('/list', composer.getPublicCompose);

    //保存编排
    router.post('/save', composer.saveCompose);

    //删除编排
    router.route('/:composeId').delete(composer.deleteCompose);

    //修改编排
    router.route('/:composeId').put(composer.updateCompose);

    // router 命名空间
    app.use('/composer', router);
}
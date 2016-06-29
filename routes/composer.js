/**
 * 服务编排路由
 * Created by xzj on 2016/6/28 0028.
 */

var express = require('express');
var router = express.Router();
var composer = require('../controllers/composer');
module.exports = function (app) {

    router.post('/create', composer.compose);

    router.get('/list', composer.getCompose);

    router.post('/save', composer.saveCompose);

    // router 命名空间
    app.use('/composer', router);
}
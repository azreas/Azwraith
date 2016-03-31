/**
 * 用户 路由 的 实现
 * Created by lingyuwang on 2016/3/29.
 */

var httpUtil = require("../../modules/util/httpUtil");

/**
 * 进入注册界面
 * @param req
 * @param res
 */
exports.enterRegist = function (req, res){
    res.render('regist', { title: '注册'});
}

/**
 * 注册
 * @param req
 * @param res
 */
exports.regist = function (req, res){
    var params = {
        account : {
            user : req.body.user
        }
    }
    // 调用底层服务实现 注册
    httpUtil.post("/v1/user", params, function(result){
        console.log("regist result ---> "+result);
        res.render('index', { title: 'Express', result:result });
    });
}

/**
 * 登录
 * @param req
 * @param res
 */
exports.login = function (req, res){
    // 调用底层服务实现 登录
    httpUtil.post("/user/login", req.body.user, function(result){
        console.log("login result ---> "+result);
        res.render('index', { title: 'Express' });
    });
}

/**
 * 根据用户 id 更新用户信息
 * @param req
 * @param res
 */
exports.update = function (req, res){
    // 调用底层服务实现 更新用户信息
    httpUtil.post("/user/update", req.body.user, function(result){
        console.log("update result ---> "+result);
        res.render('index', { title: 'Express' });
    });
}

/**
 * 根据用户 id 查询用户信息
 * @param req
 * @param res
 */
exports.get = function (req, res){
    httpUtil.get("/user/get", req.params.id, function(result){
        console.log("get result ---> "+result);
        res.render('index', { title: 'Express' });
    });
}


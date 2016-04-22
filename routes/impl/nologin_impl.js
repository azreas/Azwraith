/**
 * 开放 的 路由 实现
 * Created by lingyuwang on 2016/4/7.
 */

var httpUtil = require("../../modules/util/httpUtil");

var cookieUtil = require("../../modules/util/cookieUtil");

/**
 * 进入首页
 * @param req
 * @param res
 */
exports.home = function(req, res) {
    res.render('index', { });
};

/**
 * 进入注册界面
 * @param req
 * @param res
 */
exports.enterRegist = function (req, res){
    res.render('regist', { });
};

/**
 * 注册
 * @param req
 * @param res
 */
exports.regist = function (req, res){
    console.log("user regist ...");
    //console.log(req);
    var params = {
        account : {
            email:req.body.email,
            password:req.body.passwd
        }
    };
    console.log("params   "+ params);
    // 调用底层服务实现 注册
    httpUtil.post("/v1/user", params, function(result){
        try {
            console.log("regist result ---> "+result);
            result = JSON.parse(result);
            console.log("regist result.result ---> "+result.result);

            // 注册成功，跳到 登录 页面
            if (result.result === true) {
                res.redirect("/login");
            } else {
                // 注册失败，抛出 500 错误
                throw new Error(500);
            }
        } catch (e) {
            res.status(e.status || 500);
            res.render('error', {
                message: e.message,
                error: e
            });
        }
    });
};

/**
 * 进入登录界面
 * @param req
 * @param res
 */
exports.enterLogin = function (req, res){
    res.render('login', {
        status: ''
    });
};

/**
 * 登录
 * @param req
 * @param res
 */
exports.login = function (req, res){
    console.log("user login ...");
    var params = {
        account : {
            email:req.body.username,
            password:req.body.passwd
        }
    };
    // 调用底层服务实现 登录
    httpUtil.post("/v1/auth", params, function(result){
        try {
            console.log("login result ---> "+result);
            result = JSON.parse(result);
            console.log("login result.result ---> "+result.result);

            // 登录成功，获取token，将其存入cookie，然后跳到 总览 页面
            if (result.result === true) {
                // 根据 token 获取用户id
                httpUtil.get("/v1/auth/"+result.token, function(tokenResult){
                    console.log("token result ---> "+tokenResult);
                    tokenResult = JSON.parse(tokenResult);
                    console.log("token result.result ---> "+tokenResult.result);

                    var uid = tokenResult.id;
                    // 设置 cookie token
                    cookieUtil.set(res, "token", result.token);
                    //TODO
                    // 进入重定向页面
                    res.redirect('servesCenter');
                });
            } else {
                // 登录失败，重定向回 登录页面 带着提示信息和回显信息
                res.render("login",{
                    title: '零云 - 登录',
                    status: result.info.script
                });
            }
        } catch (e) {
            res.status(e.status || 500);
            res.render('error', {
                message: e.message,
                error: e
            });
        }
    });
};

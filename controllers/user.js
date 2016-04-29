/**
 * 用户控制层
 * Created by lingyuwang on 2016/4/28.
 */


var userService = require("../service/user");
var logger = require("../modules/log/log").logger();
var cookieUtil = require("../modules/util/cookieUtil");


/**
 * 根据 token 登出
 * @param req
 * @param res
 */
exports.logout = function (req, res, next){
    try {
        userService.logout(req.cookies.token, function (err, data) {
            try {
                if (err) {
                    throw new Error(err);
                }
                logger.info("用户登出成功，token -> "+req.cookies.token);
                // 删除 cookie 里的 token
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                res.setHeader("Set-Cookie", ['token=0;Expires='+exp.toGMTString()]);
                res.redirect('/login');
            } catch (e) {
                logger.info("根据 token["+req.cookies.token+"] 登出失败");
                logger.error(e);
                next(e);
            }
        });
    } catch (e) {
        logger.error(e);
        next(e);
    }
};


/**
 * 根据用户 id 获取用户基本信息
 * @param req
 * @param res
 */
exports.get = function (req, res){
    try {
        userService.get(req.params.id, function (err, data) {
            try {
                if (err) {
                    throw new Error(err);
                }
                logger.info("获取用户信息成功，返回 "+JSON.stringify(data));
                res.json(data);
            } catch (e) {
                logger.info("根据用户 id["+req.params.id+"] 获取用户信息失败");
                logger.error(e);
                res.json({
                    result: false,
                    info: {
                        code: "00000",
                        script: "获取用户信息失败"
                    }
                });
            }
        });
    } catch (e) {
        logger.error(e);
        res.json({
            result: false,
            info: {
                code: "00000",
                script: "参数有误"
            }
        });
    }
};


/**
 * 注册
 * @param req
 * @param res
 */
exports.regist = function (req, res, next){
    try {
        var user = {
            account : {
                email:req.body.email,
                password:req.body.passwd
            }
        };
        userService.regist(user, function (err, data) {
            try {
                if (err) {
                    throw new Error(err);
                }
                logger.info("用户 ["+user.account.email+"] 注册成功");
                // 注册成功，跳到 登录 页面
                res.redirect("/login");
            } catch (e) {
                logger.info("用户 ["+user.account.email+"] 注册失败");
                logger.error(e);
                // 注册失败，返回 注册页面 带着提示信息和回显信息
                res.render('regist',{
                    status : data.info.script ? data.info.script : "注册失败"
                });
            }
        });
    } catch (e) {
        logger.error(e);
        next(e);
    }
};


/**
 * 登录
 * @param req
 * @param res
 */
exports.login = function (req, res, next){
    try {
        var user = {
            account : {
                email:req.body.username,
                password:req.body.passwd
            }
        };
        userService.login(user, function (err, data) {
            try {
                if (err) {
                    throw new Error(err);
                }
                logger.info("用户 ["+user.account.email+"] 登录成功");
                // 设置 cookie token
                cookieUtil.set(res, "token", data.token);
                // 进入重定向页面
                res.redirect('container');
            } catch (e) {
                logger.info("用户 ["+user.account.email+"] 登录失败");
                logger.error(e);
                // 登录失败，返回 登录页面 带着提示信息和回显信息
                var errorCode = data.info.code;
                if(errorCode == '11001'){
                    res.render("login",{
                        title: '零云 - 登录',
                        status: '当前邮箱未注册,请先注册后登录'
                    });
                }else if(errorCode == '11002'){
                    res.render("login",{
                        title: '零云 - 登录',
                        status: '您输入的密码有误，请重新输入'
                    });
                }else {
                    res.render("login",{
                        title: '零云 - 登录',
                        status: '抱歉，服务器开小差了，请重新登陆'
                    });
                }
            }
        })
    } catch (e) {
        logger.error(e);
        next(e);
    }
};

















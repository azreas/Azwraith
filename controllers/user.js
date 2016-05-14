/**
 * 用户控制层
 * Created by lingyuwang on 2016/4/28.
 */


var userService = require("../service/user");
var logger = require("../modules/log/log").logger();
var cookieUtil = require("../modules/util/cookieUtil");
var async = require('async');

/**
 * 根据 token 登出
 * @param req
 * @param res
 */
exports.logout = function (req, res, next) {
    try {
        userService.logout(req.cookies.token, function (err, data) {
            try {
                if (err) {
                    throw new Error(err);
                }
                logger.info("用户登出成功，token -> " + req.cookies.token);
                // 删除 cookie 里的 token
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                res.setHeader("Set-Cookie", ['token=0;Expires=' + exp.toGMTString()]);
                res.redirect('/login');
            } catch (e) {
                logger.info("根据 token[" + req.cookies.token + "] 登出失败");
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
exports.get = function (req, res) {
    try {
        userService.get(req.cookies.token, function (err, data) {
            try {
                if (err) {
                    throw new Error(err);
                }
                logger.info("获取用户信息成功，返回 " + JSON.stringify(data));
                res.json(data);
            } catch (e) {
                logger.info("根据用户 id[" + req.params.id + "] 获取用户信息失败");
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
exports.regist = function (req, res, next) {
    try {
        var user = {
            account: {
                email: req.body.email,
                password: req.body.passwd
            }
        };
        userService.regist(user, function (err, data) {
            try {
                if (err) {
                    throw new Error(err);
                }
                logger.info("用户 [" + user.account.email + "] 注册成功");
                // 注册成功，跳到 登录 页面
                res.redirect("/login");
            } catch (e) {
                logger.info("用户 [" + user.account.email + "] 注册失败");
                logger.error(e);
                // 注册失败，返回 注册页面 带着提示信息和回显信息
                res.render('regist', {
                    status: data.info.script ? data.info.script : "注册失败"
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
exports.login = function (req, res, next) {
    try {
        var user = {
            account: {
                email: req.body.username,
                password: req.body.passwd
            }
        };
        userService.login(user, function (err, data) {
            try {
                if (err) {
                    throw new Error(err);
                }
                logger.info("用户 [" + user.account.email + "] 登录成功");
                // 设置 cookie token
                cookieUtil.set(res, "token", data.token);
                // 进入重定向页面
                res.redirect('container');
            } catch (e) {
                logger.info("用户 [" + user.account.email + "] 登录失败");
                logger.error(e);
                // 登录失败，返回 登录页面 带着提示信息和回显信息
                var errorCode = data.info.code;
                if (errorCode == '12') {
                    res.render("login", {
                        status: '当前邮箱未注册,请先注册后登录'
                    });
                } else if (errorCode == '13') {
                    res.render("login", {
                        status: '您输入的密码有误，请重新输入'
                    });
                } else {
                    res.render("login", {
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

/**
 * 修改用户信息
 * @param req
 * @param res
 * @param next
 */
exports.changeinfo = function (req, res, next) {
    try {
        var token = req.cookies.token;
        var profile = {
            name: req.body.name,
            sub_domain: req.body.sub_domain
        };
        userService.changeinfo(token, profile, function (err, data) {
            try {
                if (err) {
                    throw new Error(err);
                }
                logger.info("用户修改成功");
            } catch (e) {
                logger.info("用户修改失败");
                logger.error(e);
            }
        })
    } catch (e) {
        logger.error(e);
        next(e);
    }
};

/**
 * 修改密碼
 * @param req
 * @param res
 * @param next
 */
exports.changepassword = function (req, res, next) {
    try {
        var token = req.cookies.token;
        var oldpasswd = req.body.oldpasswd;
        var newpasswd = req.body.newpasswd;
        var putdata = {
            "uid": "",
            "oldpasswd": oldpasswd,
            "newpasswd": newpasswd
        };

        userService.changepassword(token, putdata, function (err, data) {
            try {
                if (err) {
                    throw new Error(err);
                }
                logger.info("用户修改密碼成功");
                // 设置 cookie token
                // cookieUtil.set(res, "token", data.token);
                // 进入重定向页面
                // res.redirect('container');
            } catch (e) {
                logger.info("用户修改密碼失败");
                logger.error(e);
                // 登录失败，返回 登录页面 带着提示信息和回显信息
            }
        })
    } catch (e) {
        logger.error(e);
        next(e);
    }
};

/**
 * 发送邮箱验证连接
 * @param req
 * @param res
 * @param next
 */
exports.mailverify = function (req, res, next) {
    try {
        var postdata = {
            uid: "",
            toEmail: req.body.toEmail
        };
        userService.mailverify(req.cookies.token, postdata, function (err, data) {
            try {
                if (err) {
                    throw new Error(err);
                }
                logger.info("发送邮件成功");
                // 注册成功，跳到 登录 页面
                // res.redirect("/login");
            } catch (e) {
                logger.info("邮件发送失败");
                logger.error(e);
                // 注册失败，返回 注册页面 带着提示信息和回显信息
                res.render('regist', {
                    status: data.info.script ? data.info.script : "邮件发送失败"
                });
            }
        });
    } catch (e) {
        logger.error(e);
        next(e);
    }
};

/**
 * 发送短信验证码
 * @param req
 * @param res
 */
exports.sendSNSverify = function (req, res) {
    try {
        var token = req.cookies.token;
        var tophone = req.body.tophone;
        userService.sendSNSverify(token, tophone, function (err, data) {
            try {
                if (err) {
                    throw new Error(err);
                }
                logger.debug("发送短信验证码成功");
                res.json(data);
            } catch (e) {
                logger.info("发送短信验证码失败");
                logger.error(e);
                res.json({"result": false});
            }
        });
    } catch (e) {
        logger.error(e);
    }
};


/**
 * 验证短信验证码
 * @param req
 * @param res
 * @param next
 */
exports.verifySNS = function (req, res, next) {

    try {
        var token = req.cookies.token;
        var phonecode = req.body.phonecode;
        userService.verifySNS(token, phonecode, function (err, data) {
            if (!err) {
                res.json(data);
            } else {
                logger.error(err);
                res.json({"result": false});
            }

        })
    } catch (e) {
        logger.error(e);
        res.json({"result": false});
    }
}

/**
 * 上传头像
 * @param req
 * @param res
 * @param next
 */
exports.avatarupload = function (req, res, next) {

    try {
        var token = req.cookies.token;
        userService.avatarupload(token, function (err, data) {
            if (!err) {
                res.json(data);
            } else {
                logger.error(err);
                res.json({"result": false});
            }

        })
    } catch (e) {
        logger.error(e);
        res.json({"result": false});
    }
}

exports.getavatar = function (req, res) {
    try {
        userService.getavatar(req.cookies.token, function (err, data) {
            try {
                if (err) {
                    throw new Error(err);
                }
                logger.info("获取用户头像路径成功，返回 " + JSON.stringify(data));
                res.json(data);
            } catch (e) {
                logger.info("根据用户 id[" + req.params.id + "] 获取用户头像路径失败");
                logger.error(e);
                res.json({
                    result: false,
                    info: {
                        code: "00000",
                        script: "获取用户头像路径失败"
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
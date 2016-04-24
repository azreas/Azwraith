/**
 * 鉴权
 * Created by lingyuwang on 2016/3/28.
 */

var httpUtil = require("./util/httpUtil");

module.exports = function(app){
    // 基于 Cookie token 鉴权
    app.use(function(req, res, next) {
        try {
            // 获取 Cookie token
            var token = req.cookies.token;
            console.log("token ---> "+token);
            // 若 token 有效，则调用后台接口验证用户是否已登录
            if (token && token.length>0) {
                httpUtil.get("/v1/auth/"+token, function(tokenResult){
                    try {
                        console.log("authentication token result ---> "+tokenResult);
                        tokenResult = JSON.parse(tokenResult);

                        if (tokenResult.result !== true) {
                            throw new Error("鉴权失败");
                        }
                        next(); // 鉴权成功，则继续
                    } catch (e) {
                        console.log(e);
                        res.redirect("/login"); // 鉴权失败，重定向回登录界面
                    }
                });
            } else {
                res.redirect("/login"); // 鉴权失败，重定向回登录界面
            }
        } catch (e) {
            console.log(e);
            res.redirect("/login"); // 鉴权失败，重定向回登录界面
        }
    });
}
/**
 * 用户 路由 的 实现
 * Created by lingyuwang on 2016/3/29.
 */

var httpUtil = require("../../modules/util/httpUtil");

/**
 * 根据用户 id 更改密码
 * @param req
 * @param res
 */
exports.updatePwd = function (req, res){
    console.log("user updatePwd ...");
    var params = {
        account:{
            password:req.body.passwd,
            newpassword:req.body.newpasswd
        }
    }
    httpUtil.put("/v1/user/"+req.params.id, params, function(result){
        try {
            console.log("updatePwd result ---> "+result);
            result = JSON.parse(result);
            console.log("updatePwd result.result ---> "+result.result);

            res.json(result);
        } catch (e) {
            res.status(e.status || 500);
            res.render('error', {
                message: e.message,
                error: e
            });
        }
    });
}

/**
 * 根据 token 登出
 * @param req
 * @param res
 */
exports.logout = function (req, res){
    console.log("user logout ...");
    httpUtil.delete("/v1/auth/"+req.cookies.token, function(result){
        try {
            console.log("logout result ---> "+result);
            result = JSON.parse(result);
            console.log("logout result.result ---> "+result.result);

            // 若成功，则重定向到登录页面
            if (result.result === true) {
                // 删除 cookie 里的 token
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                res.setHeader("Set-Cookie", ['token=0;Expires='+exp.toGMTString()]);
                res.redirect('/login');
            } else {
                // 失败，则抛出 500 错误
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
}

/**
 * 根据用户 id 更新用户信息
 * @param req
 * @param res
 */
exports.update = function (req, res){
    var params = {
        account:{
            user:{
                name:req.body.name,
                linke:req.body.linke
            }
        }
    }
    httpUtil.put("/v1/user/"+req.params.id, params, function(result){
        try {
            console.log("update result ---> "+result);
            result = JSON.parse(result);
            console.log("update result.result ---> "+result.result);

            res.json(result);
        } catch (e) {
            res.status(e.status || 500);
            res.render('error', {
                message: e.message,
                error: e
            });
        }
    });
}

/**
 * 根据用户 id 获取用户基本信息
 * @param req
 * @param res
 */
exports.get = function (req, res){
    httpUtil.get("/v1/user/"+req.params.id, function(result){
        try {
            console.log("get result ---> "+result);
            result = JSON.parse(result);
            console.log("get result.result ---> "+result.result);
            //TODO
            res.json(result);
        } catch (e) {
            res.status(e.status || 500);
            res.render('error', {
                message: e.message,
                error: e
            });
        }
    });
}

/**
 * 根据用户 id 获取用户所属资源信息
 * @param req
 * @param res
 */
exports.getResource = function (req, res){
    httpUtil.get("/.../"+req.params.id, function(result){
        try {
            console.log("getResource result ---> "+result);
            result = JSON.parse(result);
            console.log("getResource result.result ---> "+result.result);
            //TODO
            res.json(result);
        } catch (e) {
            res.status(e.status || 500);
            res.render('error', {
                message: e.message,
                error: e
            });
        }
    });
}

/**
 * 根据用户 id 获取用户操作日志
 * @param req
 * @param res
 */
exports.getLog = function (req, res){
    httpUtil.get("/.../"+req.params.id, function(result){
        try {
            console.log("getLog result ---> "+result);
            result = JSON.parse(result);
            console.log("getLog result.result ---> "+result.result);
            //TODO
            res.json(result);
        } catch (e) {
            res.status(e.status || 500);
            res.render('error', {
                message: e.message,
                error: e
            });
        }
    });
}



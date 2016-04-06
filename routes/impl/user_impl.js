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
            //if(result.result === true){
            //    res.render('regist', {
            //        title: '恭喜注册成功！'
            //    });
            //}else if(result.result === false){
            //    res.render('regist', {
            //        title: '注册失败！'
            //    });
            //}

            // 注册成功，跳到 登录 页面

            // 注册失败，抛出 500 错误

            res.render('login', { title: '登录' });
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
    res.render('login', { title: '登录'});
}

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
    }
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
                    res.setHeader("Set-Cookie", ['token='+result.token]);
                    //TODO
                    res.redirect('/console/'+uid);
                });
            } else {
                // 登录失败，返回 错误 提示信息
                //TODO
                console.log('123123123');
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
 * 根据用户 id 验证用户是否已登录
 * @param req
 * @param res
 */
exports.checkLogin = function (req, res){
    console.log("user checkLogin ...");
    httpUtil.get("/v1/auth/"+req.params.id, function(result){
        try {
            console.log("checkLogin result ---> "+result);
            result = JSON.parse(result);
            console.log("checkLogin result.result ---> "+result.result);

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

            // 若成功，则重定向到首页
            if (result.result === true) {
                // 删除 cookie 里的 token
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                res.setHeader("Set-Cookie", ['token=0;Expires='+exp.toGMTString()]);
                res.redirect('/');
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



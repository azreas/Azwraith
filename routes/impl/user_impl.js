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
            user : {
                email:req.body.email,
                password:req.body.passwd
            }
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
            res.json(result);
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
            email:req.body.email,
            password:req.body.passwd
        }
    }
    // 调用底层服务实现 登录
    httpUtil.post("/v1/auth", params, function(result){
        try {
            console.log("login result ---> "+result);
            result = JSON.parse(result);
            console.log("login result.result ---> "+result.result);

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
 * 根据用户 id 登出
 * @param req
 * @param res
 */
exports.logout = function (req, res){
    console.log("user logout ...");
    httpUtil.delete("/v1/auth/"+req.params.id, function(result){
        try {
            console.log("logout result ---> "+result);
            result = JSON.parse(result);
            console.log("logout result.result ---> "+result.result);

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
 * 根据用户 id 查询用户信息
 * @param req
 * @param res
 */
exports.get = function (req, res){
    httpUtil.get("/v1/user/"+req.params.id, function(result){
        try {
            console.log("get result ---> "+result);
            result = JSON.parse(result);
            console.log("get result.result ---> "+result.result);

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



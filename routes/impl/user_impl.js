/**
 * 用户 路由 的 实现
 * Created by lingyuwang on 2016/3/29.
 */

var httpUtil = require("../../modules/util/httpUtil");

/**
 * 注册
 * @param request 请求对象
 * @param content 请求内容
 * @param callback 回调函数
 */
exports.regist = function (request, content, callback){
    // 调用底层服务实现 注册
    httpUtil.post("/user/regist", request.body.user, function(result){
        console.log("regist result ---> "+result);
        callback(null, result);
    });
}

/**
 * 登录
 * @param request 请求对象
 * @param content 请求内容
 * @param callback 回调函数
 */
exports.login = function (request, content, callback){
    // 调用底层服务实现 登录
    httpUtil.post("/user/login", request.body.user, function(result){
        console.log("login result ---> "+result);
        callback(null, result);
    });
}

/**
 * 根据用户 id 更新用户信息
 * @param request 请求对象
 * @param content 请求内容
 * @param callback 回调函数
 */
exports.update = function (request, content, callback){
    // 调用底层服务实现 更新用户信息
    httpUtil.post("/user/update", request.body.user, function(result){
        console.log("update result ---> "+result);
        callback(null, result);
    });
}

/**
 * 根据用户 id 查询用户信息
 * @param request 请求对象
 * @param content 请求内容
 * @param callback 回调函数
 */
exports.get = function (request, content, callback){
    httpUtil.get("/user/get", request.params.id, function(result){
        console.log("get result ---> "+result);
        callback(null, result);
    });
}



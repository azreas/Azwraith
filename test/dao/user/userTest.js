/**
 * Created by xzj on 2016/5/11 0011.
 */

var userService = require("../../../dao/user");
var async = require('async');
var user = {
    account: {
        // email: "xzj@163.com",
        // password: "zxc123"
        email: "zerolinke@gmail.com",
        password: "123456"
    }
};
async.waterfall([
    function (waterfallCallback) {//登录获取TOKEN
        userService.login(user, function (err, data) {
            console.log('----------------------------------------------');
            console.log("err ---> " + err);
            console.log(data);
            console.log('----------------------------------------------');
            waterfallCallback(null, data.token);
        });
    }, function (token, waterfallCallback) {//TOKEN获取ID
        userService.getIdByToken(token, function (err, data) {
            console.log('----------------------------------------------');
            console.log("err ---> " + err);
            console.log(data);
            console.log('----------------------------------------------');
            waterfallCallback(null, data.id);
        });
    }, function (id, waterfallCallback) {//ID获取信息
        userService.get(id, function (err, data) {
            console.log('----------------------------------------------');
            console.log("err ---> " + err);
            console.log(data);
            console.log('----------------------------------------------');
            waterfallCallback(null);
        });
    }], function (err, data) {

});
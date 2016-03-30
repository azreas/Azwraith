/**
 * 用户 路由
 * Created by lingyuwang on 2016/3/29.
 */

var user_impl = require('./impl/user_impl');

module.exports = function(rest){
    // 注册
    rest.post( '/user/regist', user_impl.regist);

    // 登录
    rest.post( '/user/login', user_impl.login);

    // 根据用户 id 更新用户信息
    rest.post( '/user/update', user_impl.update);

    // 根据用户 id 查询用户信息
    rest.post( '/user/get/:id', user_impl.get);
};
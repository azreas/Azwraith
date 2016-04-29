/**
 * 根据用户 id 获取用户基本信息
 * Created by lingyuwang on 2016/4/25.
 */

var should = require('should');
var userService = require("../../../service/user");
var userDao = require("../../../dao/user");
var uuid = require('node-uuid');

var id = "";
describe('user', function(){
    before(function(done){ // 数据准备
        var user = {
            account: {
                email:uuid.v4()+"@qq.com",
                password: "123456"
            }
        };
        userDao.insert(user, function (err, data) { // 注册
            userDao.login(user, function (err, data) { // 登录
                userDao.getIdByToken(data.token, function (err, data) { // 根据 token 获取 id
                    id = data.id;
                    done();
                });
            });
        });
    });

    describe('get', function(){
        it('根据用户 id 获取用户基本信息', function(done) {
            userService.get(id, function (err, data) {
                should.not.exist(err);
                should.exist(data);
                done();
            });
        });
    });
});










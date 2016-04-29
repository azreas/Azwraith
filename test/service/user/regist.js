/**
 * 用户注册
 * Created by lingyuwang on 2016/4/28.
 */

var should = require('should');
var uuid = require('node-uuid');
var userService = require("../../../service/user");

describe('user', function(){
    it('用户注册', function(done) {
        var user = {
            account: {
                email:uuid.v4()+"@qq.com",
                password: "123456"
            }
        };
        userService.regist(user, function (err, data) {
            should.not.exist(err);
            should.exist(data);
            done();
        });
    });
});
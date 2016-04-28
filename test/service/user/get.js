/**
 * 根据用户 id 获取用户基本信息
 * Created by lingyuwang on 2016/4/25.
 */

var should = require('should');
var userService = require("../../../service/user");

describe('user', function(){
    it('根据用户 id 获取用户基本信息', function(done) {
        var id = "1d8c3fdf-83c6-40c7-883f-fb590a9c4ad5";
        userService.get(id, function (err, data) {
            should.not.exist(err);
            should.exist(data);
            done();
        });
    });
});











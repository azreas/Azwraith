/**
 * 创建服务测试
 * Created by xzj on 2016/4/29 0029.
 */
var should = require('should');
var serveService = require("../../../service/serve");
var userDao = require("../../../dao/user");
var uuid = require('node-uuid');

var token = "";
var userid = "";
var serveConfig = {
    id: uuid.v4(), // 服务 id
    owner: "", // 用户 id，通过 token 获取
    name: "", // 服务名称
    image: "tomcat", // 镜像名称
    imagetag: "latest", // 镜像版本
    conflevel: "1x", // 配置级别
    instance:  10, // 实例个数
    expandPattern: 1, // 拓展方式，1表示自动，2表示手动
    command: "", // 执行命令
    network: "", // 网络名（email-name+appname）
    networkid: "", // 网络 id
    subdomain: "", // 子域名（email-name+appname）
    status: 1, // 服务状态，1.启动中，2.运行中，3.停止中，4.已停止,5.启动失败,6.停止失败
    createtime: new Date().getTime(), // 创建时间
    updatetime: new Date().getTime(), // 更新时间
    address: "-" // 服务地址
};
describe('user', function () {
    before(function (done) { // 数据准备
        var user = {
            account: {
                email: uuid.v4() + "@qq.com",
                password: "123456"
            }
        };
        userDao.insert(user, function (err, data) { // 注册
            userDao.login(user, function (err, data) { // 登录
                token=data.token;
                userDao.getIdByToken(token, function (err, data) { // 根据 token 获取 id
                    userid = data.id;
                    done();
                });
            });
        });
    });

    describe('get', function () {
        it('根据用户 id 获取用户基本信息', function (done) {
            serveService.create(token,serveConfig,function (err, data) {
                should.not.exist(err);
                should.exist(data);
                done();
            });
        });
    });
});
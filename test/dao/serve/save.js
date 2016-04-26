/**
 * 保存服务配置
 * Created by lingyuwang on 2016/4/25.
 */

var uuid = require('node-uuid');

var serveService = require("../../../dao/serve");

var app = {
    id : uuid.v4(),
    owner : "8d0a99aa-8461-4f39-9259-8034b1d81e77", // 用户 id，通过 token 获取
    name: "lywtomcat1",
    image: "tomcat",
    imagetag: "latest",
    conflevel: "2x",
    instance: 1,
    expandPattern: 1,
    network : "", // 网络名（email-name+appname）
    networkid : "", // 网络 id
    subdomain : "", // 子域名（email-name+appname）
    status : 1, // 服务状态，1.启动中，2.运行中，3.停止中，4.已停止,5.启动失败,6.停止失败
    createtime : new Date().getTime(), // 创建时间
    updatetime : new Date().getTime(), // 更新时间
    address : "-" // 服务地址
};
serveService.save(app, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});



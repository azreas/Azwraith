/**
 * 容器 业务 根据服务 id 获取服务配置信息，并创建容器实例
 * Created by lingyuwang on 2016/4/28.
 */

var containerService = require("../../../service/container");

var appid = "75ad38c0-f286-4638-8adf-f4136e27af1b";
containerService.create(appid, function (err, data) {
    console.log("error ---> "+err);
    console.log(data);
});






/**
 * 根据容器id查询事件信息
 * Created by lingyuwang on 2016/4/25.
 */

var containerService = require("../../../dao/container");

var id = "561cfbfddaf6ed5f65eacd9ad09f3e23803a423bef03716e125ee9e5e313e12e";
containerService.get(id, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});
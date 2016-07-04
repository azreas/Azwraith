/**
 * 根据containerid删除数据库
 * Created by xzj on 2016/5/11 0011.
 */


var containerService = require("../../../dao/container");

var id = "4c62371c8ba987685c3e3ab3139cc7191baffa923352547e8e6277c83fd448df";
containerService.delete(id, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});
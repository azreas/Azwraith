/**
 * 根基containerid读取container详细信息
 * Created by lingyuwang on 2016/4/25.
 */

var containerService = require("../../../dao/container");

var id = "4c62371c8ba987685c3e3ab3139cc7191baffa923352547e8e6277c83fd448df";
containerService.get(id, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});
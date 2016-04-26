/**
 * 更新container信息
 * Created by lingyuwang on 2016/4/25.
 */

var containerService = require("../../../dao/container");

var container = {
    id: "6546a08e9c4dc449f67f56e0fe86d432761da5a95e8a63691c466ffde2aa5c63",
    appid: "7deed1db-7777-4de5-94ef-bf1b4af49eec",
    outaddress: {
        schema: "tcp",
        ip: "192.168.1.244",
        port: "32848"
    },
    inaddress: {
        schema: "tcp",
        ip: "10.0.116.15",
        port: "80"
    },
    name: "2048-uaynr111111",
    status: 4,
    createtime: 1461579403085
};
containerService.update(container, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});
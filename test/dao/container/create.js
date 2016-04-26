/**
 * 根据容器配置创建容器实例
 * Created by lingyuwang on 2016/4/26.
 */

var containerService = require("../../../dao/container");
var dockerConfig = require("../../../settings").dockerConfig;

var containerOpts = {
    Image: 'redis',
    Labels: {
        "interlock.hostname": "atest.2048-a.app",
        "interlock.domain": dockerConfig.domain
    },
    HostConfig: {
        PublishAllPorts: true,
        MemoryReservation: 256,
        NetworkMode: "atest.2048-a.app",
        RestartPolicy: {
            Name: "unless-stopped"
        }
    }
}
containerService.create(containerOpts, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.Id);
});
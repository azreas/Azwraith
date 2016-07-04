/**
 * Created by xzj on 2016/5/31 0031.
 */
var containerDao = require("../../../dao/container");
var containerId = 'e7a08e1f1a67';
var postData = {
    "AttachStdin": true,
    "AttachStdout": true,
    "AttachStderr": true,
    "DetachKeys": "ctrl-p,ctrl-q",
    "Tty": false,
    "Cmd": [
        "/bin/sh"
    ]
};
containerDao.creatExec(containerId, postData, function (err, data) {
    console.log(err);
    console.log(data);
})
/**
 * Created by xzj on 2016/6/14 0014.
 */
var imageDao = require("../../../dao/image");
var commands = [
    "msg:Connected",
    "ls",
    "cd /imageBuild",
    "ls",
    "git clone https://github.com/zerolinke/Azwraith.git myname",
    // "wget https://github.com/zerolinke/Azwraith/archive/master.zip -O Azwraith.zip",
    // "unzip Azwraith.zip",
    // "cd myname",
    // "docker build -t azwraith .",
    // "docker images",
    "ls",
    "msg:Connected closed"
];
imageDao.buildImage(commands, function (err) {
    console.log(err);
});
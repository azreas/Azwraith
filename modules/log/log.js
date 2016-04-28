/**
 * 日志模块，配置日志存储类型
 * Created by lingyuwang on 2016/4/27.
 */

var fs = require('fs');

var path = require('path');

var logs_dir = path.join(__dirname, "../../logs");
// 检查 logs 文件夹是否存在，不存在则自动生成
if (!fs.existsSync(logs_dir)){
    fs.mkdirSync(logs_dir);
}

//module.exports = require("./log_db");
module.exports = require("./log_file");


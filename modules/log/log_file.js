/**
 * 将日志存入文件
 * Created by lingyuwang on 2016/4/27.
 */

var log4js = require("log4js");
var path = require('path');

var logs_dir = path.join(__dirname, "../../logs");

log4js.configure({
    "appenders": [
        {
            "type": "console"
        },
        {
            "type": "dateFile",
            "filename": logs_dir+"/azwraith.log",
            "pattern": "-yyyy-MM-dd",
            "alwaysIncludePattern": true
        }
    ]
});

/**
 * app 配置日志
 * @param app
 */
var loggerlevel = process.env.loggerlevel || 'DEBUG';
exports.config = function(app){
    var logger = log4js.getLogger();
    logger.setLevel(loggerlevel);
    app.use(log4js.connectLogger(logger));
};


/**
 * 暴露到应用的日志接口，调用该方法前必须确保已经configure过
 * @param name 指定log4js配置文件中的category。依此找到对应的appender。
 *              如果appender没有写上category，则为默认的category。可以有多个
 * @returns {Logger}
 */
exports.logger = function(name) {
    var dateFileLog = log4js.getLogger();
    if (name) {
        dateFileLog = log4js.getLogger(name);
    }
    // dateFileLog.setLevel(log4js.levels.ALL);
    return dateFileLog;
}
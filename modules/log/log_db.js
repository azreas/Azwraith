/**
 * 将日志存入数据库
 * Created by lingyuwang on 2016/4/27.
 */

var dataUtil = require("../util/dateUtil");
var mongoPool = require("../db/mongodb").mongoPool;


var category = "default"; // 对应 log4j 的 category
var level = "auto"; // 对应 log4j 的 level


var log4js = require("log4js");
log4js.configure({
    "appenders": [
        {
            "type": "console"
        }
    ]
});


/**
 * 日志对象
 * @param level
 * @param content
 * @returns {{time: string, level: *, content: *}}
 */
var plog = function (level, content) {
    return {
        time : dataUtil.getDateString(new Date()),
        level : level,
        content : content
    }
};

// log4js 用于控制台打印
var logger_log4js = log4js.getLogger();

var logger = {
    debug : function (data) {
        var log = plog("debug", data);
        logger_log4js.debug(data);
    },
    info : function(data) {
        var log = plog("info", data);
        logger_log4js.info(data);
        mongoPool.acquire(function(err, db) {
            if (err) {
                console.log(err);
            } else {
                db.collection(category, function(err, collection) {
                    collection.save(log);
                    mongoPool.release(db); // 释放连接
                });
            }
        });
    },
    warn : function(data) {
        var log = plog("warn", data);
        logger_log4js.warn(data);
    },
    error : function(data) {
        var log = plog("error", data);
        logger_log4js.error(data);
    },
    fatal : function(data) {
        var log = plog("fatal", data);
        logger_log4js.fatal(data);
    }
};

/**
 * app 配置日志
 * @param app
 */
exports.config = function(app){
    level = "info";
    app.use(log4js.connectLogger(log4js.getLogger(), {level:level}));
};

/**
 * 暴露到应用的日志接口，调用该方法前必须确保已经configure过
 * @param name 指定log4js配置文件中的category。依此找到对应的appender。
 *              如果appender没有写上category，则为默认的category。可以有多个
 * @returns {Logger}
 */
exports.logger = function(name) {
    if (name) {
        category = name;
    }
    return logger;
};










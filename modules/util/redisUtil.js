/**
 * 操作 redis 工具类
 * Created by lingyuwang on 2016/3/24.
 */
var redisPool = require("../db/redis").redisPool;

/**
 * 根据 key 获取 value
 * @param key 键
 * @param callback 回调函数
 */
exports.get = function(key, callback) {
    redisPool.acquire(function(err, client) {
        if (err) {
            redisPool.release(client);// 释放连接
            callback(err, null);
        } else {
            client.get(key, function(error, res){
                redisPool.release(client);// 释放连接
                callback(error, res);
            });
        }
    });
}


/**
 * set 字符串
 * @param key 键
 * @param value 值
 * @param expire 过期时间
 */
exports.set = function(key, value, expire) {
    redisPool.acquire(function(err, client) {
        if (err) {
            redisPool.release(client);// 释放连接
        } else {
            client.set(key, value, function(error, res){
                // 过期时间，单位 秒
                if (!isNaN(expire)) {
                    client.expire(key, expire);
                }
                redisPool.release(client);// 释放连接
            });
        }
    });
}


/**
 * 根据 key 获取 对象 value
 * @param key 键
 * @param callback 回调函数
 */
exports.getObject = function(key, callback) {
    redisPool.acquire(function(err, client) {
        if (err) {
            redisPool.release(client);// 释放连接
            callback(err, null);
        } else {
            client.get(key, function(error, res){
                redisPool.release(client);// 释放连接
                res = JSON.parse(res);
                callback(error, res);
            });
        }
    });
}


/**
 * set 对象
 * @param key 键
 * @param value 值
 * @param expire 过期时间
 */
exports.setObject = function(key, value, expire) {
    redisPool.acquire(function(err, client) {
        if (err) {
            redisPool.release(client);// 释放连接
        } else {
            value = JSON.stringify(value);
            client.set(key, value, function(error, res){
                // 过期时间，单位 秒
                if (expire && !isNaN(expire)) {
                    client.expire(key, expire);
                }
                redisPool.release(client);// 释放连接
            });
        }
    });
}


/**
 * 根据 key 获取 数组 value
 * @param key 键
 * @param callback 回调函数
 */
exports.getArray = function(key, callback) {
    this.getObject(key, callback);
}


/**
 * set 数组
 * @param key 键
 * @param value 值
 * @param expire 过期时间
 */
exports.setArray = function(key, value, expire) {
    this.setObject(key, value, expire);
}


/**
 * 删除
 * @param key 键
 */
exports.del = function(key) {
    redisPool.acquire(function(err, client) {
        if (err) {
            redisPool.release(client);// 释放连接
        } else {
            client.del(key);
            redisPool.release(client);// 释放连接
        }
    });
}


/**
 * 根据 正则 获取 key 集合
 * @param pattern 正则表达式
 * @param callback 回调函数
 */
exports.keys = function(pattern, callback) {
    redisPool.acquire(function(err, client) {
        if (err) {
            redisPool.release(client);// 释放连接
            callback(err, null);
        } else {
            client.keys(pattern, function(error, res){
                redisPool.release(client);// 释放连接
                callback(error, res);
            });
        }
    });
}

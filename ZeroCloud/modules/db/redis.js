/**
 * Created by lingyuwang on 2016/3/22.
 */

var redis_setting = require('../../settings').redis;

var Pool = require('generic-pool').Pool;
var pool = new Pool({
    name     : 'redis',
    create   : function(callback) {
        var client = require('redis').createClient(redis_setting.port,redis_setting.host,redis_setting.options);
        callback(null,client);
    },
    destroy  : function(client) { client.end(); },
    max      : 10,
    min      : 2,
    idleTimeoutMillis : 30000,
    log : false
});

exports.redisPool = pool;

/**
 * Created by lingyuwang on 2016/3/22.
 */
var mongodb_setting = require('../../settings').mongodb;

var Pool = require('generic-pool').Pool;
var pool = new Pool({
    name     : 'mongodb',
    create   : function(callback) {
        require('mongodb').MongoClient.connect("mongodb://"+mongodb_setting.host+":"+mongodb_setting.port+"/"+mongodb_setting.dbname, {
            server:{poolSize:1}
        }, function(err,db){
            callback(err,db);
        });
    },
    destroy  : function(db) { db.close(); },
    max      : 10,
    min      : 2,
    idleTimeoutMillis : 30000,
    log : false
});

exports.mongoPool = pool;

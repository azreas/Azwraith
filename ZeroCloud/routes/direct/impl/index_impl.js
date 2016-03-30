/**
 * index controller impl
 * Created by lingyuwang on 2016/3/23.
 */

var mongoPool = require("../../../modules/db/mongodb").mongoPool;
var redisUtil = require("../../../modules/util/redisUtil");
var httpUtil = require("../../../modules/util/httpUtil");

exports.home = function(req, res) {
    // mongodb 查
    /*mongoPool.acquire(function(err, db) {
        if (err) {
            console.log(err);
        } else {
            // mongodb 查
            db.collection("users").find({}, function(err, docs) {
                console.log("db.collection...");
                docs.each(function(err, doc) {
                    if(doc) {
                        console.log(doc);
                    }
                });
                // 释放连接
                mongoPool.release(db);
            });
        }
    });*/

    /*// redis 查
    redisUtil.get('author', function(err, res){
        console.log("get author ---> "+res);
    });*/

    /*// redis set
    redisUtil.set('author', 'cyl');*/
/*
    // redis 查
    redisUtil.getArray('author', function(err, res){
        console.log("get author ---> "+res);
        console.log("get author name ---> "+res[1].name);
    });

    // redis set
    redisUtil.setArray('author', [{name:'cyl',age:'17'},{name:'lyw',age:'24'},{name:'test',age:'100'}], 30);

    // redis 查
    redisUtil.getArray('author', function(err, res){
        console.log("get author ---> "+res);
        console.log("get author name ---> "+res[1].name);
    });

    // 删除
    redisUtil.del('author');

    redisUtil.keys('*', function(err, res){
        console.log("keys ---> "+res);
        console.log("keys[0] ---> "+res[0]);
    });
 */
    /*var reqJosnData = {
        'msg' : 'Hello World!'
    };
    httpUtil.post({path : '/'},reqJosnData, function(result){
        console.log("result ---> "+result);
        res.render('index', { title: result });
    });*/
    /*var reqJosnData = {
        name : 'cyl',
        age : 17
    };
    httpUtil.get({path : '/get'},reqJosnData, function(result){
        console.log("result ---> "+result);
        result = JSON.parse(result);
        console.log("result name ---> "+result.name);
        res.render('index', { title: result.name });
    });*/
    res.render('index', { title: 'Express' });
}
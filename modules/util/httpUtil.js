/**
 * http 请求工具类
 * Created by lingyuwang on 2016/3/24.
 */
var http = require('http');

// 用户底层服务
var userservice = require('../../settings').userservice;

/**
 * 合并对象
 * @param o 第一个对象
 * @param n 第二个对象
 * @param override 若属性相同，是否覆盖第一个对象的属性
 * @returns {*}
 */
var joinObject = function(o,n,override){
    for(var p in n){
        if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override)){
            o[p] = n[p];
        }
    }
    return o;
};

/**
 * 发送 post 请求
 * @param options 路径参数（必需）
 *         options 可以是 String ，表示 path
 *         options 可以是 对象 {host:"host",port:port,path:"path",method:"method"}，对象参数可选
 * @param reqJosnData 请求参数（可选）
 *         reqJosnData 是对象 例：{name:"name"}
 * @param callback 回调函数（必需）
 */
exports.post = function(){
    var options;
    var reqJosnData;
    var callback;
    if (arguments.length==3) {
        // 判断第一个参数类型，若是 string，则表示 path，反之为对象
        if (typeof arguments[0] == "string") {
            options = {
                path : arguments[0]
            }
        } else {
            options = arguments[0];
        }
        reqJosnData = arguments[1];
        callback = arguments[2];
    } else if (arguments.length==2) {
        // 判断第一个参数类型，若是 string，则表示 path，反之为对象
        if (typeof arguments[0] == "string") {
            options = {
                path : arguments[0]
            }
        } else {
            options = arguments[0];
        }
        reqJosnData = {};
        callback = arguments[1];
    } else {
        throw Error("http post request arguments is error");
    }

    reqJosnData = JSON.stringify(reqJosnData);
    var headers = {
        'Content-Type' : 'application/json; charset=UTF-8',
        'Content-Length' : Buffer.byteLength(reqJosnData, 'utf8')
    };
    var preoptions = {
        host : userservice.host,
        port : userservice.port,
        path : '/',
        method : 'POST',
        headers : headers
    };
    // 合并对象
    options = joinObject(options,preoptions);

    var resData = "";
    var reqPost = http.request(options, function(resPost) {
        resPost.on('data', function(data) {
            resData += data;
        });
        resPost.on('end', function() {
            callback(resData);
        });
    });

    // 发送REST请求时传入JSON数据
    reqPost.write(reqJosnData);
    reqPost.end();
    reqPost.on('error', function(e) {
        console.error(e);
    });
}

/**
 * 发送 get 请求
 * @param options 路径参数（必需）
 *         options 可以是 String ，表示 path
 *         options 可以是 对象 {host:"host",port:port,path:"path",method:"method"}，对象参数可选
 * @param reqJosnData 请求参数（可选）
 *         reqJosnData 是对象 例：{name:"name"}
 * @param callback 回调函数（必需）
 */
exports.get = function(){
    var options;
    var reqJosnData;
    var callback;
    if (arguments.length==3) {
        // 判断第一个参数类型，若是 string，则表示 path，反之为对象
        if (typeof arguments[0] == "string") {
            options = {
                path : arguments[0]
            }
        } else {
            options = arguments[0];
        }
        reqJosnData = arguments[1];
        callback = arguments[2];
    } else if (arguments.length==2) {
        // 判断第一个参数类型，若是 string，则表示 path，反之为对象
        if (typeof arguments[0] == "string") {
            options = {
                path : arguments[0]
            }
        } else {
            options = arguments[0];
        }
        reqJosnData = {};
        callback = arguments[1];
    } else {
        throw Error("http get request arguments is error");
    }

    var headers = {
        'Content-Type' : 'application/json; charset=UTF-8'
    };
    var preoptions = {
        host : userservice.host,
        port : userservice.port,
        path : '/',
        method : 'GET',
        headers : headers
    };
    // 合并对象
    options = joinObject(options,preoptions);

    // 拼接请求参数
    var query = "";
    var isFirst = false;
    if (options.path.indexOf("?") == -1) {
        isFirst = true;
        query += "?";
    }
    for(var p in reqJosnData){
        if (isFirst){
            isFirst = false;
        } else {
            query += "&";
        }
        if(reqJosnData[p]) {
            query += p;
            query += "=";
            query += reqJosnData[p];
        }
    }

    // 加上请求参数
    if (query.length>1) {
        options.path += query;
    }

    var resData = "";
    var reqGet = http.request(options, function(resGet) {
        resGet.on('data', function(data) {
            resData += data;
        });
        resGet.on('end', function() {
            callback(resData);
        });
    });

    reqGet.end();
    reqGet.on('error', function(e) {
        console.error(e);
    });
}

/**
 * 发送 put 请求
 * @param options 路径参数（必需）
 *         options 可以是 String ，表示 path
 *         options 可以是 对象 {host:"host",port:port,path:"path",method:"method"}，对象参数可选
 * @param reqJosnData 请求参数（可选）
 *         reqJosnData 是对象 例：{name:"name"}
 * @param callback 回调函数（必需）
 */
exports.put = function(){
    var options;
    var reqJosnData;
    var callback;
    if (arguments.length==3) {
        // 判断第一个参数类型，若是 string，则表示 path，反之为对象
        if (typeof arguments[0] == "string") {
            options = {
                path : arguments[0]
            }
        } else {
            options = arguments[0];
        }
        reqJosnData = arguments[1];
        callback = arguments[2];
    } else if (arguments.length==2) {
        // 判断第一个参数类型，若是 string，则表示 path，反之为对象
        if (typeof arguments[0] == "string") {
            options = {
                path : arguments[0]
            }
        } else {
            options = arguments[0];
        }
        reqJosnData = {};
        callback = arguments[1];
    } else {
        throw Error("http put request arguments is error");
    }

    reqJosnData = JSON.stringify(reqJosnData);
    var headers = {
        'Content-Type' : 'application/json; charset=UTF-8',
        'Content-Length' : Buffer.byteLength(reqJosnData, 'utf8')
    };
    var preoptions = {
        host : userservice.host,
        port : userservice.port,
        path : '/',
        method : 'PUT',
        headers : headers
    };
    // 合并对象
    options = joinObject(options,preoptions);

    var resData = "";
    var reqPut = http.request(options, function(resPut) {
        resPut.on('data', function(data) {
            resData += data;
        });
        resPut.on('end', function() {
            callback(resData);
        });
    });

    // 发送REST请求时传入JSON数据
    reqPut.write(reqJosnData);
    reqPut.end();
    reqPut.on('error', function(e) {
        console.error(e);
    });
}

/**
 * 发送 delete 请求
 * @param options 路径参数（必需）
 *         options 可以是 String ，表示 path
 *         options 可以是 对象 {host:"host",port:port,path:"path",method:"method"}，对象参数可选
 * @param callback 回调函数（必需）
 */
exports.delete = function(){
    var options;
    var callback;
    if (arguments.length==2) {
        // 判断第一个参数类型，若是 string，则表示 path，反之为对象
        if (typeof arguments[0] == "string") {
            options = {
                path : arguments[0]
            }
        } else {
            options = arguments[0];
        }
        reqJosnData = {};
        callback = arguments[1];
    } else {
        throw Error("http delete request arguments is error");
    }

    var headers = {
        'Content-Type' : 'application/json; charset=UTF-8'
    };
    var preoptions = {
        host : userservice.host,
        port : userservice.port,
        path : '/',
        method : 'DELETE',
        headers : headers
    };
    // 合并对象
    options = joinObject(options,preoptions);

    var resData = "";
    var reqDelete = http.request(options, function(resDelete) {
        resDelete.on('data', function(data) {
            resData += data;
        });
        resDelete.on('end', function() {
            callback(resData);
        });
    });

    reqDelete.end();
    reqDelete.on('error', function(e) {
        console.error(e);
    });
}

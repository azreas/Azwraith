/**
 * 系统参数
 * Created by lingyuwang on 2016/3/25.
 */


/********************* appConfig start *********************/
var appConfig = {
    port: process.env.appport || 3000
}
/********************* appConfig end *********************/


/********************* redis start *********************/
var redis = {
    host: '127.0.1.1',
    port: 6379,
    options: {}
}
/********************* redis end *********************/


/********************* mongodb start *********************/
var mongodb = {
    host: '127.0.1.1',
    port: 27017,
    dbname: 'myblog'
}
/********************* mongodb end *********************/


/********************* docker start *********************/
var dockerConfig = {
    /*host : '192.168.1.240',
     port : 2375,*/
    /*host : '192.168.1.238',
     port : 2375,*/
    /*host : '192.168.1.241',
     port : 3375*//*,
     timeout: 6000*/
    host: process.env.swarmhost || '192.168.1.246',
    port: process.env.swarmport || 3375,
    domain: process.env.domain || "zerocloud.club"
}
/********************* docker end *********************/


/********************* request docker service start *********************/
var userservice = {
    /*host : '192.168.1.253',
     port : 9000*/
    /*host : '192.168.1.236',
     port : 9000*/
    host: process.env.userservicehost || '192.168.1.243',
    port: process.env.userserviceport || 3001
    // host: '127.0.0.1',
    // port: 9000
};
var dockerservice = {
    /*host : '192.168.1.253',
     port : 9000*/
    /*host : '192.168.1.236',
     port : 9001*/
    /*host : 'zerocloud.daoapp.io',
     port : 80*/
    host: process.env.dockerservicehost || '192.168.1.243',
    port: process.env.dockerserviceport || 3000
};
var domainservice = {
    host: process.env.PORT || '192.168.1.253',
    port: 3000
};
/********************* request docker service end *********************/

//
var dockerapitest = {
    host: '121.201.18.167',
    port: 3375
}
// var dockerapitest={
//     host:'127.0.0.1',
//     port:8080
// }
module.exports = {
    appConfig: appConfig,
    redis: redis,
    mongodb: mongodb,
    dockerConfig: dockerConfig,
    userservice: userservice,
    dockerservice: dockerservice,
    dockerapitest: dockerapitest,
    domainservice: domainservice
}


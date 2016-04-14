/**
 * 系统参数
 * Created by lingyuwang on 2016/3/25.
 */


/********************* appConfig start *********************/
var appConfig = {
    port : 3000
}
/********************* appConfig end *********************/


/********************* redis start *********************/
var redis = {
    host : '127.0.1.1',
    port : 6379,
    options : {}
}
/********************* redis end *********************/


/********************* mongodb start *********************/
var mongodb = {
    host : '127.0.1.1',
    port : 27017,
    dbname : 'myblog'
}
/********************* mongodb end *********************/


/********************* docker start *********************/
var dockerConfig = {
    host : '192.168.1.238',
    port : 2375,
    /*host : '192.168.1.241',
    port : 3375,*/
    timeout: 6000
}
/********************* docker end *********************/


/********************* request docker service start *********************/
var userservice = {
    /*host : '192.168.1.253',
    port : 9000*/
    /*host : '192.168.1.236',
    port : 9000*/
    host : '192.168.1.240',
    port : 9000
}
var dockerservice = {
    /*host : '192.168.1.253',
    port : 9000*/
    /*host : '192.168.1.236',
    port : 9001*/
    /*host : 'zerocloud.daoapp.io',
    port : 80*/
    host : '192.168.1.240',
    port : 9001
}
/********************* request docker service end *********************/


module.exports = {
    appConfig : appConfig,
    redis : redis,
    mongodb : mongodb,
    dockerConfig : dockerConfig,
    userservice : userservice,
    dockerservice : dockerservice
}
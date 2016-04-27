/**
 * 中间件
 * Created by lingyuwang on 2016/3/28.
 */

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');


module.exports = function(app){
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(express.static(path.join(__dirname,'../bower_components')));
};
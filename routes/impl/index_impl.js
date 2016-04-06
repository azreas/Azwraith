/**
 * index controller impl
 * Created by lingyuwang on 2016/3/23.
 */

var mongoPool = require("../../modules/db/mongodb").mongoPool;
var httpUtil = require("../../modules/util/httpUtil");

exports.home = function(req, res) {
    res.render('index', { title: 'Express' });
}

exports.test = function(req, res) {
    res.render('test', { title: 'Express',uid:req.params.uid });
}
/**
 * index controller impl
 * Created by lingyuwang on 2016/3/23.
 */

var mongoPool = require("../../modules/db/mongodb").mongoPool;
var httpUtil = require("../../modules/util/httpUtil");

exports.console = function(req, res) {
    res.render('console', { title: '控制台',uid:req.params.uid });
}
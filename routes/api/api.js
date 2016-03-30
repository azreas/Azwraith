/**
 * api 入口
 * Created by lingyuwang on 2016/3/25.
 */
var connect_rest = require('connect-rest');
var rest = connect_rest.create({
    context: '/api'
});

module.exports = function(app){
    // 引入 users api
    require('./user')(rest);

    // 将 API 连入管道
    app.use(rest.processRequest());
};
/**
 * 设置环境变量
 * Created by lingyuwang on 2016/3/28.
 */

var path = require('path');

module.exports = function(app){
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
}
var http = require('http');
var express = require('express');
var app = express();
var express = require('express');
var appConfig = require('./settings').appConfig;

// 设置环境变量
require('./environment')(app);

// 引入中间件
require('./middleware')(app);


/*************************** 开放请求开始 *******************************/

/*************************** 开放请求结束 *******************************/


// 鉴权
require('./authentication')(app);


/*************************** 需经过登录认证的请求开始 *******************************/
// 引入 index controller
require('./routes/direct/index')(app);

// 引入 api
require('./routes/api/api')(app);
/*************************** 需经过登录认证的请求结束 *******************************/


// 异常处理
require('./errorhandle')(app);


http.createServer(app).listen(appConfig.port, function(){
  console.log('dirname ---> '+__dirname);
  console.log('Express server listening on port ---> '+appConfig.port);
});


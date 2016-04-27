var express = require('express');
var app = express();

// 设置环境变量
require('./modules/environment')(app);

// 引入中间件
require('./modules/middleware')(app);

// 配置日志打印（存储到文件）
//require("./modules/log/log_file").config(app);
// 配置日志打印（存储到数据库）
require("./modules/log/log").config(app);


/*************************** 开放请求开始 *******************************/
// 引入 nologin controller，不需登录验证的路由
require('./routes/nologin')(app);
/*************************** 开放请求结束 *******************************/


// 鉴权
//require('./modules/authentication')(app);


/*************************** 需经过登录认证的请求开始 *******************************/
// 引入 index controller
require('./routes/index')(app);

// 引入 user controller
require('./routes/user')(app);

// 引入 image controller
require('./routes/image')(app);

// 引入 serve controller
require('./routes/serve')(app);

// 引入 container controller
require('./routes/container')(app);
/*************************** 需经过登录认证的请求结束 *******************************/


// 异常处理
require('./modules/errorhandle')(app);


module.exports = app;
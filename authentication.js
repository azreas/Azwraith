/**
 * 鉴权
 * Created by lingyuwang on 2016/3/28.
 */

module.exports = function(app){
    // 基于 Cookie token 鉴权
    /*app.use(function(req, res, next) {
        // 获取 Cookie token
        var token = req.cookies.token;
        console.log("token ---> "+token);

        // 判断 token 是否为空，若为空，则返回提示信息
        if (!token) {
            res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
            res.json({
                code : "401",
                msg : "用户未登录，请求失败"
            });
            return;
        }

        // 根据 token 值，获取 登录用户信息，若得到的值为空，则认证失败
        redisUtil.get(token, function(err, res){
            if (!res) {
                res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
                res.json({
                    code : "401",
                    msg : "token已过期，请求失败"
                });
                return;
            }

            // 鉴权成功，则继续
            next();
        });
    });*/
    app.use(function(req, res, next) {
        // 获取 Cookie token
        var token = req.cookies.token;
        console.log("token ---> "+token);

        // 鉴权成功，则继续
        next();
    });
}
/**
 * 操作 cookie 工具
 * Created by lingyuwang on 2016/4/10.
 */

/**
 * 序列化cookie
 * @param name 名称
 * @param val 值
 * @param opt 可选参数 例：{maxAge:1,domain:".baidu.com",path:"/",expires:new Date(),httpOnly:false,secure: false}
 * @returns {string}
 */
var serialize = function (name, val, opt) {
    var pairs = [name + '=' + encodeURI(val)];
    opt = opt || {};
    if (opt.maxAge) pairs.push('Max-Age=' + opt.maxAge);
    if (opt.domain) pairs.push('Domain=' + opt.domain);
    if (opt.path) pairs.push('Path=' + opt.path);
    if (opt.expires) pairs.push('Expires=' + opt.expires.toUTCString());
    if (opt.httpOnly) pairs.push('HttpOnly');
    if (opt.secure) pairs.push('Secure');
    return pairs.join('; ');
};

/**
 * 设置 cookie
 * @param res 响应对象
 * @param name 名称
 * @param val 值
 * @param opt 可选参数
 *         例1，存多个cookie：var opt = {maxAge:1,domain:".baidu.com",path:"/",expires:new Date(),httpOnly:false,secure: false}
 *              set(res, [['isVisit', '思思', opt],['token', 'cyl']]);
 *         例2，存一个cookie：set(res, 'isVisit', '思思', opt);
 */
exports.set = function(res, opt) {
    var cookies = [];
    // opt 不是数组，则表示只存一个 cookie，反之则反
    if (Object.prototype.toString.call(opt) === '[object Array]') {
        opt.forEach(function(item, i){
            var cookie;
            if (item.length==2) {
                cookie = serialize(item[0], item[1]);
            } else if (item.length==3) {
                cookie = serialize(item[0], item[1], item[2]);
            } else {
                throw new Error("arguments is error");
            }
            cookies.push(cookie);
        });
    } else {
        if (arguments.length==3 || arguments.length==4) {
            cookie = serialize(arguments[1], arguments[2], arguments[3]);
            cookies.push(cookie);
        } else {
            throw new Error("arguments is error");
        }
    }
    res.setHeader("Set-Cookie", cookies);
}



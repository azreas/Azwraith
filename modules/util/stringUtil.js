/**
 * 字符串工具
 * Created by lingyuwang on 2016/4/8.
 */

/**
 * 生成随机字符串
 * @param len 目标字符串长度
 * @returns {string}
 */
exports.randomString = function (len) {
    var $chars = 'abcdefghijklmnopqrstuvwxyz';
    var maxPos = $chars.length;
    var tag = '';
    for (i = 0; i < len; i++) {
        tag += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return tag;
}

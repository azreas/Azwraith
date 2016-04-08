/**
 * 日期工具
 * Created by lingyuwang on 2016/4/8.
 */

/**
 * 根据日期获取字符串，如：1990-1-1
 * @param date
 * @returns {string}
 */
exports.getDateString = function(date) {
    // 年
    var year = date.getFullYear();

    // 月
    var month = date.getMonth()+1;

    // 日
    var day = date.getDate();

    // 小时
    var hour = date.getHours();

    // 分钟
    var minute = date.getMinutes();

    // 秒数
    var second = date.getSeconds();

    var dateStr = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;

    return dateStr;
}

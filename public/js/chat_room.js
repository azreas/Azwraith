/**
 * Created by HC on 2016/5/27.
 */
//聊天窗口接入
(function (m, ei, q, i, a, j, s) {
    m[a] = m[a] || function () {
            (m[a].a = m[a].a || []).push(arguments)
        };
    j = ei.createElement(q),
        s = ei.getElementsByTagName(q)[0];
    j.async = true;
    j.charset = 'UTF-8';
    j.src = i + '?v=' + new Date().getUTCDate();
    s.parentNode.insertBefore(j, s);
})(window, document, 'script', '//static.meiqia.com/dist/meiqia.js', '_MEIQIA');
_MEIQIA('entId', 4312);
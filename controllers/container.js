/**
 * 容器控制层
 * Created by xzj on 2016/5/3 0003.
 */
var containerService = require('../service/container');
var logger = require("../modules/log/log").logger();

/**
 * 获取当前用户所属服务列表
 * @param req
 * @param res
 */
exports.listByUid = function (req, res, next) {
    try {
        containerService.listByUid(req.cookies.token, function (err, result) {
            try {
                if (!err) {
                    res.json(result);
                } else {
                    var listresult = '0';
                    res.json(listresult);
                }
            } catch (e) {
                next(e);
            }
        })
    } catch (e) {
        logger.info('获取当前用户所属服务列表失败  ' + e);
        next(e);
        // res.json({
        //     result: false,
        //     info: {
        //         code: "00000",
        //         script: "获取当前用户所属服务列表失败"
        //     }
        // });
    }
}
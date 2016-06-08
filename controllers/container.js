/**
 * 容器控制层
 * Created by xzj on 2016/5/3 0003.
 */
var containerService = require('../service/container');
var logger = require("../modules/log/log").logger();
var events = require('events');
var emitter = new events.EventEmitter();

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

/**
 * 根据APPID获取容器列表
 * @param req
 * @param res
 * @param next
 */
exports.listByAppid = function (req, res, next) {
    containerService.listByAppid(req.params.appid, function (err, data) {
        if (!err) {
            res.json(data);
        } else {
            logger.info(err);
            res.json({
                result: false,
                info: {
                    code: "00000",
                    script: "根据服务 " + req.params.appid + " 获取所属容器实例列表失败"
                }
            });
        }
    });
}

/**
 * 根据appid查找scalecontainer
 * @param req
 * @param res
 * @param next
 */
exports.findscalecontainer = function (req, res, next) {
    containerService.findscalecontainer(req.params.appid, function (err, data) {
        if (!err) {
            res.json(data);
        } else {
            logger.info(err);
            res.json({
                result: false,
                info: {
                    code: "00000",
                    script: err
                }
            });
        }
    });
};

/**
 * 容器EXEC
 * @param server
 */
exports.exec = function (io) {
    // var io = require('socket.io')(server);
    logger.debug('exec container start');
    io.of('/exec')
        .on('connection', function (socket) {
            logger.debug('exec connect');
            // socket.name = uuid.v4();
            socket.on('execContainerStart', function (containerID) {
                containerService.exec(containerID, function (err, request, response) {
                    if (!err) {
                        // request.write('ps\n');
                        response.on('data', function (chunk) {
                            socket.emit("execContainerMonitor", chunk);
                        });
                        socket.on('execCommand', function (command) {
                            request.write(command + '\n');
                        });
                    } else {
                        socket.emit("execContainerError", err);
                    }
                    //断开docker连接
                    emitter.once('destroy', function () {
                        response.destroy();
                        request.end();
                    })
                });
            });
            socket.on('disconnect', function () {
                logger.debug('exec disconnect');
                emitter.emit('destroy');
            })

        });

}

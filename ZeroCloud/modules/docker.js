/**
 * docker 单例
 * Created by lingyuwang on 2016/3/29.
 */

var dockerConfig = require('../settings').dockerConfig;

var Docker = require('dockerode');

var docker = new Docker({
    host: dockerConfig.host,
    port: dockerConfig.port,
    timeout: dockerConfig.timeout
});

modules.exports = docker;
/**
 * Created by xzj on 2016/6/21 0021.
 */
'use strict';
var logger = require("../modules/log/log").logger();
var _ = require('lodash');

/**
 * 端口解析方法
 * @param ports
 * @returns {port/protocol:{}}
 */
function getPorts(ports) {
    let exposedPorts = {};
    ports.forEach(p => {
        exposedPorts[p.port + '/' + p.protocol.toLowerCase()] = {};
    });
    return exposedPorts;
}
/**
 * 服务关联解析方法
 * @param serverName
 * @returns {Array}
 */
function getLinks(serverNameList) {
    let containerName = 'mysql';
    let links = [];
    serverNameList.forEach(name=> {
        links.push(containerName + ':' + name)
    });
    return links
}
/**
 * 解析器数据结构
 * @type {Map}
 */
const serverDetails = new Map([[
    'image', (value)=> {
        return {Image: value};
    }], [
    'links', (value)=> {
        // return {HostConfig: {Links: getLinks(value)}};
    }], [
    'ports', (value)=> {
        return {HostConfig: {"PublishAllPorts": true}, ExposedPorts: getPorts(value)};
    }], [
    'environment', (value)=> {
        return {Env: value};
    }]
]);

/**
 * 解析器
 * @param key
 * @param value
 * @returns {*}
 */
function parser(key, value) {
    var func = serverDetails.get(key);
    if (func) {
        return func(value);
    }
    logger.info('key ' + key + ' not found');
    return null;
}

module.exports = function multiCreateDatas(composeYml, callback) {
    let createDatas = new Map();
    let startList = {};
    let startFirst = new Set();
    let startLater = new Set();
    for (let server  in composeYml) {
        let createOption = {
            "HostConfig": {
                "Binds": [
                    "/etc/localtime:/etc/localtime:ro"
                ],
                "RestartPolicy": {
                    "Name": "always"
                }
            }
        };
        for (let parameter in composeYml[server]) {
            createOption = _.defaultsDeep(createOption, parser(parameter, composeYml[server][parameter]));
        }
        if (composeYml[server].links) {
            startLater.add(server);
            composeYml[server].links.forEach(s=> {
                startFirst.add(s);
            });
        } else {
            startFirst.add(server);
        }
        createDatas.set(server, createOption);
    }
    startList = {startFirst: [...startFirst], startLater: [...startLater]};
    logger.debug(startList);
    logger.debug(createDatas);
    return callback(startList, createDatas);
};
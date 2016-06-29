/**
 * Created by xzj on 2016/6/24 0024.
 */
'use strict';
var request = require('request');
var swarmUrl = require('../settings').swarmUrl;

/**
 *
 * @param parameter
 * @param serverName
 * @returns {Promise}
 */
function createContainer(parameter, serverName) {
    return new Promise((resolve, reject)=> {
        request.post('http://' + swarmUrl + '/containers/create?name=' + serverName, {
            body: parameter,
            json: true
        }, (error, response, body)=> {
            if (!error) {
                if (response.statusCode === 201) {
                    resolve(body);
                } else {
                    reject(body);
                }
            } else {
                reject(error);
            }
        });
    });
}

/**
 *
 * @param containerId
 * @returns {Promise}
 */
function startContainer(containerId) {
    return new Promise((resolve, reject)=> {
        request.post('http://' + swarmUrl + '/containers/' + containerId + '/start', (error, response, body)=> {
            if (!error) {
                if (response.statusCode === 204) {
                    resolve('start success');
                } else {
                    reject(body);
                }
            } else {
                reject(error);
            }
        });
    });
}

/**
 *
 * @param networkName
 * @returns {Promise}
 */
function createNetwork(networkName) {
    let postData = {
        "Name": networkName, // 网络名
        "Driver": "overlay",
        "EnableIPv6": false,
        "Internal": false
    };
    return new Promise((resolve, reject)=> {
        request.post('http://' + swarmUrl + '/networks/create', {
            body: postData,
            json: true
        }, (error, response, body)=> {
            if (!error) {
                if (response.statusCode === 201) {
                    resolve(body);
                } else {
                    reject(body);
                }
            } else {
                reject(error);
            }
        });
    });
}

module.exports = {createContainer, startContainer, createNetwork};
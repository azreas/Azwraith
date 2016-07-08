/**
 * 服务编排数据库dao层
 * Created by xzj on 2016/6/28 0028.
 */
var request = require('request');
var dockerservice = require('../settings').dockerservice;

function getComposeByUserId(userId) {
    return new Promise((resolve, reject)=> {
        request.get('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/compose/list/' + userId, {json: true},
            (error, response, body) => {
                if (!error) {
                    if (body.result === true) {
                        resolve(body);
                    } else {
                        reject(body);
                    }
                } else {
                    reject(error);
                }
            }
        )
        ;
    });
}

function saveCompose(composeJson) {
    return new Promise((resolve, reject)=> {
        request.post('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/compose', {
            body: composeJson,
            json: true
        }, (error, response, body)=> {
            if (!error) {
                if (body.result === true) {
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

function updateCompose(composeJson) {
    return new Promise((resolve, reject)=> {
        request.put('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/compose', {
            body: composeJson,
            json: true
        }, (error, response, body)=> {
            if (!error) {
                if (body.result === true) {
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

function deleteComposeById(composeId) {
    return new Promise((resolve, reject)=> {
        request.del('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/compose/' + composeId, {json: true}, (error, response, body)=> {
            if (!error) {
                if (body.result === true) {
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
 * 根据id修改
 * @param composeId
 * @returns {Promise}
 */
function getComposeByID(composeId) {
    return new Promise((resolve, reject)=> {
        request.get('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/compose/' + composeId, {json: true}, (error, response, body)=> {
            if (!error) {
                if (body.result === true) {
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

function getPublicCompose() {
    return new Promise((resolve, reject)=> {
        request.get('http://' + dockerservice.host + ':' + dockerservice.port + '/v1/compose/public', {json: true}, (error, response, body)=> {
            if (!error) {
                if (body.result === true) {
                    resolve(body.data);
                } else {
                    reject(body);
                }
            } else {
                reject(error);
            }
        });
    });
}


module.exports = {
    getComposeByUserId,
    saveCompose,
    updateCompose,
    deleteComposeById,
    getComposeByID,
    getPublicCompose
};
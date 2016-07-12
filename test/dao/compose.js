/**
 * Created by xzj on 2016/6/28 0028.
 */
let composeDao = require('../../dao/composer');
let uuid = require('node-uuid');
let composeId = uuid.v4();
let userId = 'test';
let compose = {
    "wordpress": {
        "image": "wordpress",
        "links": ["mysql"],
        "ports": [{"port": 80, "protocol": "TCP"}],
        "environment": ["WORDPRESS_DB_PASSWORD=test"]
    },
    "mysql": {
        "image": 'mysql',
        "ports": [{"port": 3306, "protocol": "TCP"}],
        "environment": ["MYSQL_ROOT_PASSWORD=test"]
    }
};
let composeJson = {
    id: composeId,
    ownerid: userId,
    composeName: 'abc',
    composeJson: compose
};

composeDao.saveCompose(composeJson)
    .then(res=> {
        console.log('saveCompose', res);
        return composeDao.getComposeByUserId(userId);
    })
    .then(res=> {
        console.log('getComposeByUserId', res);
        return composeDao.getComposeByID(composeId);
    })
    .then(res=> {
        delete res.compose._id;
        console.log('getComposeByID', res);
        composeJson.compose = {};
        return composeDao.updateCompose(composeJson);
    })
    .then(res=> {
        console.log('updateComposeById', res);
        return composeDao.deleteComposeById(composeId);
    })
    .then(res=> {
        console.log('deleteComposeById', res);
        return composeDao.getComposeByID(composeId);
    })
    .then(res=> {
        console.log('getComposeByID', res);
    })
    .catch(e=> {
        console.log('e', e);
    });

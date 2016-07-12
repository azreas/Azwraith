/**
 * Created by xzj on 2016/7/11 0011.
 */
'use strict';
let billingDao = require('../../../dao/billing');

let expireInfo = {
    "container_id": "testContainerId",
    "expire_time": "testTime",
    "user_id": "testUserId"
};
billingDao.setExpireContainer(expireInfo)
    .then(res=> {
        console.log('setExpireContainer\n', res);
        return billingDao.getExpireContainerByUserId('testUserId');
    })
    .then(res=> {
        console.log('getExpireContainerByUserId\n', res);
        return billingDao.delExpireContainerByContainerId('testContainerId');
    })
    .then(res => {
            console.log('delExpireContainerByContainerId\n', res);
        }
    )
    .catch(e=> {
            console.error(e);
        }
    );
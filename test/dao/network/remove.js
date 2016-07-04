/**
 * Created by xzj on 2016/5/11 0011.
 */

var networkDao = require('../../../dao/network');

var networkid = '21f556788fefa9ef21ad343cd4910f997b2f1b791091d8e217edc6a8741f7a29';
networkDao.remove(networkid, function (err, data) {
    try {
        console.log('err----', err);
        console.log(data);
    } catch (e) {
        console.log(e);
    }
})
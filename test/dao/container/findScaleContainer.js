/**
 * Created by xzj on 2016/5/13 0013.
 */

var containerDao = require('../../../dao/container');

var appid = '7068540d-2c33-475d-97f9-9f5312464b62';
containerDao.findscalecontainer(appid, function (err, data) {
    console.log(err);
    console.log(data);
});
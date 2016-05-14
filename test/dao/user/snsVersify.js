/**
 * Created by HC on 2016/5/14.
 */

var userDao = require("../../../dao/user");

var uid = '80f3b4d0-19e1-11e6-b512-a9d29e219d68';
var phonecode = '766896';
userDao.verifySNS(uid, phonecode, function (err, data) {
    console.log(err);
    console.log(data);
});

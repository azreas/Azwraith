/**
 * Created by xzj on 2016/5/12 0012.
 */

var rest = require('restler');

var data = {
    "instance": 1,
    "appid": "b2075675-3678-45de-8725-5001a0a7b258",
    "containerList": ['e2fc3afd49851032d250bd9235b70a24f5e936fbd50572071db00dcd77379b21']
};

data.instance = -1;


rest.postJson('http://127.0.0.1:3000/serve/autoscale/', data).on('complete', function (data, response) {
    console.log(response.statusCode);
    console.log(data);
    // console.log(response);
});
/**
 * 根基containerid读取container详细信息
 * Created by lingyuwang on 2016/4/25.
 */

var containerService = require("../../../dao/container");

var id = "cf8e413ade384240695e71dca9b1eb7988a50a38d9f40975180e0dd79ec16b4d";
containerService.get(id, function (err, data) {
    console.log("err ---> "+err);
    console.log(data);
    console.log(data.info);
});
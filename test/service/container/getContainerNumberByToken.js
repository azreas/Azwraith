/**
 * Created by xzj on 2016/7/11 0011.
 */
'use strict';
let containerService = require('../../../service/container');

let token = '38220e10-473a-11e6-a986-addd6b34e055';

containerService.getContainerNumberByToken(token, (err, data)=> {
    console.log(err);
    console.log(data);
});
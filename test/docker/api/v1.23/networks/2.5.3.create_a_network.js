/**
 * Created by feidD on 2016/4/18.
 */

// POST /networks/create
var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;
var postdata=     {
    "Name":"xzj4",
    "Driver":"overlay",
    "EnableIPv6": false,
    // "IPAM":{
    //     "Config":[
    //         {
    //             "Subnet":"10.0.10.0/24"
    //             // "IPRange":"172.3.1.1/24",
    //             // "Gateway":"172.3.1.1"
    //         }
    //     ]
    // },
    "Internal":false
};
rest.postJson('http://'+dockerapitest.host+':'+dockerapitest.port+'/networks/create', postdata).on('complete', function(data, response) {
    console.log(response.statusCode );
    console.log(data);
});


// 201 - no error
// 404 - plugin not found
// 500 - server error
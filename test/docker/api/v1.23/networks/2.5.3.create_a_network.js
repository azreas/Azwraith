/**
 * Created by feidD on 2016/4/18.
 */

// POST /networks/create
var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;
var postdata=     {
    "Name":"isolated_nw",
    "Driver":"bridge",
    "EnableIPv6": false,
    "IPAM":{
        "Config":[
            {
                "Subnet":"172.20.0.0/16",
                "IPRange":"172.20.10.0/24",
                "Gateway":"172.20.10.11"
            }
        ],
        "Options": {
            "foo": "bar"
        }
    },
    "Internal":true
};
rest.postJson('http://'+dockerapitest.host+':'+dockerapitest.port+'/networks/create', postdata).on('complete', function(data, response) {
    console.log(response.statusCode );
    console.log(data);
});
/**
 * Created by feidD on 2016/4/18.
 */

//POST /networks/(id)/connect
var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;
var postdata= {
    "Container":"17f649030eab2910350092fff695137ca3eeae64589352499304cea9b979d03e"
    // "EndpointConfig": {
    //     "IPAMConfig": {
    //         "IPv4Address":"172.24.56.89",
    //         "IPv6Address":"2001:db8::5689"
    //     }
    // }
};
var networkid='403cedc9a977fcccfa146d5a516192890d476f4658aab72bc86c7768735ad474';
rest.postJson('http://'+dockerapitest.host+':'+dockerapitest.port+'/networks/'+networkid+'/connect', postdata).on('complete', function(data, response) {
    console.log(response.statusCode );
    console.log(data);
});
/**
 * Created by feidD on 2016/4/18.
 */
// POST /networks/(id)/disconnect
var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;
var postdata= {
    "Container":"3613f73ba0e4",
    "Force":false
};
var networkid='403cedc9a977fcccfa146d5a516192890d476f4658aab72bc86c7768735ad474';
rest.postJson('http://'+dockerapitest.host+':'+dockerapitest.port+'/networks/'+networkid+'/disconnect', postdata).on('complete', function(data, response) {
    console.log(response.statusCode );
    console.log(data);
});

// 200 - no error
// 404 - network or container not found
// 500 - Internal Server Error
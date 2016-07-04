/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1

// POST /images/(name)/push


var rest = require('restler');
var dockerapitest = require('../../../../../settings').dockerapitest;

var imagesName = '1024/behat';
rest.post('http://' + dockerapitest.host + ':' + dockerapitest.port + '/images/' + imagesName + '/push', {}).on('success', function (data, response) {
    // if (response.statusCode == 201) {
    //     // you can get at the raw response like this...
    // }
    console.log(response.statusCode);
    console.log(data);
});
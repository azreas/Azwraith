/**
 * Created by feidD on 2016/4/18.
 */
// GET /events
var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;

// since – Timestamp used for polling
// until – Timestamp used for polling
// filters – A json encoded value of the filters (a map[string][]string) to process on the event list. Available filters:
//     container=<string>; -- container to filter
//     event=<string>; -- event to filter
//     image=<string>; -- image to filter
//     label=<string>; -- image and container label to filter
//     type=<string>; -- either container or image or volume or network
//     volume=<string>; -- volume to filter
//     network=<string>; -- network to filter


rest.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/events').on('200', function(result,res) {
    if (result instanceof Error) {
        console.log('Error:', result.message);
        this.retry(5000); // try again after 5 sec
    } else {
        console.log(res.statusCode);
        console.log(result);
        console.log(JSON.stringify(result));
    }
});
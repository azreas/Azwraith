/**
 * GET /images/search
 * Search for an image on Docker Hub.
 * Created by feidD on 2016/4/18.
 */
//TODO 1

var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;



// 搜索 images ,只需要提供imagesName就可以获取images数据
// GET /images/search?term=sshd HTTP/1.1

var imagesName='nginx';

rest.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/images/search?term='+imagesName).on('complete', function(result) {
    if (result instanceof Error) {
        console.log('Error:', result.message);
        this.retry(5000); // try again after 5 sec
    } else {
        console.log(result);
    }
});

// [ { star_count: 2655,
//     is_official: true,
//     name: 'nginx',
//     is_trusted: false,
//     is_automated: false,
//     description: 'Official build of Nginx.' },
//     { star_count: 590,
//         is_official: false,
//         name: 'jwilder/nginx-proxy',
//         is_trusted: true,
//         is_automated: true,
//         description: 'Automated Nginx reverse proxy for docker containers' },
//     { star_count: 3,
//         is_official: false,
//         name: 'webdevops/nginx',
//         is_trusted: true,
//         is_automated: true,
//         description: 'Nginx container' },
//     { star_count: 19,
//         is_official: false,
//         name: 'webdevops/php-nginx',
//         is_trusted: true,
//         is_automated: true,
//         description: 'Nginx with PHP-FPM' },
//     { star_count: 16,
//         is_official: false,
//         name: 'bitnami/nginx',
//         is_trusted: true,
//         is_automated: true,
//         description: 'Bitnami nginx Docker Image' },
//     { star_count: 2,
//         is_official: false,
//         name: 'dock0/nginx',
//         is_trusted: true,
//         is_automated: true,
//         description: 'Arch container running nginx' },
//     { star_count: 55,
//         is_official: false,
//         name: 'million12/nginx-php',
//         is_trusted: true,
//         is_automated: true,
//         description: 'Nginx + PHP-FPM 5.5, 5.6, 7.0 (NG), CentOS-7 based' },
//     { star_count: 2,
//         is_official: false,
//         name: '1science/nginx',
//         is_trusted: true,
//         is_automated: true,
//         description: 'Nginx Docker images based on Alpine Linux' },
//     { star_count: 1,
//         is_official: false,
//         name: 'blacklabelops/nginx',
//         is_trusted: true,
//         is_automated: true,
//         description: 'Dockerized Nginx Reverse Proxy Server.' },
//     { star_count: 4,
//         is_official: false,
//         name: 'million12/nginx',
//         is_trusted: true,
//         is_automated: true,
//         description: 'Nginx: extensible, nicely tuned for better performance.' }]
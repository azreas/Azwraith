/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1

//创建容器
//POST /containers/create
var rest = require('restler');
var dockerapitest = require('../../../../../settings').dockerapitest;
var postdata = {};
postdata = {
    "Hostname": "",     //容器名称
    "Domainname": "",   //域名
    "User": "",         //用户
    "Memory ": 5000,     //内存限制 字节
    "AttachStdin": false,
    "AttachStdout": true,
    "AttachStderr": true,
    "Tty": false,
    "OpenStdin": false,
    "StdinOnce": false,
    "Env": [
        "FOO=bar",
        "BAZ=quux"
    ],
    "Cmd": [
        "date"
    ],
    "Entrypoint": "",
    "Image": "tomcat",
    "Labels": {
        "com.example.vendor": "Acme",
        "com.example.license": "GPL",
        "com.example.version": "1.0"
    },
    "Volumes": {
        "/volumes/data": {}
    },
    "WorkingDir": "",
    "NetworkDisabled": false,
    "MacAddress": "12:34:56:78:9a:bc",
    "ExposedPorts": {
        "22/tcp": {}
    },
    "StopSignal": "SIGTERM",
    "HostConfig": {
        "Binds": ["/tmp:/tmp"],

        "Memory": 0,
        "MemorySwap": 0,
        "MemoryReservation": 0,
        "KernelMemory": 0,
        "CpuShares": 512,
        "CpuPeriod": 100000,
        "CpuQuota": 50000,
        "BlkioWeight": 300,
        "BlkioWeightDevice": [{}],
        "BlkioDeviceReadBps": [{}],
        "BlkioDeviceReadIOps": [{}],
        "BlkioDeviceWriteBps": [{}],
        "BlkioDeviceWriteIOps": [{}],
        "MemorySwappiness": 60,
        "OomKillDisable": false,
        "OomScoreAdj": 500,
        "PortBindings": {"22/tcp": [{"HostPort": "11022"}]},
        "PublishAllPorts": false,
        "Privileged": false,
        "ReadonlyRootfs": false,
        "Dns": ["8.8.8.8"],
        "DnsOptions": [""],
        "DnsSearch": [""],
        "ExtraHosts": null,
        "CapAdd": ["NET_ADMIN"],
        "CapDrop": ["MKNOD"],
        "GroupAdd": ["newgroup"],
        "RestartPolicy": {"Name": "", "MaximumRetryCount": 0},
        "NetworkMode": "bridge",
        "Devices": [],
        "Ulimits": [{}],
        "LogConfig": {"Type": "json-file", "Config": {}},
        "SecurityOpt": [],
        "CgroupParent": "",
        "VolumeDriver": "",
        "ShmSize": 67108864
    },
    "NetworkingConfig": {
        "EndpointsConfig": {
            "isolated_nw": {
                "IPAMConfig": {
                    "IPv4Address": "172.20.30.33",
                    "IPv6Address": "2001:db8:abcd::3033"
                },
                "Links": ["container_1", "container_2"],
                "Aliases": ["server_x", "server_y"]
            }
        }
    }
};
var postdata = {
    Image: 'mysql:latest',
    Env: '',
    // Labels: {
    //     'interlock.hostname': 'xzj.332.app',
    //     'interlock.domain': 'zerocloud.club'
    // },
    HostConfig: {
        Binds: ['/etc/localtime:/etc/localtime:ro'],
        PublishAllPorts: true,
        // MemoryReservation: 268435456,
        // NetworkMode: 'xzj.332.app',
        // RestartPolicy: {Name: 'always'}
    }
};
var time1 = new Date().getTime();
rest.postJson('http://192.168.1.240:3375' + '/containers/create', postdata, {timeout: 5000}).on('timeout', function (ms) {
    console.log('did not return within ' + ms + ' ms');
}).on('complete', function (data, response) {
    var time2 = new Date().getTime();
    console.log(time2 - time1);
    // console.log(response.statusCode);
    //console.log(response);
    console.log(data);
});


//返回
// 201
// { Id: '67e1dab39226315f1d3b4a086b664772391c0ae7bd8fc46895321158a77c6b58',
//     Warnings: null }

// 201 – no error
// 404 – no such container
// 406 – impossible to attach (container not running)
// 500 – server error
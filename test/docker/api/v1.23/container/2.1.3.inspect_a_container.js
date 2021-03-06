/**
 * Created by feidD on 2016/4/18.
 */
//TODO 1
var rest = require('restler');
var dockerapitest=require('../../../../../settings').dockerapitest;

//GET /containers/(id or name)/json
//参数
//size      1/True/true or 0/False/false       是否返回 SizeRw,SizeRootFs，默认false
var name='62ddff9ea341';
var x={
    result:null,
    count:0
};
rest.get('http://'+dockerapitest.host+':'+dockerapitest.port+'/containers/'+name+'/json?size=1').on('complete', function(result) {
    if (result instanceof Error) {
        console.log('Error:', result.message);
        this.retry(5000); // try again after 5 sec
    } else {
        console.dir(result);
        console.log(JSON.stringify(result));
    }

});


//返回
// { Id: '67e1dab39226315f1d3b4a086b664772391c0ae7bd8fc46895321158a77c6b58',
//     Created: '2016-04-18T09:27:03.925335167Z',
//     Path: '',
//     Args: [ 'date' ],
//     State:
//     { Status: 'created',
//         Running: false,
//         Paused: false,
//         Restarting: false,
//         OOMKilled: false,
//         Dead: false,
//         Pid: 0,
//         ExitCode: 0,
//         Error: '',
//         StartedAt: '0001-01-01T00:00:00Z',
//         FinishedAt: '0001-01-01T00:00:00Z' },
//     Image: 'sha256:1d71cd86910091606a4dcb65bdce918dcfd39d4e14e5cd6db672f7d3224cc138',
//         ResolvConfPath: '',
//     HostnamePath: '',
//     HostsPath: '',
//     LogPath: '',
//     Name: '/sick_wing',
//     RestartCount: 0,
//     Driver: 'aufs',
//     MountLabel: '',
//     ProcessLabel: '',
//     AppArmorProfile: '',
//     ExecIDs: null,
//     HostConfig:
//     { Binds: [ '/tmp:/tmp' ],
//         ContainerIDFile: '',
//         LogConfig: { Type: 'json-file', Config: {} },
//         NetworkMode: 'bridge',
//             PortBindings: { '22/tcp': [Object] },
//         RestartPolicy: { Name: '', MaximumRetryCount: 0 },
//         VolumeDriver: '',
//             VolumesFrom: null,
//         CapAdd: [ 'NET_ADMIN' ],
//         CapDrop: [ 'MKNOD' ],
//         Dns: [ '8.8.8.8' ],
//         DnsOptions: [ '' ],
//         DnsSearch: [ '' ],
//         ExtraHosts: null,
//         GroupAdd: [ 'newgroup' ],
//         IpcMode: '',
//         Links: null,
//         OomScoreAdj: 500,
//         PidMode: '',
//         Privileged: false,
//         PublishAllPorts: false,
//         ReadonlyRootfs: false,
//         SecurityOpt: [],
//         UTSMode: '',
//         ShmSize: 67108864,
//         ConsoleSize: [ 0, 0 ],
//         Isolation: '',
//         CpuShares: 512,
//         CgroupParent: '',
//         BlkioWeight: 300,
//         BlkioWeightDevice: [ [Object] ],
//         BlkioDeviceReadBps: [ [Object] ],
//         BlkioDeviceWriteBps: [ [Object] ],
//         BlkioDeviceReadIOps: [ [Object] ],
//         BlkioDeviceWriteIOps: [ [Object] ],
//         CpuPeriod: 100000,
//         CpuQuota: 50000,
//         CpusetCpus: '',
//         CpusetMems: '',
//         Devices: [],
//         KernelMemory: 0,
//         Memory: 0,
//         MemoryReservation: 0,
//         MemorySwap: 0,
//         MemorySwappiness: 60,
//         OomKillDisable: false,
//         PidsLimit: 0,
//         Ulimits: [ [Object] ] },
//     GraphDriver: { Name: 'aufs', Data: null },
//     Mounts:
//         [ { Source: '/tmp',
//             Destination: '/tmp',
//             Mode: '',
//             RW: true,
//             Propagation: 'rprivate' },
//             { Name: '42f6d8f4084d3411732d607aa2f0a87386dc1fd6a729166eb4a5d93004e332df',
//                 Source: '/var/lib/docker/volumes/42f6d8f4084d3411732d607aa2f0a87386dc1fd6a729166eb4a5d93004e332df/_data',
//                 Destination: '/volumes/data',
//                 Driver: 'local',
//                 Mode: '',
//                 RW: true,
//                 Propagation: '' } ],
//             Config:
//     { Hostname: '67e1dab39226',
//         Domainname: '',
//         User: '',
//         AttachStdin: false,
//         AttachStdout: true,
//         AttachStderr: true,
//         ExposedPorts: { '22/tcp': {}, '8080/tcp': {} },
//         Tty: false,
//             OpenStdin: false,
//         StdinOnce: false,
//         Env:
//         [ 'FOO=bar',
//             'BAZ=quux',
//             'PATH=/usr/local/tomcat/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
//             'LANG=C.UTF-8',
//             'JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64/jre',
//             'JAVA_VERSION=7u95',
//             'JAVA_DEBIAN_VERSION=7u95-2.6.4-1~deb8u1',
//             'CATALINA_HOME=/usr/local/tomcat',
//             'TOMCAT_MAJOR=8',
//             'TOMCAT_VERSION=8.0.33',
//             'TOMCAT_TGZ_URL=https://www.apache.org/dist/tomcat/tomcat-8/v8.0.33/bin/apache-tomcat-8.0.33.tar.gz' ],
//             Cmd: [ 'date' ],
//         Image: 'tomcat',
//         Volumes: { '/volumes/data': {} },
//         WorkingDir: '/usr/local/tomcat',
//             Entrypoint: [ '' ],
//         MacAddress: '12:34:56:78:9a:bc',
//         OnBuild: null,
//         Labels:
//         { 'com.example.license': 'GPL',
//             'com.example.vendor': 'Acme',
//             'com.example.version': '1.0' },
//         StopSignal: 'SIGTERM' },
//     NetworkSettings:
//     { Bridge: '',
//         SandboxID: '',
//         HairpinMode: false,
//         LinkLocalIPv6Address: '',
//         LinkLocalIPv6PrefixLen: 0,
//         Ports: null,
//         SandboxKey: '',
//         SecondaryIPAddresses: null,
//         SecondaryIPv6Addresses: null,
//         EndpointID: '',
//         Gateway: '',
//         GlobalIPv6Address: '',
//         GlobalIPv6PrefixLen: 0,
//         IPAddress: '',
//         IPPrefixLen: 0,
//         IPv6Gateway: '',
//         MacAddress: '',
//         Networks: { isolated_nw: [Object] } } }

/**
 * Created by lingyuwang on 2016/3/28.
 */
var Docker = require('dockerode');
//var docker = new Docker({host: 'http://192.168.1.236', port: 2375, timeout: 6000});
//var docker = new Docker({host: '192.168.1.241', port: 3375});
var docker = new Docker({host: '192.168.1.238', port: 2375});
//var docker = new Docker({host: '192.168.1.215', port: 2375});




// 显示已启动的容器列表
/*docker.listContainers(function (err, containers) {
    console.log("length ---> "+containers.length);
    console.log(containers);
});*/

// 显示最后创建的容器，包括未启动的（limit 表示限制显示条数，按时间倒序排序）
/*docker.listContainers({limit: 4}, function (err, containers) {
    console.log("length ---> "+containers.length);
    console.log(containers);
});*/

/*// 显示容器列表（size 表示显示容器的大小）
docker.listContainers({all:true, size: true}, function (err, containers) {
    console.log("length ---> "+containers.length);
    console.log(containers);
});*/

// 查看未启动的容器（status 表示容器的状态，可选：created|restarting|running|paused|exited|dead）
/*docker.listContainers({filters:{status:["exited"]}}, function (err, containers) {
    console.log("length ---> "+containers.length);
    console.log(containers);
});*/

// 根据 label 条件查询
/*var opts = {
    all:true,
    filters:{
        label:[]
    }
}
docker.listContainers(opts, function (err, containers) {
    console.log("length ---> "+containers.length);
    console.log(containers);
});*/

/*************************** 查询未解决问题开始 ***************************
since
before
filters
    exited
    label
    isolation
*************************** 查询未解决问题结束 ***************************/




// 创建容器（Image：镜像名称，Cmd：启动时命令，name：容器名称）
/*docker.createContainer({Image: 'tomcat', Cmd: ['catalina.sh run'], name: 'tomcat-test'}, function (err, container) {
    console.log(container); // 返回{"id":"bb24f62b00e5fe18e53d58c4fdfca60e37238054a672df3e71f359717269ea60"}
});*/
/*docker.createContainer({
    "Image": "tomcat",
    "HostConfig": {
        "PublishAllPorts": true,
        Memory: 512*1024*1024,
        CpuShares: 1*512
    }
}, function (err, container) {
    console.log(err);
    console.log(container); // 返回{"id":"bb24f62b00e5fe18e53d58c4fdfca60e37238054a672df3e71f359717269ea60"}
    container.start(function (err, data) {
        console.log(data);
    });
});*/
/*for (var i=0; i<20; i++) {
    docker.createContainer({
        "Image": "alexwhen/docker-2048:latest",
        "HostConfig": {
            "PublishAllPorts": true
        }
    }, function (err, container) {
        console.log(err);
        console.log(container); // 返回{"id":"bb24f62b00e5fe18e53d58c4fdfca60e37238054a672df3e71f359717269ea60"}
        container.start(function (err, data) {
            console.log(data);
        });
    });
}*/



// 显示底层的容器信息
/*var container = docker.getContainer('cd755cb4e8cfb302ab9166206685fc7358dfc0f044fdb9360cdac1ac1d0a7375');
container.inspect(function (err, data) {
    console.log(data);
    /!*console.log(data.NetworkSettings.IPAddress);
    console.log(data.NetworkSettings.Ports);
    console.log(data.NetworkSettings.Ports['80/tcp']);
    console.log(new Date(data.Created).getTime());

    var instanceProtocol; // 实例协议
    var instancePort; // 实例端口
    var serverHost = "192.168.1.238"; // 服务ip
    var serverPort; // 服务端口
    var ports = data.NetworkSettings.Ports;
    for(var p in ports){
        serverPort = ports[p][0].HostPort;
        instancePort = p.split("/")[0];
        instanceProtocol = p.split("/")[1];
        break;
    }
    var serverAdress = serverHost+":"+serverPort; // 服务地址
    console.log("serverAdress ---> "+serverAdress);

    var instanceHost = data.NetworkSettings.IPAddress; // 实例ip
    var instanceAdress = instanceHost+":"+instancePort; // 实例地址
    console.log("instanceAdress ---> "+instanceAdress);

    console.log("instanceProtocol ---> "+instanceProtocol);

    console.log("Memory ---> "+(data.HostConfig.Memory/1024/1024));*!/

    console.log(data.State.Running);
    console.log(data.State.Running === true);
});*/




// 运行在容器上的程序列表（ps_args 可选参数是 "-ef"（默认）|"aux"）
/*var container = docker.getContainer('ce5ce7e55280e12e8fb467bdd21aeb5ec3019088178f745f98a177f5e6257b41');
container.top({ps_args:"-ef"},function (err, data) {
    console.log(data);
});*/




// 日志（follow:返回流数据，stdout:标准输出流，stderr:标准输出错误，since:时间戳，tail:显示条数）
/*var container = docker.getContainer('cd755cb4e8cfb302ab9166206685fc7358dfc0f044fdb9360cdac1ac1d0a7375');
container.logs({follow:true,stdout:false,stderr:true,since:0,timestamps:true,tail:1},function (err, data) {
    console.log("err ---> "+err);
    console.log("data ---> "+data);
    console.log(data);
});*/
/*var http = require('http');

var headers = {
    'Content-Type' : 'application/plain; charset=utf-8'
};
var options = {
    host : "192.168.1.215",
    port : 2375,
    path : '/containers/cd755cb4e8cf/logs?stderr=1&stdout=1&follow=1',
    method : 'GET',
    headers : headers
}
var resData = "";
var count = 0;
var reqGet = http.request(options, function(resGet) {
    resGet.on('data', function(data) {
        resData += data;
        count ++;
        console.log(data.toString());
    });
    resGet.on('end', function() {
        //console.log(resData);
        console.log("count ---> "+count);
    });
    setTimeout(function(){
        resGet.destroy(); // 断开连接
    }, 1000);
});

reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});*/




// 显示容器的改变
/*var container = docker.getContainer('ce5ce7e55280e12e8fb467bdd21aeb5ec3019088178f745f98a177f5e6257b41');
container.changes(function (err, data) {
    console.log(data);
});*/





// 导出
/*var container = docker.getContainer('ce5ce7e55280e12e8fb467bdd21aeb5ec3019088178f745f98a177f5e6257b41');
 container.export(function (err, data) {
 console.log(data);
 });*/





// 获取统计数据
/*var container = docker.getContainer('ce5ce7e55280e12e8fb467bdd21aeb5ec3019088178f745f98a177f5e6257b41');
 container.stats({stream:true},function (err, data) {
 console.log(data);
 });*/




// 调整容器的TTY id。单位数量的字符。您必须重新启动容器调整生效
/*var container = docker.getContainer('ce5ce7e55280e12e8fb467bdd21aeb5ec3019088178f745f98a177f5e6257b41');
 container.resize({h:1,w:1},function (err, data) {
 console.log(data);
 });*/




// 启动容器
/*var container = docker.getContainer('43f01b0f3ace723e36835a05c44a7306539e5c3b31154a676ccae0027d344822');
container.start(function (err, data) {
    console.log("err ---> "+err);
    console.log("data ---> "+data);
});*/




// 关闭容器（t 表示杀死容器要等待的秒数）
/*var container = docker.getContainer("cc4465e5939ed978d5c5414f7694fd67c2517524ab002305a615cc12e58a0a76")
container.stop({t:60},function (err, data) {
    console.log("err ---> "+err);
    console.log("data ---> "+data);
});*/




// 重启容器（t 表示杀死容器要等待的秒数）
/*var container = docker.getContainer("ce5ce7e55280e12e8fb467bdd21aeb5ec3019088178f745f98a177f5e6257b41")
 container.restart({t:60},function (err, data) {
 console.log(data);
 });*/




// kill 容器（signal 可选 SIGINT|SIGKILL）
/*var container = docker.getContainer("ce5ce7e55280e12e8fb467bdd21aeb5ec3019088178f745f98a177f5e6257b41")
 container.kill({signal:"SIGKILL"},function (err, data) {
 console.log(data);
 });*/




// 更改容器配置
/*var opts = {
 BlkioWeight: 300,
 CpuShares: 512,
 CpuPeriod: 100000,
 CpuQuota: 50000,
 CpusetCpus: "0,1",
 CpusetMems: "0",
 Memory: 314572800,
 MemorySwap: 514288000,
 MemoryReservation: 209715200,
 KernelMemory: 52428800
 }
 var container = docker.getContainer('c6aaedfa75cf4b1d0bf8bcb9171d0c059f215e439cc34b5f1e444a17e59c7864');
 container.update(opts, function (err, data) {
 console.log("err ---> "+err);
 console.log(data);
 console.log("update ...");
 });*/




// 更改容器名称
/*var container = docker.getContainer("ce5ce7e55280e12e8fb467bdd21aeb5ec3019088178f745f98a177f5e6257b41")
 container.rename({name:"tomcat-newname"},function (err, data) {
 console.log(data);
 });*/




// 容器暂停
/*var container = docker.getContainer("ce5ce7e55280e12e8fb467bdd21aeb5ec3019088178f745f98a177f5e6257b41")
 container.pause(function (err, data) {
 console.log(data);
 });*/




// 容器取消暂停
/*var container = docker.getContainer("ce5ce7e55280e12e8fb467bdd21aeb5ec3019088178f745f98a177f5e6257b41")
container.unpause(function (err, data) {
    console.log(data);
});*/




// 附加到一个容器
/*var container = docker.getContainer("ce5ce7e55280e12e8fb467bdd21aeb5ec3019088178f745f98a177f5e6257b41")
 container.attach({detachKeys:"a",logs:true,stream:true,stdin:true,stdout:true,stderr:true},function (err, data) {
 console.log(data);
 });*/




// 阻塞,直到容器停止,然后返回退出代码
/*var container = docker.getContainer("ce5ce7e55280e12e8fb467bdd21aeb5ec3019088178f745f98a177f5e6257b41")
 container.wait(function (err, data) {
 console.log(data);
 });*/




// 删除指定容器（v 删除卷相关的容器。默认 false。force 杀死然后移除容器。默认 false。）
/*var container = docker.getContainer('1960b23ce727627ebd8e9af359671473e8feef46e9a0687029c0fc6258db5e2e');
container.remove({v:true,force:true},function (err, data) {
    console.log("err ---> "+err);
    console.log("data ---> "+data);
});*/




// 从容器复制文件或文件夹
/*var container = docker.getContainer('d67b059e6a75d5169c38edf232dff50bba6f7fb72341b314b9a6f63c6050dd7a');
 container.copy({Resource: "test.txt"},function (err, data) {
 console.log(data);
 });*/





// 存档
/*var container = docker.getContainer('d67b059e6a75d5169c38edf232dff50bba6f7fb72341b314b9a6f63c6050dd7a');
 container.infoArchive({path:"/root"},function (err, data) {
 console.log(data);
 });*/




// 获取存档
/*var container = docker.getContainer('d67b059e6a75d5169c38edf232dff50bba6f7fb72341b314b9a6f63c6050dd7a');
 container.getArchive({path:"/root"},function (err, data) {
 console.log(data);
 });*/




// 提取存档到容器
/*var container = docker.getContainer('d67b059e6a75d5169c38edf232dff50bba6f7fb72341b314b9a6f63c6050dd7a');
 container.putArchive({path:"/root"},function (err, data) {
 console.log(data);
 });*/












/*var container = docker.getContainer('cd755cb4e8cfb302ab9166206685fc7358dfc0f044fdb9360cdac1ac1d0a7375');
container.inspect(function (err, data) {
    console.log(data);
    console.log(data.LogPath);
    // 同步读取
    var data = fs.readFileSync('input.txt');
});*/






















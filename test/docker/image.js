/**
 * Created by lingyuwang on 2016/3/28.
 */
var Docker = require('dockerode');
var docker = new Docker({host: 'http://192.168.1.215', port: 2375/*, timeout: 3000*/});




// 显示所有镜像列表
/*docker.listImages({all: true}, function (err, images) {
 console.log("images length ---> "+images.length);
 console.log(images);
 });*/

/*************************** 查询未解决问题开始 ***************************
 filters
     dangling
     label
 *************************** 查询未解决问题结束 ***************************/




/*************************** 创建未解决问题开始 ***************************
build
create
 *************************** 创建未解决问题结束 ***************************/




// 获取镜像的底层信息
/*var image = docker.getImage("tomcat");
 image.inspect(function(err,data){
 console.log(data);
 });*/




// 获取镜像的历史记录
/*var image = docker.getImage("tomcat");
image.history(function(err,data){
    console.log(data);
});*/




/*************************** 拉取镜像未解决问题开始 ***************************
push
 *************************** 拉取镜像未解决问题结束 ***************************/




/*************************** 标记镜像未解决问题开始 ***************************
 tag
 *************************** 标记镜像未解决问题结束 ***************************/




// 删除镜像
/*var image = docker.getImage("ubuntu:12.04");
 image.remove({force:false,noprune:false},function(err,data){
 console.log(data);
 });*/





// 查询镜像
/*docker.searchImages({term:"tomcat"},function(err,data){
    console.log(data);
});*/














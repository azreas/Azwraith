/**
 * Created by HC on 2016/4/21.
 */
(function(){

    $('.nav-menu li').eq(0).addClass('item-click');

    //执行命令选择
    $('.execmd').click(function() {
        var type = $(this).val();
        if (type === 'self') {
            $('#execmd').removeClass('cmdtext');
            $('#execmd').removeAttr('disabled');
            $('#execmd').css('cursor', '');
        } else {
            $('#execmd').addClass('cmdtext');
            $('#execmd').attr('disabled', 'disabled');
            $('#execmd').css('cursor', 'no-drop');
        }
    });

    //container切换
    $('.create.pushContaienrs').click(function(){
        $('.part01').hide();
        $('.part02').show();
    });

    //创建容器取容器名
    $('.dialog').on('click','.list-item-description>.pull-deploy',function(){
        var name = $(this).parents('.image-item').find('.container-name').val();  //取镜像名

        $('.host_step1').hide();
        $('.host_step2').show();
        $('.radius_step').eq(1).addClass('action').siblings().removeClass('action');
        $('.createPadding,.createPadding .go_backs01,.createPadding .two_step,.createPadding #createButton').removeClass('hide');
        //容器配置
        $('.imageName').text(name);
        $('#getImageName').val(name);
        $('#getVersion').val($('.version-text').text());

    });

    //添加环境变量
    $('.editEnv').on('click','.addEnv',function(){
        envDiv = $('<div class="envRow"><div style="width: 35%"><input placeholder="name" class="envName" type="text" name="envName"></div><div style="width: 35%;margin-left:4px"><input placeholder="value" class="envVal" type="text" name="envVal"></div><div style="width: 10%;margin-left:4px"><span class="addEnv cursor" data-toggle="tooltip" data-placement="top" title="" data-original-title="添加"><i class="fa fa-plus"></i></span>&nbsp;&nbsp;<span class="removeEnv cursor" style="margin-left: 8px" data-toggle="tooltip" data-placement="top" title="" data-original-title="删除"><i class="fa fa-times"></i></span></div></div>');

        envDiv.appendTo($('.editEnv'));
    });
    $('.editEnv').on('click','.removeEnv',function(){
        var envlength = $('.editEnv .envRow').length;
        if(envlength == 1){
            layer.msg('最后一条不能删除')
        }else {
            $(this).parents('.envRow').remove();
        }
    });

    //创建
    $('#createButton').click(function(){
        var containerName = $('#containerName').val();
        var envName = $('.envName');
        var envVal = $('.envVal');
        if ( containerName === "") {
            layer.msg("服务名称不能为空！");
        } else {
            //for(var i=0;i<envName.length;i++){
            //    if(envName.eq(i).val() == ''){
            //        layer.msg("环境变量名不能为空！");
            //        return;
            //    }
            //}
            //for(var j=0;j<envVal.length;j++){
            //    if(envVal.eq(j).val() == ''){
            //        layer.msg("环境变量值不能为空！");
            //        return;
            //    }
            //}

            var typeX = $('#createContainerForm>li').eq(2).find('.active>.up_style').text().toLowerCase();
            $('#typeX').val(typeX);
            //alert($('#typeX').val());
            $("#createContainerForm").submit();
        }
    });
    $('.createPadding .two_step').click(function(){
        $('.host_step2').hide();
        $('.host_step3').removeClass('hide');
        $('.radius_step').eq(2).addClass('action').siblings().removeClass('action');
        $('.createPadding .go_backs01').addClass('hide');
        $('.createPadding .go_backs02').removeClass('hide');
    });
    $('.go_backs01').click(function(){
        $('.host_step1').show();
        $('.host_step2').hide();
        $('.radius_step').eq(0).addClass('action').siblings().removeClass('action');
        $('.createPadding,.createPadding .go_backs01,.createPadding .two_step,.createPadding #createButton').addClass('hide');
    });
    $('.go_backs02').click(function(){
        $('.host_step2').show();
        $('.host_step3').addClass('hide');
        $('.radius_step').eq(1).addClass('action').siblings().removeClass('action');
        $('.createPadding .go_backs02').addClass('hide');
        $('.createPadding .go_backs01').removeClass('hide');
    });
    //获取本地镜像
    $.ajax({
        url: '/image/list/label/kind',
        type: 'GET'
    }).done(function(resp){
        var images = resp.images;
        //console.log(images);
        for(var i in images){
            var imageDiv;
            imageDiv = $('<div class="image-item"><span class="img_icon span2"><img src="'+images[i].icon+'"></span><span class="span6 type" type="runtime"><div class="list-item-description"><div class="name h4">'+images[i].name+'<a title="点击查看镜像详情" target="_blank" href="'+images[i].detail+'"><i class="fa fa-external-link-square"></i></a></div><span class="span9" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'+images[i].tag+'</span></div></span><span class="span2"><div class="list-item-description"><span class="pull-deploy btn btn-primary">部署<i class="fa fa-arrow-circle-o-right margin fa-lg"></i></span></div></span><input class="container-name" type="hidden" value="'+images[i].name+'"></div>');

            imageDiv.appendTo($('#systemImages'));

        }
    });

    //搜索dockerhub镜像
    $('button[type="submit"]').click(function(){
        $('#systemImages').hide().siblings().show();

        var searchName = $('#search-img').val();
        if(searchName == ''){
            alert('请输入您想要搜索的镜像名称');
        }else {
            $('#searchImages').html('<i class="fa_createing"></i><span style="color: #FF9C00">搜索中<img class="margin" src="/images/loading4.gif"></span>');
            $.ajax({
                url: '/image/search/'+searchName,
                type: 'GET'
            }).done(function(resp){
                console.log(resp);
                if(resp.result == false || resp.data.length == 0){
                    $('#searchImages').html('<div id="nodata"><i>未找到您搜索的镜像，请稍后重试...</i></div>');
                }else if(resp.result == true){
                    $('#searchImages').html('');
                    var images = resp.data;
                    for(var i in images){
                        var imageDiv;
                        imageDiv = $('<div class="image-item"><span class="img_icon span2"><img src="/images/blue-logo.png"></span><span class="span6 type" type="runtime"><div class="list-item-description"><div class="name h4">'+images[i].name+'<a title="点击查看镜像详情" target="_blank" href=""></a></div><span class="span9" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'+images[i].description+'</span></div></span><span class="span2"><div class="list-item-description"><span class="pull-deploy btn btn-primary">部署<i class="fa fa-arrow-circle-o-right margin fa-lg"></i></span></div></span><input class="container-name" type="hidden" value="'+images[i].name+'"></div>');

                        imageDiv.appendTo($('#searchImages'));
                    }
                }

            });
        }
    });

    //添加已创建容器列表
    $.ajax({
        url: '/container/list',
        type: 'GET'

    }).done(function(resp){
        var servers = resp.servers;
        console.log(resp);
        if(resp == 0){
            //var tips = '<div id="nodata" class="nodata" style="display: block;padding-top:20px">服务列表加载失败，请刷新页面</div>';
            var tips = '<div id="nodata" class="nodata" style="display: block;padding-top:20px">提示：点击上方"+创建"按钮创建容器应用。</div><div style="color:#FF9900;margin: 15px 30px;"><i class="fa fa-hand-o-right"></i> Tips: <span style="color:#FF9900;font-size:20px">您当前还未创建服务，您可以新建一个服务</span></div>';
            $('.content').html(tips);
        }else{
            for(var i in servers){
                //console.log(servers[i].address.ip);
                var time = new Date(servers[i].createtime);
                var date = formatDate(time);
                var status = "";
                var deleteFlag = servers[i].deleteFlag;
                if(deleteFlag == '1'){

                }else{
                    switch (servers[i].status)
                    {
                        //1.启动中，2.运行中，3.停止中，4.已停止,5.启动失败,6.停止失败
                        case 1:
                            status = "启动中";
                            break;
                        case 2:
                            status = "运行中";
                            break;
                        case 3:
                            status = "停止中";
                            break;
                        case 4:
                            status = "已停止";
                            break;
                        case 5:
                            status = "启动失败";
                            break;
                        case 6:
                            status = "停止失败";
                            break;
                    }
                    var dbtr= '<tr class="show-tr"><td><div class="contents-table"><table class="table"><tr class="clusterId">\
            <td style="width:5%;text-indent: 30px;"><input type="checkbox" name="chkItem" value="'+servers[i].name+'" aria-expanded="false" val="'+servers[i].id+'" status="'+servers[i].status+'"/></td>\
            <td style="width:20%;white-space:nowrap;"><a href="/detail/'+servers[i].id+'" class="cluster_mirrer_name">' + servers[i].name + '</a></td>\
            <td style="width:10%" id="'+servers[i].name+'status">'+status+'</td>\
            <td style="width:20%;"><span class="cluster_mirrer">' + servers[i].image + '</span></td>\
            <td style="width:34%" id="'+servers[i].name+'id"><a  target="_blank" href="http://'+servers[i].address+'" class="cluster_mirrer_name">'+servers[i].address+'</a>&nbsp;<a target="'+servers[i].address+'" class="showCode" title="点击查看二维码" style="cursor: pointer"><i class="fa fa-external-link-square"></i></a></td>\
            <td style="width:10%" class="tdTimeStrap">'+date+'<i class="fa_time"></i><span></span></td></tr></td></div></table></tr>';

                    $('.content').html(dbtr);

                }
            }
        }
    });

    //时间格式化
    function formatDate(now) {
        var year=now.getFullYear();
        var month=now.getMonth()+1;
        var date=now.getDate();
        var hour=now.getHours();
        var minute=now.getMinutes();
        var second=now.getSeconds();
        return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
    }

})();
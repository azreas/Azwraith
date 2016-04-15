/**
 * Created by HC on 2016/4/8.
 */
(function(){

    //container切换
    $('.create.pushContaienrs').click(function(){
        $('.part01').hide();
        $('.part02').show();
    });
    //创建容器取容器名
    $('#inputSubmit').click(function(){
        var name = $('#search-img').val();  //取镜像名
        if( name === "" ){
            alert("镜像名称不能为空！");
        }else {
            $('.host_step1').hide();
            $('.host_step2').show();
            $('.radius_step').eq(1).addClass('action').siblings().removeClass('action');
            $('.createPadding,.createPadding .go_backs01,.createPadding .two_step,.createPadding #createButton').removeClass('hide');
            //容器配置
            $('.imageName').text(name);
            $('#getImageName').val(name);
            $('#getVersion').val($('.version-text').text());
        }
    });


    //创建
    $('#createButton').click(function(){
        var containerName = $('#containerName').val();
        if ( containerName === "") {
            alert("服务名称不能为空！");
        } else {
            var typeX = $('#createContainerForm>li').eq(3).find('.active>.up_style').text().toLowerCase();
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
            imageDiv = $('<div class="image-item"><span class="img_icon span2"><img src="'+images[i].icon+'"></span><span class="span6 type" type="runtime"><div class="list-item-description"><div class="name h4">'+images[i].name+'<a title="点击查看镜像详情" target="_blank" href="'+images[i].detail+'"><i class="fa fa-external-link-square"></i></a></div><span class="span9" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'+images[i].tag+'</span></div></span><span class="span2"><div class="list-item-description"><span class="pull-deploy btn btn-primary" data-attr="tenxcloud/php">部署<i class="fa fa-arrow-circle-o-right margin fa-lg"></i></span></div></span><input class="container-name" type="hidden" value="'+images[i].name+'"></div>');

            imageDiv.appendTo($('#systemImages'));

            //创建容器取容器名
            $('.list-item-description>.pull-deploy').on('click',function(){
                var name = $(this).parents('.image-item').find('.container-name').val();  //取镜像名
                //console.log(name);

                $('.host_step1').hide();
                $('.host_step2').show();
                $('.radius_step').eq(1).addClass('action').siblings().removeClass('action');
                $('.createPadding,.createPadding .go_backs01,.createPadding .two_step,.createPadding #createButton').removeClass('hide');
                //容器配置
                $('.imageName').text(name);
                //$('#getImageName').val(name);
                $('#getVersion').val($('.version-text').text());

            });
        }
    });
    //添加已创建容器列表
    $.ajax({
        url: '/container/list',
        type: 'GET'

    }).done(function(resp){
        var servers = resp.servers;
        //console.log(servers);
        for(var i in servers){
            //console.log(servers[i].address.ip);
            var titme = new Date(servers[i].createtime);
            var date = formatDate(titme);

            var dbtr=$('<tr class="show-tr"><td><div class="contents-table"><table class="table"><tr class="clusterId">\
        <td style="width:5%;text-indent: 30px;"><input type="checkbox" name="chkItem" value="'+servers[i].name+'" aria-expanded="false" val="'+servers[i].id+'" status="'+servers[i].status+'"/></td>\
        <td style="width:20%;white-space:nowrap;"><b class="caret margin" style="-webkit-transform:rotate(-90deg);transform:rotate(-90deg);"></b><a href="/container/get/'+servers[i].id+'" class="cluster_mirrer_name">' + servers[i].name + '</a></td>\
        <td style="width:10%" id="'+servers[i].name+'status">'+servers[i].status+'</td>\
        <td style="width:20%;"><span class="cluster_mirrer">' + servers[i].image + '</span></td>\
        <td style="width:34%" id="'+servers[i].name+'id"><a target="_blank" href="http://'+servers[i].address.ip+':'+servers[i].address.port+'" class="cluster_mirrer_name">'+servers[i].address.ip+':'+servers[i].address.port+'</a><span class="urlStatus"></span></td>\
        <td style="width:10%" class="tdTimeStrap">'+date+'<input type="hidden" class="timeStrap" value=""><i class="fa_time"></i><span></span></td></tr></td></div></table></tr>');

            dbtr.appendTo($('#dbtable'));



        }

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
    });

    $('#createContainerForm>li>section').click(function(){
        $(this).addClass('active').siblings().removeClass('active');
    });

    //更多操作
    $('a.more').click(function(){
        if($(this).attr('aria-expanded') == 'false'){
            $('.dropdown-menu.drop-left').show();
            $(this).attr('aria-expanded',true);
        }else{
            $('.dropdown-menu.drop-left').hide();
            $(this).attr('aria-expanded',false);
        }

    });
    //全选btnCheckAll
    $('#btnCheckAll').click(function(){
        if($(this).attr('aria-expanded') == 'false'){
            $('input[name="chkItem"]').each(function () {
                $(this).prop('checked',true);
            });
            $('#startContainer').removeClass('cursor-drop').addClass('a-live');
            $('#stopContainer').removeClass('cursor-drop').addClass('a-live');
            $('#scaleCluster').removeClass('cursor-drop').addClass('a-live');
            $('#redeployContainer').removeClass('cursor-drop').addClass('a-live');
            $('#changeConfiguration').removeClass('cursor-drop').addClass('a-live');
            $('#deleteButton').removeClass('cursor-drop').addClass('a-live');
            $('#upgradeCluster').removeClass('cursor-drop').addClass('a-live');
            $(this).attr('aria-expanded',true);
        }else if($(this).attr('aria-expanded') == 'true'){
            $('input[name="chkItem"]').each(function () {
                $(this).prop('checked',false);
            });
            $('#startContainer').removeClass('a-live').addClass('cursor-drop');
            $('#stopContainer').removeClass('a-live').addClass('cursor-drop');
            $('#scaleCluster').removeClass('a-live').addClass('cursor-drop');
            $('#redeployContainer').removeClass('a-live').addClass('cursor-drop');
            $('#changeConfiguration').removeClass('a-live').addClass('cursor-drop');
            $('#deleteButton').removeClass('a-live').addClass('cursor-drop');
            $('#upgradeCluster').removeClass('a-live').addClass('cursor-drop');
            $(this).attr('aria-expanded',false);
        }
    });

    //单选chkItem
    $('#iframe').on('click','input[name="chkItem"]',function(){
        if($(this).prop('checked') == true){
            var status = $(this).attr('status');
            if(status == '运行中'){
                //$('#startContainer').removeClass('cursor-drop').addClass('a-live');
                $('#stopContainer').removeClass('cursor-drop').addClass('a-live');
                $('#scaleCluster').removeClass('cursor-drop').addClass('a-live');
                $('#redeployContainer').removeClass('cursor-drop').addClass('a-live');
                $('#changeConfiguration').removeClass('cursor-drop').addClass('a-live');
                $('#deleteButton').removeClass('cursor-drop').addClass('a-live');
                $('#upgradeCluster').removeClass('cursor-drop').addClass('a-live');
                $(this).attr('aria-expanded',true);
            }else if(status == '已停止'){
                $('#startContainer').removeClass('cursor-drop').addClass('a-live');
                //$('#stopContainer').removeClass('cursor-drop').addClass('a-live');
                $('#scaleCluster').removeClass('cursor-drop').addClass('a-live');
                $('#redeployContainer').removeClass('cursor-drop').addClass('a-live');
                $('#changeConfiguration').removeClass('cursor-drop').addClass('a-live');
                $('#deleteButton').removeClass('cursor-drop').addClass('a-live');
                $('#upgradeCluster').removeClass('cursor-drop').addClass('a-live');
                $(this).attr('aria-expanded',true);
            }

        }else if($(this).prop('checked') == false){
            $(this).prop('checked',false);
            $('#startContainer').removeClass('a-live').addClass('cursor-drop');
            $('#stopContainer').removeClass('a-live').addClass('cursor-drop');
            $('#scaleCluster').removeClass('a-live').addClass('cursor-drop');
            $('#redeployContainer').removeClass('a-live').addClass('cursor-drop');
            $('#changeConfiguration').removeClass('a-live').addClass('cursor-drop');
            $('#deleteButton').removeClass('a-live').addClass('cursor-drop');
            $('#upgradeCluster').removeClass('a-live').addClass('cursor-drop');
            $(this).attr('aria-expanded',false);
        }
    });

    //启动容器
    $('#iframe').on('click','#startContainer',function(){
        if($(this).hasClass('cursor-drop')) return;
        var startCont = [];
        var containerNames = [];
        var displaynames = '';
        $('input[name="chkItem"]:checked').each(function(){
            var containerName = $(this).val();
            var containerId = $(this).attr('val');
            //displaynames += ',' + containerId;
            startCont.push(containerId);
            containerNames.push(containerName);
        });

        $('.dropdown-menu.drop-left').hide();   //隐藏更多操作
        $('a.more').attr('aria-expanded',false);

        containerNames.forEach(function(containerName){
            $('#' + containerName + 'status').html('<i class="fa_createing"></i><span style="color: #FF9C00">启动中<img class="margin" src="/images/loading4.gif"></span>');

        })

        $.ajax({
            url: '/container/start/'+startCont,
            type: 'get'
            //data: JSON.stringify(startCont),
            //contentType: 'application/json',
            //dataType: 'json'
        }).done(function(resp) {
            console.log(resp.app);
            var status = resp.app.status;
            $('input[name="chkItem"]:checked').attr('status',status);
            var ip = resp.app.address.ip;
            var port = resp.app.address.port;

            setTimeout(function () {
                containerNames.forEach(function(containerName){
                    $('#' + containerName + 'status').html('<span>运行中</span>');
                    $('#' + containerName + 'id').html('<a target="_blank" href="http://'+ip+':'+port+'" class="cluster_mirrer_name">'+ip+':'+port+'</a>');

                })
            }, 1000);
        }).fail(function (err) {
            alert('启动失败，请重新启动');
            setTimeout(function () {
                containerNames.forEach(function(containerName){
                    $('#' + containerName + 'status').html('<span>已停止</span>');
                    $('#' + containerName).find('input[name="chkItem"]').attr('status', '-');
                })
            }, 1000);
        });
    });

    //停止容器
    $('#iframe').on('click','#stopContainer',function(){
        if($(this).hasClass('cursor-drop')) return;
        var startCont = [];
        var containerNames = [];
        var displaynames = '';
        $('input[name="chkItem"]:checked').each(function(){
            var containerName = $(this).val();
            var containerId = $(this).attr('val');
            //displaynames += ',' + containerId;
            startCont.push(containerId);
            containerNames.push(containerName);
        });

        $('.dropdown-menu.drop-left').hide();   //隐藏更多操作
        $('a.more').attr('aria-expanded',false);

        containerNames.forEach(function(containerName){
            $('#' + containerName + 'status').html('<i class="fa_createing"></i><span style="color: #FF9C00">停止中<img class="margin" src="/images/loading4.gif"></span>');
        })

        $.ajax({
            url: '/container/stop/'+startCont,
            type: 'get'
            //data: JSON.stringify(startCont),
            //contentType: 'application/json',
            //dataType: 'json'
        }).done(function(resp) {
            var status = resp.app.status;
            $('input[name="chkItem"]:checked').attr('status',status);

            setTimeout(function () {
                containerNames.forEach(function(containerName){
                    $('#' + containerName + 'status').html('<span>已停止</span>');
                })
            }, 1000);
        }).fail(function (err) {
            alert('停止失败，请重新启动');
            setTimeout(function () {
                containerNames.forEach(function(containerName){
                    $('#' + containerName + 'status').html('<span>运行中</span>');
                })
            }, 1000);
        });
    });

    //刷新容器
    //$('#iframe').on('click','#stopContainer',function(){
    //    if($(this).hasClass('cursor-drop')) return;
    //    var startCont = [];
    //    var containerNames = [];
    //    var displaynames = '';
    //    $('input[name="chkItem"]:checked').each(function(){
    //        var containerName = $(this).val();
    //        var containerId = $(this).attr('val');
    //        //displaynames += ',' + containerId;
    //        startCont.push(containerId);
    //        containerNames.push(containerName);
    //    });
    //
    //    $('.dropdown-menu.drop-left').hide();   //隐藏更多操作
    //    $('a.more').attr('aria-expanded',false);
    //
    //    containerNames.forEach(function(containerName){
    //        $('#' + containerName + 'status').html('<i class="fa_createing"></i><span style="color: #FF9C00">停止中<img class="margin" src="/images/loading4.gif"></span>');
    //        $('#' + containerName).find('input[name="chkItem"]').attr('status', '-');
    //    })
    //
    //    $.ajax({
    //        url: '/container/stop/'+startCont,
    //        type: 'get'
    //        //data: JSON.stringify(startCont),
    //        //contentType: 'application/json',
    //        //dataType: 'json'
    //    }).done(function(resp) {
    //        console.log(resp);
    //        setTimeout(function () {
    //            containerNames.forEach(function(containerName){
    //                $('#' + containerName + 'status').html('<span>已停止</span>');
    //                $('#' + containerName).find('input[name="chkItem"]').attr('status', '-');
    //            })
    //        }, 1000);
    //    }).fail(function (err) {
    //        alert('停止失败，请重新启动');
    //        setTimeout(function () {
    //            containerNames.forEach(function(containerName){
    //                $('#' + containerName + 'status').html('<span>运行中</span>');
    //                $('#' + containerName).find('input[name="chkItem"]').attr('status', '-');
    //            })
    //        }, 1000);
    //    });
    //});

    //删除容器
    $('#iframe').on('click','#deleteButton',function(){
        if($(this).hasClass('cursor-drop')) return;
        var startCont = [];
        var containerNames = [];
        var displaynames = '';
        $('input[name="chkItem"]:checked').each(function(){
            var containerName = $(this).val();
            var containerId = $(this).attr('val');
            //displaynames += ',' + containerId;
            startCont.push(containerId);
            containerNames.push(containerName);
        });

        $('.dropdown-menu.drop-left').hide();   //隐藏更多操作
        $('a.more').attr('aria-expanded',false);

        containerNames.forEach(function(containerName){
            $('#' + containerName + 'status').html('<i class="fa_createing"></i><span style="color: #FF9C00">删除中<img class="margin" src="/images/loading4.gif"></span>');
            $('#' + containerName).find('input[name="chkItem"]').attr('status', '-');
        })

        $.ajax({
            url: '/container/stop/'+startCont,
            type: 'get'
            //data: JSON.stringify(startCont),
            //contentType: 'application/json',
            //dataType: 'json'
        }).done(function(resp) {
            console.log(resp);
            setTimeout(function () {
                containerNames.forEach(function(containerName){
                    $('#' + containerName + 'status').html('<span>已删除</span>');
                })
            }, 1000);
        }).fail(function (err) {
            alert('停止失败，请重新启动');
            setTimeout(function () {
                containerNames.forEach(function(containerName){
                    $('#' + containerName + 'status').html('<span>运行中</span>');
                })
            }, 1000);
        });
    });

})();
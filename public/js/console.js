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
        console.log(images);
        for(var i in images){
            var imageDiv;
            imageDiv = $('<div class="image-item"><span class="img_icon span2"><img src="'+images[i].icon+'"></span><span class="span6 type" type="runtime"><div class="list-item-description"><div class="name h4">'+images[i].name+'<a title="点击查看镜像详情" target="_blank" href="'+images[i].detail+'"><i class="fa fa-external-link-square"></i></a></div><span class="span9" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'+images[i].tag+'</span></div></span><span class="span2"><div class="list-item-description"><span class="pull-deploy btn btn-primary" data-attr="tenxcloud/php">部署<i class="fa fa-arrow-circle-o-right margin fa-lg"></i></span></div></span><input class="container-name" type="hidden" value="'+images[i].name+'"></div>');

            imageDiv.appendTo($('#systemImages'));

            //创建容器取容器名
            $('.list-item-description>.pull-deploy').on('click',function(){
                var name = $(this).parents('.image-item').find('.container-name').val();  //取镜像名
                console.log(name);

                $('.host_step1').hide();
                $('.host_step2').show();
                $('.radius_step').eq(1).addClass('action').siblings().removeClass('action');
                $('.createPadding,.createPadding .go_backs01,.createPadding .two_step,.createPadding #createButton').removeClass('hide');
                //容器配置
                $('.imageName').text(name);
                $('#getImageName').val(name);
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
        <td style="width:5%;text-indent: 30px;"><input type="checkbox" name="chkItem" value="'+servers[i].name+'"/></td>\
        <td style="width:20%;white-space:nowrap;"><b class="caret margin" style="-webkit-transform:rotate(-90deg);transform:rotate(-90deg);"></b><a href="/container/get/'+servers[i].id+'" class="cluster_mirrer_name">' + servers[i].name + '</a></td>\
        <td style="width:10%" id="">'+servers[i].status+'</td>\
        <td style="width:20%;"><span class="cluster_mirrer">' + servers[i].image + '</span></td>\
        <td style="width:34%" id=""><a target="_blank" href="http://'+servers[i].address.ip+':'+servers[i].address.port+'" class="cluster_mirrer_name">'+servers[i].address.ip+':'+servers[i].address.port+'</a><span class="urlStatus"></span></td>\
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


})();
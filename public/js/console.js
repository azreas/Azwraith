/**
 * Created by HC on 2016/4/8.
 */
(function(){

    //container切换
    $('.create.pushContaienrs').click(function(){
        $('.part01').hide();
        $('.part02').show();
    });
    //创建容器
    $('.list-item-description>.pull-deploy').click(function(){
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
    //添加已创建容器列表
    $.ajax({
        url: '/container/list',
        type: 'GET'

    }).done(function(resp){
        var servers = resp.servers;
        //console.log(servers);
        for(var i in servers){

            var dbtr=$('<tr class="show-tr"><td><div class="contents-table"><table class="table"><tr class="clusterId">\
        <td style="width:5%;text-indent: 30px;"><input type="checkbox" name="chkItem" value="'+servers[i].name+'"/></td>\
        <td style="width:20%;white-space:nowrap;"><b class="caret margin" style="-webkit-transform:rotate(-90deg);transform:rotate(-90deg);"></b><a href="/container/get/'+servers[i].id+'" class="cluster_mirrer_name">' + servers[i].name + '</a></td>\
        <td style="width:10%" id=""></td>\
        <td style="width:20%;"><span class="cluster_mirrer">' + servers[i].image + '</span></td>\
        <td style="width:34%" id=""><span class="urlStatus"></span></td>\
        <td style="width:10%" class="tdTimeStrap"><input type="hidden" class="timeStrap" value=""><i class="fa_time"></i><span></span></td></tr></td></div></table></tr>');

            dbtr.appendTo($('#dbtable'));
        }
    });

    $('#createContainerForm>li>section').click(function(){
        $(this).addClass('active').siblings().removeClass('active');
    });


})();
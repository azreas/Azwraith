/**
 * Created by HC on 2016/4/8.
 */
(function(){
    $('.foldingpad').click(function(){
        if ($(this).hasClass('rotate')) {
            _unfold(); //展开
        } else {
            _shrink();
        }
    });
    // left nav shrink 收缩
    function _shrink(){
        $('.nav-li').addClass('live-hover');
        $('.foldingpad').addClass('rotate');
        $('.page-container').css('margin-left','55px');
        $('.foldingpad').css('left','65px')
        $('.page-sidebar').css('margin-left','-200px');
        $('.page-small-sidebar').css('margin-left','0px');
        $('.global-notice').css('left','90px')
    }
    // left nav unfold 展开
    function _unfold(){
        $('.nav-li').removeClass('live-hover');
        $('.foldingpad').removeClass('rotate');
        $('.page-container').css('margin-left','200px');
        $('.page-sidebar').css('margin-left','0px');
        $('.page-small-sidebar').css('margin-left','-55px');
        $('.global-notice').css('left','235px')
        $('.foldingpad').css('left','210px')
    }
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
        url: '/container/list/<%= uid %>',
        type: 'GET'

    }).done(function(resp){
        var servers = resp.servers;
        for(var i in servers){
            console.log(servers[i].name);
            console.log(servers[i].image);

            var dbtr=$('<tr class="show-tr"><td><div class="contents-table"><table class="table"><tr class="clusterId">\
        <td style="width:5%;text-indent: 30px;"><input type="checkbox" name="chkItem" value="'+servers[i].name+'"/></td>\
        <td style="width:20%;white-space:nowrap;"><b class="caret margin" style="-webkit-transform:rotate(-90deg);transform:rotate(-90deg);"></b><a href="" class="cluster_mirrer_name">' + servers[i].name + '</a></td>\
        <td style="width:10%" id=""></td>\
        <td style="width:20%;"><span class="cluster_mirrer">' + servers[i].image + '</span></td>\
        <td style="width:34%" id=""><span class="urlStatus"></span></td>\
        <td style="width:10%" class="tdTimeStrap"><input type="hidden" class="timeStrap" value=""><i class="fa_time"></i><span></span></td></tr></td></div></table></tr>');

            dbtr.appendTo($('#dbtable'));
        }
    });



})();
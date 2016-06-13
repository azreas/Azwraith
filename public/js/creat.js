/**
 * Created by HC on 2016/6/13.
 */
(function () {
    //执行命令选择
    $('.execmd').click(function () {
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
    //创建容器取容器名
    $('.dialog').on('click', '.list-item-description>.pull-deploy', function () {
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
    $('.editEnv').on('click', '.addEnv', function () {
        envDiv = $('<div class="envRow"><div style="width: 35%"><input placeholder="name" class="envName" type="text" name="envName"></div><div style="width: 35%;margin-left:4px"><input placeholder="value" class="envVal" type="text" name="envVal"></div><div style="width: 10%;margin-left:4px"><span class="addEnv cursor" data-toggle="tooltip" data-placement="top" title="" data-original-title="添加"><i class="fa fa-plus"></i></span>&nbsp;&nbsp;<span class="removeEnv cursor" style="margin-left: 8px" data-toggle="tooltip" data-placement="top" title="" data-original-title="删除"><i class="fa fa-times"></i></span></div></div>');
        envDiv.appendTo($('.editEnv'));
    });
    $('.editEnv').on('click', '.removeEnv', function () {
        var envlength = $('.editEnv .envRow').length;
        if (envlength == 1) {
            layer.msg('最后一条不能删除');
        } else {
            $(this).parents('.envRow').remove();
        }
    });
    //创建
    $('#createButton').click(function () {
        var name = $('#containerName').val();
        var envName = $('.envName');
        var envVal = $('.envVal');
        if (!name || name.length < 1) {
            layer.tips('容器名称不能为空', '#containerName', {tips: [1, '#3595CC']});
            $('#containerName').focus();
            return;
        }
        name = name.toLowerCase();
        if (name.search(/^[a-z][a-z0-9-]*$/) === -1) {
            layer.tips('容器名称只能由字母、数字及横线组成，且首字母不能为数字及横线。', '#containerName', {tips: [1, '#3595CC'], time: 3000});
            $('#containerName').focus();
            return;
        }
        if (name.length > 50 || name.length < 3) {
            layer.tips('容器名称为3~50个字符', '#containerName', {tips: [1, '#3595CC'], time: 3000});
            $('#containerName').focus();
            return;
        } else {
            var typeX = $('#createContainerForm>li').eq(2).find('.active>.up_style').text().toLowerCase();
            $('#typeX').val(typeX);
            //alert($('#typeX').val());
            $("#createContainerForm").submit();
        }
    });
    $('.createPadding .two_step').click(function () {
        $('.host_step2').hide();
        $('.host_step3').removeClass('hide');
        $('.radius_step').eq(2).addClass('action').siblings().removeClass('action');
        $('.createPadding .go_backs01').addClass('hide');
        $('.createPadding .go_backs02').removeClass('hide');
    });
    $('.go_backs01').click(function () {
        $('.host_step1').show();
        $('.host_step2').hide();
        $('.radius_step').eq(0).addClass('action').siblings().removeClass('action');
        $('.createPadding,.createPadding .go_backs01,.createPadding .two_step,.createPadding #createButton').addClass('hide');
    });
    $('.go_backs02').click(function () {
        $('.host_step2').show();
        $('.host_step3').addClass('hide');
        $('.radius_step').eq(1).addClass('action').siblings().removeClass('action');
        $('.createPadding .go_backs02').addClass('hide');
        $('.createPadding .go_backs01').removeClass('hide');
    });
    //选择镜像来源
    $('.choose').click(function () {
        $(this).addClass('action').siblings().removeClass('action');
        var index = $(this).index();
        $('.dialog .blankApp').eq(index).removeClass('hidden').siblings().addClass('hidden');
    });
    //获取本地镜像
    var imagesInfo;
    $.ajax({
        url: '/image/list/label/kind',
        type: 'GET'
    }).done(function (resp) {
        //console.log(resp);
        imagesInfo = resp.data;
        var cDate = new Date();
        var date = formatDate(cDate);
        for (var i in imagesInfo) {
            var imageDiv;
            imageDiv = $('<div class="image-item col-xs-6 col-sm-6" style="padding-bottom: 20px;"><span class="img_icon span5" style="width: 80px;height:80px;margin: 25px 10px 25px 0;"><img src="' + imagesInfo[i].icon + '"></span><span class="span5 type" type="runtime"><div class="list-item-description"><div class="name h4" style="height: 38px;overflow: hidden;">镜像名称：' + imagesInfo[i].name + '<a title="点击查看镜像详情" target="_blank" href="' + imagesInfo[i].detail + '"><i class="fa fa-external-link-square"></i></a></div><span class="span9" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">版本：' + imagesInfo[i].tag + '</span><span class="span9" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + date + '</span></div></span><span class="span2"><div class="list-item-description"><span class="pull-deploy btn btn-primary">部署<i class="fa fa-arrow-circle-o-right margin fa-lg"></i></span></div></span><input class="container-name" type="hidden" value="' + imagesInfo[i].name + '"></div>');
            imageDiv.appendTo($('#systemImages'));
        }
    });
    //获取我的构建镜像
    $('.my-img').on('click', function () {
        $.ajax({
            url: '/image/list/all',
            type: 'GET'
        }).done(function (resp) {
            console.log(resp);
            //if (resp.info.code == 11) {
            //    $('#dbtable').html('');
            //    //var tips = '<div id="nodata" class="nodata" style="display: block;padding-top:20px">服务列表加载失败，请刷新页面</div>';
            //    var tips = '<div id="nodata" class="nodata" style="display: block;padding-top:20px">提示：点击上方"+创建"按钮创建容器应用。</div><div style="color:#FF9900;margin: 15px 30px;"><i class="fa fa-hand-o-right"></i> Tips: <span style="color:#FF9900;font-size:20px">您当前还未创建服务，您可以新建一个服务</span></div>';
            //    $('#dbtable').html(tips);
            //}
        });
    });
    //搜索dockerhub镜像
    $('button[type="submit"]').click(function () {
        var searchName = $('#search-img').val();
        if (searchName == '') {
            layer.msg('请输入您想要搜索的镜像名称');
        } else {
            $('#searchImages').removeClass('hideimage');
            $('#searchImages').html('<i class="fa_createing"></i><span style="color: #FF9C00">搜索中<img class="margin" src="/images/loading4.gif"></span>');
            $.ajax({
                url: '/image/search/' + searchName,
                type: 'GET'
            }).done(function (resp) {
                //console.log(resp);
                if (resp.result == false || resp.data.length == 0) {
                    $('#searchImages').html('<div id="nodata"><i>未找到您搜索的镜像，请稍后重试...</i></div>');
                } else if (resp.result == true) {
                    $('#searchImages').html('');
                    var cDate = new Date();
                    var date = formatDate(cDate);
                    var images = resp.data;
                    for (var i in images) {
                        var imageDiv;
                        imageDiv = $('<div class="image-item col-xs-6 col-sm-6"  style="padding-bottom: 20px;"><span class="img_icon span5"  style="width: 80px;height:80px;margin: 25px 10px 25px 0;"><img src="/images/blue-large.png"></span><span class="span5 type" type="runtime"><div class="list-item-description"><div class="name h4" style="height: 38px;overflow: hidden;">镜像名称：' + images[i].name + '<a title="点击查看镜像详情" target="_blank"><i class="fa fa-external-link-square"></i></a></div><span class="span9" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">描述：' + images[i].description + '</span><span class="span9" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + date + '</span></div></span><span class="span2"><div class="list-item-description"><span class="pull-deploy btn btn-primary">部署<i class="fa fa-arrow-circle-o-right margin fa-lg"></i></span></div></span><input class="container-name" type="hidden" value="' + images[i].name + '"></div>');
                        imageDiv.appendTo($('#searchImages'));
                    }
                }
            });
        }
    });
    //容器配置选择
    $('#createContainerForm>li>section').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
    });
    //限制创建容器个数
    var text = document.getElementById("ins-number");
    text.onkeyup = function () {
        if (text.value > 10) {
            //this.value=this.value.replace(/\D/g,'');
            text.value = 10;
            layer.msg('实例数量上限为10');
        }
    };
    //时间格式化
    function formatDate(now) {
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    }
})();
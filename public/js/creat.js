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
        $('.createPadding').addClass('hide');
        $('#home-main .createPadding,.createPadding .go_backs01,.createPadding .two_step,.createPadding #createButton').removeClass('hide');
        //容器配置
        $('.imageName').text(name);
        $('#getImageName').val(name);
        $('#getVersion').val($('.version-text').text());
    });
    $('.dialog').on('click', 'span[data-placement="right"]', function () {
        var name = $(this).parent('td').find('input[data-toggle="imgName"]').val();  //取镜像名
        var createImageName = $(this).parent('td').find('input[data-toggle="createImageName"]').val();
        var status = $(this).parent('td').find('input[data-toggle="id"]').val();
        if (status === '-1') {
            layer.msg('抱歉！您的镜像构建失败，请重新构建或者删除');
        } else if (status === '0') {
            layer.msg('抱歉！您的镜像正在构建中，请等候');
        } else if (status === '1') {
            $('.host_step1').hide();
            $('.host_step2').show();
            $('.radius_step').eq(1).addClass('action').siblings().removeClass('action');
            $('.createPadding').addClass('hide');
            $('#home-main .createPadding,.createPadding .go_backs01,.createPadding .two_step,.createPadding #createButton').removeClass('hide');
            //容器配置
            $('.imageName').text(name);
            $('#getImageName').val(createImageName);
            $('#getVersion').val($('.version-text').text());
        }
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
    $('.go_backs01').click(function () {
        $('.host_step1').show();
        $('.host_step2').hide();
        $('.radius_step').eq(0).addClass('action').siblings().removeClass('action');
        $('.createPadding').removeClass('hide');
        $('#home-main .createPadding,.createPadding .go_backs01,.createPadding .two_step,.createPadding #createButton').addClass('hide');
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
    $.ajax({
        url: '/image/list/build',
        type: 'GET'
    }).done(function (resp) {
        console.log(resp);
        if (resp == '') {
            $('.showlist .itemTable #projectsBody').html('');
            //var tips = '<div id="nodata" class="nodata" style="display: block;padding-top:20px">服务列表加载失败，请刷新页面</div>';
            var tips = '<div id="nodata" class="nodata" style="display: block;padding-top:20px">提示：点击上方"快速构建"按钮构建自己的镜像。</div><div style="color:#FF9900;margin: 15px 30px;"><i class="fa fa-hand-o-right"></i> Tips: <span style="color:#FF9900;font-size:20px">您当前还未构建自己的镜像，您可以新建一个自己的镜像</span></div>';
            $('.showlist .itemTable #projectsBody').html(tips);
        } else {
            $('.showlist .itemTable #projectsBody').html('');
            for (var i in resp) {
                var status;
                var statuslogo;
                var cDate = new Date(resp[i].createdate);
                var date = formatDate(cDate);
                switch (resp[i].status) {
                    //1.启动中，2.运行中，3.停止中，4.已停止,5.启动失败,6.停止失败
                    case 1:
                        status = "成功";
                        statuslogo = "fa_run";
                        break;
                    case -1:
                        status = "失败";
                        statuslogo = "fa_stop";
                        break;
                    case 0:
                        status = "构建中";
                        statuslogo = "fa_createing";
                        break;
                }
                var part = '<tr> <td> <div class="content-table"> <table class="table tables"> <tbody> <tr class="ci-listTr" style="cursor:auto" id="2c9af4db-7077-467f-b3ff-3ab472e7494c" tag="latest"> <td style="width: 15%; text-indent:22px;"> <a style="width: 108px;display: inline-block;word-wrap: break-word;text-indent: 0px;">' + resp[i].name + '</a> </td> <td style="width: 12%;"> <i class="' + statuslogo + '"></i> <span>' + status + '</span> <input type="hidden" id="' + resp[i].id + '" value="' + resp[i].status + '"></td> <td style="width: 15%;"> <a data-toggle="tooltip" data-placement="left" title="" target="_blank" href="' + resp[i].gitAddress + '" data-original-title="查看源代码"> <span class="bj-code-source"> <i class="fa fa-github fa-lg"></i> github </span> </a> </td> <td style="width: 15%;"> <span>' + date + '</span> </td> <td style="width:18%"> <span class="bj-green" data-toggle="tooltip" data-placement="right" title="" data-original-title="部署"> 部署 </span>&nbsp;&nbsp;<span class="bj-green" id="delete-build" data-id="' + resp[i].id + '" style="background:#ff9500"> 删除 </span> <input type="hidden" data-toggle="createImageName" value="' + resp[i].createImageName + '"> <input type="hidden" data-toggle="imgName" value="' + resp[i].name + '"><input type="hidden" data-toggle="id" value="' + resp[i].status + '"> </td> </tr> </tbody> </table> </div> </td> </tr>';
                $('.showlist .itemTable #projectsBody').append(part);
            }
        }
    });
    setInterval(function () {
        $.ajax({
            url: '/image/list/build',
            type: 'GET'
        }).done(function (resp) {
            if (resp == '') {

            } else {
                for (var i in resp) {
                    var id = resp[i].id;
                    var status = resp[i].status;
                    var statu = $('#' + id).val();
                    if (status == statu) {
                    } else {
                        $('#' + id).val(status);
                        var s, l;
                        switch (status) {
                            //1.启动中，2.运行中，3.停止中，4.已停止,5.启动失败,6.停止失败
                            case 1:
                                s = "成功";
                                l = "fa_run";
                                break;
                            case -1:
                                s = "失败";
                                l = "fa_stop";
                                break;
                            case 0:
                                s = "构建中";
                                l = "fa_createing";
                                break;
                        }
                        $('#' + id).siblings().remove();
                        var part = '<i class="' + l + '"></i> <span>' + s + '</span>';
                        $('#' + id).before(part);
                    }
                }
            }
        });
    }, 5000);
    //删除构建镜像
    $('.dialog').on('click', 'span[id="delete-build"]', function () {
        var buildId = $(this).attr('data-id');
        layer.confirm('确定删除容器', {
            icon: 3,
            btn: ['确定', '取消']
        }, function (index) {
            layer.close(index);
            $.ajax({
                url: '/image/build/' + buildId,
                type: 'delete'
            }).done(function (resp) {
                if (resp.result === true) {
                    layer.msg('删除成功');
                    $('#' + buildId).parents('.content-table').parents('tr').remove();
                } else {
                    layer.msg('删除失败，请重新删除');
                }
            });
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
    //镜像选择定位
    var tag = $('#tag').val();
    if (tag === '2') {
        $('.choose').eq(1).addClass('action').siblings().removeClass('action');
        $('.dialog .blankApp').eq(1).removeClass('hidden').siblings().addClass('hidden');
    }
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
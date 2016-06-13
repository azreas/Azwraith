/**
 * Created by HC on 2016/4/8.
 */
(function () {
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
    //添加已创建服务列表
    //预添加加载图标
    $('#dbtable').html('<img style="position:absolute;top:40%;left:4%" src="/images/loading-little.gif">');
    $.ajax({
        url: '/container/list',
        type: 'GET'
    }).done(function (resp) {
        var servers = resp.apps;
        if (resp == 0) {
            layer.msg("请求超时，请重新登录。");
            setTimeout(function () {
                location.href = '/login';
            }, 2000);
        }
        if (resp.info.code == 11) {
            $('#dbtable').html('');
            //var tips = '<div id="nodata" class="nodata" style="display: block;padding-top:20px">服务列表加载失败，请刷新页面</div>';
            var tips = '<div id="nodata" class="nodata" style="display: block;padding-top:20px">提示：点击上方"+创建"按钮创建容器应用。</div><div style="color:#FF9900;margin: 15px 30px;"><i class="fa fa-hand-o-right"></i> Tips: <span style="color:#FF9900;font-size:20px">您当前还未创建服务，您可以新建一个服务</span></div>';
            $('#dbtable').html(tips);
        } else {
            $('#dbtable').html('');
            for (var i in servers) {
                //console.log(servers[i].address.ip);
                var time = new Date(servers[i].createtime);
                var date = formatDate(time);
                var status = "";
                var deleteFlag = servers[i].deleteFlag;
                if (deleteFlag == '1') {

                } else {
                    switch (servers[i].status) {
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
                    var imageName = '/images/blue-large.png';
                    for (var k in imagesInfo) {
                        if (servers[i].image == imagesInfo[k].name) {
                            imageName = imagesInfo[k].icon;
                        }
                    }
                    appAppend(imageName);
                    function appAppend(imageName) {
                        var dbtr = $('<div class="image-item col-xs-6 col-sm-6"> <span style="position: absolute;top: 25px;right: 25px;"> <input type="checkbox" name="chkItem" value="' + servers[i].name + '" aria-expanded="false" val="' + servers[i].id + '" status="' + servers[i].status + '"> </span> <span class="img_icon span4" style="text-align: inherit;width:34%;margin: 25px 10px 25px 0;max-width:138px"> <img src="' + imageName + '"> </span> <span class="span6 type" type="runtime"> <div class="list-item-description"> <div class="name h4"> 服务名称：' + servers[i].name + ' </div> <span class="span9" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"> 镜像名：' + servers[i].image + ' </span> <span class="span9" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"> 状态：<span id="' + servers[i].name + 'status">' + status + ' </span></span> <span class="span9" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"> 地址：<a  target="_blank" href="http://' + servers[i].address + '" class="cluster_mirrer_name">' + servers[i].address + '</a><span class="span9">查看二维码：<a target="' + servers[i].address + '" class="showCode" title="点击查看二维码" style="cursor: pointer"><i class="fa fa-external-link-square"></i></a></span> </span> <span class="span9" style="margin: 10px 0;"><a class="btn btn-info" href="/detail/' + servers[i].id + '">查看服务详情</a></span> </div> </span> </div>');
                        dbtr.appendTo($('#dbtable'));
                    }
                }
            }
        }
    });
    //显示二维码
    $("#dbtable").on('click', '.showCode', function () {
        var code = $(this).attr('target');
        if (code == "-") {
            return;
        } else {
            $("#qrcode").addClass("show");
            $("#codeBox").addClass("show");
            var qrcode = new QRCode("qrcode", {
                text: "http://" + code,
                width: 400,
                height: 400,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }
    });
    $("#codeBox").click(function () {
        $("#qrcode").removeClass("show");
        $("#codeBox").removeClass("show");
        $("#qrcode canvas,#qrcode img").remove();
    });
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
    //更多操作
    $('a.more').click(function () {
        if ($(this).attr('aria-expanded') == 'false') {
            $('.dropdown-menu.drop-left').show();
            $(this).attr('aria-expanded', true);
        } else {
            $('.dropdown-menu.drop-left').hide();
            $(this).attr('aria-expanded', false);
        }
    });
    //全选btnCheckAll
    $('#btnCheckAll').click(function () {
        if ($(this).attr('aria-expanded') == 'false') {
            $('input[name="chkItem"]').each(function () {
                $(this).prop('checked', true);
            });
            $('#startContainer').removeClass('cursor-drop').addClass('a-live');
            $('#stopContainer').removeClass('cursor-drop').addClass('a-live');
            $('#scaleCluster').removeClass('cursor-drop').addClass('a-live');
            $('#redeployContainer').removeClass('cursor-drop').addClass('a-live');
            $('#changeConfiguration').removeClass('cursor-drop').addClass('a-live');
            $('#deleteButton').removeClass('cursor-drop').addClass('a-live');
            $('#upgradeCluster').removeClass('cursor-drop').addClass('a-live');
            $(this).attr('aria-expanded', true);
        } else if ($(this).attr('aria-expanded') == 'true') {
            $('input[name="chkItem"]').each(function () {
                $(this).prop('checked', false);
            });
            $('#startContainer').removeClass('a-live').addClass('cursor-drop');
            $('#stopContainer').removeClass('a-live').addClass('cursor-drop');
            $('#scaleCluster').removeClass('a-live').addClass('cursor-drop');
            $('#redeployContainer').removeClass('a-live').addClass('cursor-drop');
            $('#changeConfiguration').removeClass('a-live').addClass('cursor-drop');
            $('#deleteButton').removeClass('a-live').addClass('cursor-drop');
            $('#upgradeCluster').removeClass('a-live').addClass('cursor-drop');
            $(this).attr('aria-expanded', false);
        }
    });
    //单选chkItem
    $('#dbtable').on('click', 'input[name="chkItem"]', function () {
        if ($(this).prop('checked') == true) {
            var status = $(this).attr('status');
            if (status == '1' || status == '2') {
                //$('#startContainer').removeClass('cursor-drop').addClass('a-live');
                $('#stopContainer').removeClass('cursor-drop').addClass('a-live');
                $('#scaleCluster').removeClass('cursor-drop').addClass('a-live');
                $('#redeployContainer').removeClass('cursor-drop').addClass('a-live');
                $('#changeConfiguration').removeClass('cursor-drop').addClass('a-live');
                $('#deleteButton').removeClass('cursor-drop').addClass('a-live');
                $('#upgradeCluster').removeClass('cursor-drop').addClass('a-live');
                $(this).attr('aria-expanded', true);
            } else if (status == '3' || status == '4' || status == '5' || status == '6') {
                $('#startContainer').removeClass('cursor-drop').addClass('a-live');
                //$('#stopContainer').removeClass('cursor-drop').addClass('a-live');
                $('#scaleCluster').removeClass('cursor-drop').addClass('a-live');
                $('#redeployContainer').removeClass('cursor-drop').addClass('a-live');
                $('#changeConfiguration').removeClass('cursor-drop').addClass('a-live');
                $('#deleteButton').removeClass('cursor-drop').addClass('a-live');
                $('#upgradeCluster').removeClass('cursor-drop').addClass('a-live');
                $(this).attr('aria-expanded', true);
            }
        } else if ($(this).prop('checked') == false) {
            $(this).prop('checked', false);
            $('#startContainer').removeClass('a-live').addClass('cursor-drop');
            $('#stopContainer').removeClass('a-live').addClass('cursor-drop');
            $('#scaleCluster').removeClass('a-live').addClass('cursor-drop');
            $('#redeployContainer').removeClass('a-live').addClass('cursor-drop');
            $('#changeConfiguration').removeClass('a-live').addClass('cursor-drop');
            $('#deleteButton').removeClass('a-live').addClass('cursor-drop');
            $('#upgradeCluster').removeClass('a-live').addClass('cursor-drop');
            $(this).attr('aria-expanded', false);
        }
    });
    //启动容器
    $('#iframe').on('click', '#startContainer', function () {
        if ($(this).hasClass('cursor-drop')) return;
        var startCont = [];
        var containerNames = [];
        var displaynames = '';
        $('input[name="chkItem"]:checked').each(function () {
            var containerName = $(this).val();
            var containerId = $(this).attr('val');
            //displaynames += ',' + containerId;
            startCont.push(containerId);
            containerNames.push(containerName);
        });
        $('.dropdown-menu.drop-left').hide();   //隐藏更多操作
        $('a.more').attr('aria-expanded', false);
        containerNames.forEach(function (containerName) {
            $('#' + containerName + 'status').html('<i class="fa_createing"></i><span style="color: #FF9C00">启动中<img class="margin" src="/images/loading4.gif"></span>');
        });
        $.ajax({
            url: '/container/start/' + startCont,
            type: 'get'
            //data: JSON.stringify(startCont),
            //contentType: 'application/json',
            //dataType: 'json'
        }).done(function (resp) {
            //console.log(resp);
            if (resp.result == true) {
                var status = '2';
                $('input[name="chkItem"]:checked').attr('status', status);
                $('input[name="chkItem"]:checked').prop('checked', false);
            }
            window.location.reload();
            setTimeout(function () {
                containerNames.forEach(function (containerName) {
                    $('#' + containerName + 'status').html('<span>运行中</span>');
                    $('#' + containerName + 'id').html('<a target="_blank" href="http://' + resp.address + '" class="cluster_mirrer_name">' + resp.address + '</a>');
                })
            }, 1000);
        }).fail(function (err) {
            layer.msg('启动失败，请重新启动');
            setTimeout(function () {
                containerNames.forEach(function (containerName) {
                    $('#' + containerName + 'status').html('<span>已停止</span>');
                })
            }, 1000);
        });
    });
    //停止容器
    $('#iframe').on('click', '#stopContainer', function () {
        if ($(this).hasClass('cursor-drop')) return;
        var startCont = [];
        var containerNames = [];
        var displaynames = '';
        $('input[name="chkItem"]:checked').each(function () {
            var containerName = $(this).val();
            var containerId = $(this).attr('val');
            //displaynames += ',' + containerId;
            startCont.push(containerId);
            containerNames.push(containerName);
        });
        $('.dropdown-menu.drop-left').hide();   //隐藏更多操作
        $('a.more').attr('aria-expanded', false);
        containerNames.forEach(function (containerName) {
            $('#' + containerName + 'status').html('<i class="fa_createing"></i><span style="color: #FF9C00">停止中<img class="margin" src="/images/loading4.gif"></span>');
        });
        $.ajax({
            url: '/container/stop/' + startCont,
            type: 'get'
            //data: JSON.stringify(startCont),
            //contentType: 'application/json',
            //dataType: 'json'
        }).done(function (resp) {
            //console.log(resp);
            if (resp.result == true) {
                var status = '4';
                $('input[name="chkItem"]:checked').attr('status', status);
                $('input[name="chkItem"]:checked').prop('checked', false);
            }
            window.location.reload();
            setTimeout(function () {
                containerNames.forEach(function (containerName) {
                    $('#' + containerName + 'status').html('<span>已停止</span>');
                    $('#' + containerName + 'id').html('<a target="_blank" href="javascript:void(0)">-</a>');
                })
            }, 1000);
        }).fail(function (err) {
            layer.msg('停止失败，请重新启动');
            setTimeout(function () {
                containerNames.forEach(function (containerName) {
                    $('#' + containerName + 'status').html('<span>运行中</span>');
                })
            }, 1000);
        });
    });
    //删除容器
    $('#iframe').on('click', '#deleteButton', function () {
        if ($(this).hasClass('cursor-drop')) return;
        //弹出是否删除框
        layer.confirm('确定删除容器', {
            icon: 3,
            btn: ['确定', '取消']
        }, function (index) {
            layer.close(index);
            var startCont = [];
            var containerNames = [];
            $('input[name="chkItem"]:checked').each(function () {
                var containerName = $(this).val();
                var containerId = $(this).attr('val');
                //displaynames += ',' + containerId;
                startCont.push(containerId);
                containerNames.push(containerName);
            });
            $('.dropdown-menu.drop-left').hide();   //隐藏更多操作
            $('a.more').attr('aria-expanded', false);
            containerNames.forEach(function (containerName) {
                $('#' + containerName + 'status').html('<i class="fa_createing"></i><span style="color: #FF9C00">删除中<img class="margin" src="/images/loading4.gif"></span>');
            });
            $.ajax({
                url: '/container/recycle/' + startCont,
                type: 'get'
                //data: JSON.stringify(startCont),
                //contentType: 'application/json',
                //dataType: 'json'
            }).done(function (resp) {
                //console.log(resp);
                if (resp.result == true) {
                    layer.msg('删除成功');
                    $('input[name="chkItem"]:checked').parents('.image-item').remove();

                    window.location.reload();
                } else if (resp.result == false) {
                    layer.msg('删除失败');
                }
            });
            $('.dropdown-menu.drop-left').hide();   //隐藏更多操作
            $('a.more').attr('aria-expanded', false);
        });
    });
})();
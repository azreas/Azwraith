(function () {

    $('.nav-menu li').eq(1).addClass('item-click');

    $('.baseInfo a').click(function () {
        $(this).addClass('btn-prim').siblings().removeClass('btn-prim');
        var index_a = $(this).index();
        $('#detail-content-box>div').eq(index_a).show().siblings().hide();
    });

    $(document).on('click', '.event-sign', function () {
        if (!$(this).hasClass('live')) {
            $(this).addClass('live');
            $(this).parent().siblings('.time-line-message').slideDown();
        } else {
            $(this).removeClass('live');
            $(this).parent().siblings('.time-line-message').slideUp();
        }
    });
    $(document).on('click', '.event-title', function () {

        if (!$(this).hasClass('live')) {
            $(this).addClass('live').find('.event-sign').addClass('live');

            $(this).find('.time-line-message').slideDown('fast');
        } else {
            $(this).removeClass('live').find('.event-sign').removeClass('live');
            $(this).find('.time-line-message').slideUp('fast');
        }
        return false;
    });


    var containerid = $('#containerId').val();  //获取服务ID
    //console.log(containerid);

    //根据服务ID更新事件
    $.ajax({
        url: '/container/instance/event/list/' + containerid,
        type: 'GET'
    }).done(function (resp) {
        var events = resp.appevents;
        // console.log(events);
        // console.log(resp);
        var html = '';
        for (var i in events) {
            var titme = new Date(events[i].titme);
            var date = formatDate(titme);
            //console.log(date);

            if(events[i].status == 1){
                html += '<div class="event"><div class="event-line"><div class="event-status success"><i class="fa fa-check note"></i></div><div class="time-line-content"><div class="time-line-reason event-title"><div class="title-name success">' + events[i].event + '</div><div class="time-line-time"><div class="event-sign"><i class="fa fa-angle-right fa_caret"></i></div><div class="datetimes">' + date + '</div></div><div class="time-line-message" style="display: none;"><p class="list-times">时间：' + date + '</p><p class="list-conent">信息：' + events[i].script + '</p></div></div></div></div></div>';
            }else if(events[i].status == 2){
                html += '<div class="event"><div class="event-line"><div class="event-status error"><i class="fa fa-times note"></i></div><div class="time-line-content"><div class="time-line-reason event-title"><div class="title-name error">' + events[i].event + '</div><div class="time-line-time"><div class="event-sign"><i class="fa fa-angle-right fa_caret"></i></div><div class="datetimes">' + date + '</div></div><div class="time-line-message" style="display: none;"><p class="list-times">时间：' + date + '</p><p class="list-conent">信息：' + events[i].script + '</p></div></div></div></div></div>';
            }

            $('.containerEvent').html(html);

        }
    });
    setInterval(function () {
        $.ajax({
            url: '/container/instance/event/list/' + containerid,
            type: 'GET'
        }).done(function (resp) {
            var events = resp.appevents;
            //console.log(events);
            var html = '';
            for (var i in events) {
                var titme = new Date(events[i].titme);
                var date = formatDate(titme);
                //console.log(date);

                if(events[i].status == 1){
                    html += '<div class="event"><div class="event-line"><div class="event-status success"><i class="fa fa-check note"></i></div><div class="time-line-content"><div class="time-line-reason event-title"><div class="title-name success">' + events[i].event + '</div><div class="time-line-time"><div class="event-sign"><i class="fa fa-angle-right fa_caret"></i></div><div class="datetimes">' + date + '</div></div><div class="time-line-message" style="display: none;"><p class="list-times">时间：' + date + '</p><p class="list-conent">信息：' + events[i].script + '</p></div></div></div></div></div>';
                }else if(events[i].status == 2){
                    html += '<div class="event"><div class="event-line"><div class="event-status error"><i class="fa fa-times note"></i></div><div class="time-line-content"><div class="time-line-reason event-title"><div class="title-name error">' + events[i].event + '</div><div class="time-line-time"><div class="event-sign"><i class="fa fa-angle-right fa_caret"></i></div><div class="datetimes">' + date + '</div></div><div class="time-line-message" style="display: none;"><p class="list-times">时间：' + date + '</p><p class="list-conent">信息：' + events[i].script + '</p></div></div></div></div></div>';
                }

                $('.containerEvent').html(html);
            }
        });
    }, 5000);

    //根据服务ID更新实例列表
    setInterval(function () {
        $.ajax({
            url: '/container/list/' + containerid,
            type: 'get'
        }).done(function (resp) {
            //console.log(resp);
            //console.log(resp.containers[0]);
            var containers = resp.containers;
            var html = '';
            for (var i in containers) {
                var containerCreat = new Date(containers[i].createtime);
                var containerCreatTime = formatDate(containerCreat);
                var status = "";
                switch (containers[i].status) {
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
                html += "<tr>";
                html += "<td><a href='/container/instance/" + containers[i].appid + "/" + containers[i].id + "'><span id='containerName'>" + containers[i].name + "</span></a></td>";
                html += "<td><span id='containerStatus'>" + status + "</span></td>";
                html += "<td><span class='image-name'></span></td>";
                html += "<td><a href='http://" + containers[i].inaddress.ip + ":" + containers[i].inaddress.port + "' target='_blank'><span id='inaddress'>" + containers[i].inaddress.ip + ":" + containers[i].inaddress.port + "</span></a></td>";
                html += "<td><a href='http://" + containers[i].outaddress.ip + ":" + containers[i].outaddress.port + "' target='_blank'><span id='outaddress'>" + containers[i].outaddress.ip + ":" + containers[i].outaddress.port + "</span></a></td>";
                html += "<td><span id='containerCreatTime'>" + containerCreatTime + "</span></td>";
                html += "</tr>";

                $(".BORDER-TR").html(html);

                $('.image-name').text($('.imageName').text());
            }
        }).fail(function (err) {
            console.log(err);
        });

    }, 3000);

    //根据服务ID实时更新服务详情数据
    $.ajax({
        url: '/container/get/' + containerid,
        type: 'get'
    }).done(function (resp) {
        //console.log(resp);
        //console.log(resp.iamgeName);
        var autoscale = resp.autoscale;
        var update = new Date(resp.updateTime);
        var updateTime = formatDate(update);
        var create = new Date(resp.createTime);
        var createTime = formatDate(create);
        var status = "";
        switch (resp.status) {
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
        $('#memory').html(resp.memory);
        $('#CPU').html(resp.cpu);
        $('#severName').html(resp.name);
        $('.imageName').html(resp.image);
        $('#status').html(status);
        $('#address').html(resp.address);
        $('#address').parent().attr('href', 'http://' + resp.address);
        $('#updateTime').html(updateTime);
        $('#createTime').html(createTime);
        if (resp.iamgeName == 'alexwhen/docker-2048') {
            $('#containerImg').attr('src', '/images/image/2048.png');
        } else if (resp.iamgeName == 'zerosky/emt') {
            $('#containerImg').attr('src', '/images/image/emt.png');
        } else {
            $('#containerImg').attr('src', 'https://hub.docker.com/public/images/official/' + resp.iamgeName + '.png');
        }
        for (var k in resp.environment) {
            //console.log(resp.environment[k][0]);
            //console.log(resp.environment[k][1]);
            var elem = $('<tr class="envRow new"><td id="envName">' + resp.environment[k][0] + '</td><td id="envVal">' + resp.environment[k][1] + '</td></tr>');

            elem.appendTo($('#envList .BORDER'));
        }

        //获取容器伸缩数
        if(autoscale == "true"){
            $('.applocation').removeClass('hide');
            $.ajax({
                url: '/container/scalecontainer/list/' + containerid,
                type: 'GET'
            }).done(function (resp) {
                console.log(resp);
                if(resp.result == true){
                    $('.open').text(resp.containers.length);
                }else if(resp.result == false){
                    $('.open').text('0');
                }
            });
        }

    }).fail(function (err) {
        console.log(err);
    });
    setInterval(function () {
        $.ajax({
            url: '/container/get/' + containerid,
            type: 'get'
        }).done(function (resp) {
            //console.log(resp);
            //console.log(resp.name);
            var autoscale = resp.autoscale;
            var update = new Date(resp.updateTime);
            var updateTime = formatDate(update);
            var create = new Date(resp.createTime);
            var createTime = formatDate(create);
            var status = "";
            switch (resp.status) {
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
            $('#memory').html(resp.memory);
            $('#CPU').html(resp.cpu);
            $('#severName').html(resp.name);
            $('.imageName').html(resp.image);
            $('#status').html(status);
            $('#address').html(resp.address);
            $('#address').parent().attr('href', 'http://' + resp.address);
            $('#updateTime').html(updateTime);
            $('#createTime').html(createTime);
            if (resp.iamgeName == 'alexwhen/docker-2048') {
                $('#containerImg').attr('src', '/images/image/2048.png');
            } else if (resp.iamgeName == 'zerosky/emt') {
                $('#containerImg').attr('src', '/images/image/emt.png');
            } else {
                $('#containerImg').attr('src', 'https://hub.docker.com/public/images/official/' + resp.iamgeName + '.png');
            }

            //获取容器伸缩数
            if(autoscale == "true"){
                $('.applocation').removeClass('hide');
                $.ajax({
                    url: '/container/scalecontainer/list/' + containerid,
                    type: 'GET'
                }).done(function (resp) {
                    //console.log(resp);
                    if(resp.result == true){
                        $('.open').text(resp.containers.length);
                    }else if(resp.result == false){
                        $('.open').text('0');
                    }
                });
            }
        }).fail(function (err) {
            console.log(err);
        });
    }, 5000);

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

    //资源控制
    $("#changeButton").on("click", function () {
        layer.confirm('确定更改资源控制？', {
            icon: 3,
            btn: ['确定', '取消']
        }, function (index) {
            layer.close(index);

            var instanceNumber = $("#instanceNumber").val();
            var instanceType = $("#instanceType").val();
            var autoscale = $('input[name="chkItem"]:checked').attr('value');

            $.ajax({
                url: '/serve/updata',
                type: 'post',
                data: {
                    appid: containerid,
                    instance: instanceNumber,
                    conflevel: instanceType,
                    autoscale: autoscale
                }
            }).done(function (resp) {
                console.log(resp);
            });
        });
    });

    ////获取容器伸缩数
    //var autoscaleStatus = $('#autoscaleStatus').val();
    //if(autoscaleStatus == true){
    //    $('.applocation').removeClass('hide');
    //    $.ajax({
    //        url: '/container/scalecontainer/list/' + containerid,
    //        type: 'GET'
    //    }).done(function (resp) {
    //        console.log(resp);
    //        //var html = '';
    //        //for (var i in events) {
    //        //    var titme = new Date(events[i].titme);
    //        //    var date = formatDate(titme);
    //        //    //console.log(date);
    //        //
    //        //    html += '<div class="event"><div class="event-line"><div class="event-status success"><i class="fa fa-check note"></i></div><div class="time-line-content"><div class="time-line-reason event-title"><div class="title-name success">' + events[i].event + '</div><div class="time-line-time"><div class="event-sign"><i class="fa fa-angle-right fa_caret"></i></div><div class="datetimes">' + date + '</div></div><div class="time-line-message" style="display: none;"><p class="list-times">时间：' + date + '</p><p class="list-conent">信息：' + events[i].script + '</p></div></div></div></div></div>';
    //        //
    //        //    $('.containerEvent').html(html);
    //        //}
    //    });
        //setInterval(function () {
        //    $.ajax({
        //        url: '/container/instance/event/list/' + containerid,
        //        type: 'GET'
        //    }).done(function (resp) {
        //        var events = resp.appevents;
        //        //console.log(events);
        //        var html = '';
        //        for (var i in events) {
        //            var titme = new Date(events[i].titme);
        //            var date = formatDate(titme);
        //            //console.log(date);
        //
        //            html += '<div class="event"><div class="event-line"><div class="event-status success"><i class="fa fa-check note"></i></div><div class="time-line-content"><div class="time-line-reason event-title"><div class="title-name success">' + events[i].event + '</div><div class="time-line-time"><div class="event-sign"><i class="fa fa-angle-right fa_caret"></i></div><div class="datetimes">' + date + '</div></div><div class="time-line-message" style="display: none;"><p class="list-times">时间：' + date + '</p><p class="list-conent">信息：' + events[i].script + '</p></div></div></div></div></div>';
        //
        //            $('.containerEvent').html(html);
        //        }
        //    });
        //}, 5000);
    //}

})();


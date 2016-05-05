/**
 * Created by HC on 2016/5/4.
 */
(function(){

    $('.nav-menu li').eq(3).addClass('item-click');

    //获取本地镜像
    $.ajax({
        url: '/image/list/label/kind',
        type: 'GET'
    }).done(function(resp){
        var images = resp.images;
        //console.log(images);
        for(var i in images){
            var imageDiv;
            imageDiv = $('<div class="col-xx-4"><section class="panel"><div class="select-img"><div class="mir-img "><img src="'+images[i].icon+'"></div></div><ul class="select-info"><li><div class="pull-right-text">'+images[i].name+'</div></li><li><div class="pull-left"></div><div class="pull-right"><a href="javascript:void(0);" name-target="'+images[i].name+'" id="bushu" class="btn-pull-deploy btn">部署</a></div></li></ul><div class="create-item"><a href="'+images[i].detail+'"><span class="note-text" title="Base docker image to run a MySQL database server">'+images[i].tag+'</span></a></div></section></div>');

            imageDiv.appendTo($('#images-layout'));

        }
    });

    //搜索dockerhub镜像
    $('button[type="submit"]').click(function(){
        $('#images-layout').hide().siblings().show();

        var searchName = $('.search-img').val();
        if(searchName == ''){
            layer.msg('请输入您想要搜索的镜像名称');
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
                        imageDiv = $('<div class="col-xx-4"><section class="panel"><div class="select-img"><div class="mir-img "><img src="/images/blue-logo.png"></div></div><ul class="select-info"><li><div class="pull-right-text">'+images[i].name+'</div></li><li><div class="pull-left"></div><div class="pull-right"><a href="javascript:void(0);" class="btn-pull-deploy btn">部署</a></div></li></ul><div class="create-item"><a href="'+images[i].detail+'"><span class="note-text" title="Base docker image to run a MySQL database server">'+images[i].description+'</span></a></div></section></div>');

                        imageDiv.appendTo($('#searchImages'));
                    }
                }

            });
        }
    });

    //创建容器
    $("#part01").on("click","#bushu",function(){
        $("#part01").hide();
        $("#part02").show();
        var imageName = $(this).attr("name-target");
        //容器配置
        $('.imageName').text(imageName);
        $('#getImageName').val(imageName);
        //console.log(imageName);
    });

    //创建
    $('.host_step1').hide();
    $('.host_step2').show();
    $('.radius_step').eq(1).addClass('action').siblings().removeClass('action');
    $('.createPadding,.createPadding .go_backs01,.createPadding .two_step,.createPadding #createButton').removeClass('hide');

    $('#createButton').click(function(){
        var containerName = $('#containerName').val();
        if ( containerName === "") {
            layer.msg("服务名称不能为空！");
        } else {
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
        $("#part01").show();
        $("#part02").hide();
    });

    //容器配置选择
    $('#createContainerForm>li>section').click(function(){
        $(this).addClass('active').siblings().removeClass('active');
    });


})();
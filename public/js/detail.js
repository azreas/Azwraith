(function(){
    $('.baseInfo a').click(function(){
        $(this).addClass('btn-prim').siblings().removeClass('btn-prim');
        var index_a = $(this).index();
        $('#detail-content-box>div').eq(index_a).show().siblings().hide();
    });

    $(document).on('click','.event-sign',function(){
        if(!$(this).hasClass('live')){
            $(this).addClass('live');
            $(this).parent().siblings('.time-line-message').slideDown();
        }else{
            $(this).removeClass('live');
            $(this).parent().siblings('.time-line-message').slideUp();
        }
    });
    $(document).on('click','.event-title',function(){

        if(!$(this).hasClass('live')){
            $(this).addClass('live').find('.event-sign').addClass('live');

            $(this).find('.time-line-message').slideDown('fast');
        }else{
            $(this).removeClass('live').find('.event-sign').removeClass('live');
            $(this).find('.time-line-message').slideUp('fast');
        }
        return false;
    });

    //添加服务事件内容
    $('.EVENT').click(function(){
        var containerid = $('#containerId').val();
        //console.log(containerid);
        $.ajax({
            url: '/container/instance/event/list/'+containerid,
            type: 'GET'
        }).done(function(resp){
            var events = resp.appEvents;
            console.log(events);
            for(var i in events){
                var titme = new Date(events[i].titme);
                var date = formatDate(titme);
                console.log(date);

                var dbtr=$('<div class="event"><div class="event-line"><div class="event-status success"><i class="fa fa-check note"></i></div><div class="time-line-content"><div class="time-line-reason event-title"><div class="title-name success">'+events[i].event+'</div><div class="time-line-time"><div class="event-sign"><i class="fa fa-angle-right fa_caret"></i></div><div class="datetimes">'+date+'</div></div><div class="time-line-message" style="display: none;"><p class="list-times">时间：'+date+'</p><p class="list-conent">信息：'+events[i].script+'</p></div></div></div></div></div>');

                dbtr.appendTo($('.containerEvent'));
            }
            $('.succeed-content>li>span,.containerInfo>table>tbody>tr>td>span').html(date);
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
    });

})();


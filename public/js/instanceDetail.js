/**
 * Created by HC on 2016/4/13.
 */
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

    //添加实例事件内容
    var containerid = $("#containerID").val();

    console.log(containerid);
    //连接websocket后端服务器
    var socket = io.connect('ws://'+window.location.host);
    $("#podLogs").text('');
    // 监听服务端发来的日志
    socket.on('log', function(data){
        console.log(data.log);
        if(data.log == ''){
            var dbtr=$('<div style="color: rgba(55, 252, 52, 0.58);"><font style="color: rgba(55, 252, 52, 0.58)">没有日志产生。</font></div>');
            dbtr.appendTo($("#podLogs"));
        }else{
            var dbtr=$('<div style="color: rgba(55, 252, 52, 0.58);"><font style="color: rgba(255, 255, 0, 0.58)">[历史记录]</font><font style="color: rgba(55, 252, 52, 0.58)">'+data.log+'</font></div>');
            dbtr.appendTo($("#podLogs"));
        }
    });

    // 根据容器实例id获取日志
    socket.emit('getLogByInstanceId', containerid);

})();
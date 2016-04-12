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
    })
})();
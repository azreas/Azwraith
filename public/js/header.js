/**
 * Created by HC on 2016/4/12.
 */
(function(){
    $('.nav-li').click(function() {
        var self = this;
        $(self).siblings('li').removeClass('item-click').find('.nav-item-list').hide();
        if (!$(self).hasClass('item-click')) {
            $(self).addClass('item-click');
            $(self).find('.nav-item-list').show();
        } else {
            $(self).removeClass('item-click')
            $(self).find('.nav-item-list').hide();
        }
    });
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

    //用户信息
    var userId = $('#userId').val();
    $.ajax({
        url: '/user/'+userId
    }).done(function(resp){
        var userName = resp.account.user.name;
        $('.namespace').html(userName);
    });

})();
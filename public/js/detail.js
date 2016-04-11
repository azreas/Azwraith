(function(){
    $('.baseInfo a').click(function(){
        $(this).addClass('btn-prim').siblings().removeClass('btn-prim');
        var index_a = $(this).index();
        $('#detail-content-box>div').eq(index_a).show().siblings().hide();
    });
})();
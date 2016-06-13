/**
 * Created by HC on 2016/6/8.
 */
(function () {
    // 验证
    $('#repoName').blur(function(event){
        var repoName = $('#repoName').val().trim();
        repoName = repoName.toLowerCase();
        if(repoName.length === 0){
            // showAlert('名称不能为空.','#repoName');
            layer.tips('仓库名称不能为空', '#repoName', {
                tips: [1, '#0FA6D8'] //还可配置颜色
            });
            return;
        }
        if(repoName.search(/^[a-z][a-z0-9-]*$/) === -1){
            layer.tips('仓库名称只能由字母、数字、横线组成，且首字母不能为数字、横线及下划线。', '#repoName', {
                tips: [1, '#0FA6D8'] //还可配置颜色
            });
            $('#repoName').focus();
            return;
        }
    });
    $('#ciSummary').blur(function(event){
        var ciSummary = $('#ciSummary').val().trim();
        if(ciSummary.length === 0){
            layer.tips('项目简介不能为空', '#ciSummary', {
                tips: [1, '#0FA6D8'] //还可配置颜色
            });
        }
    });
    //$('#projectName').blur(function(event){
    //    var projectName = $('#projectName').val().trim();
    //    if(projectName.length === 0){
    //        layer.tips('项目名称不能为空', '#projectName', {
    //            tips: [1, '#0FA6D8'] //还可配置颜色
    //        });
    //    }
    //});

    // Build to do the image build
    $('#buildBtn').click(function(){
        var repoName = $('#repoName').val().trim();
        var repoUrl = $('#repoUrl').val().trim();
        var projectName = $('#projectName').val().trim();
        var ciSummary = $('#ciSummary').val().trim();
        var repoUrl = $('#repoUrl').val().trim();
        var buildLogs = '';
        // 验证仓库名称
        repoName = repoName.toLowerCase();
        $('#repoName').val(repoName);
        if(repoName.length === 0){
            layer.tips('仓库名称不能为空', '#repoName', {
                tips: [1, '#0FA6D8'] //还可配置颜色
            });
            $('#repoName').focus();
            return;
        }
        if(repoName.search(/^[a-z][a-z0-9-_]*$/) === -1){
            layer.tips('仓库名称只能由字母、数字、横线及下划线组成，且首字母不能为数字、横线及下划线。', '#repoName', {
                tips: [1, '#0FA6D8'] //还可配置颜色
            });
            $('#repoName').focus();
            return;
        }
        if(repoName.length > 50 || repoName.length < 3){
            layer.tips('仓库名称为3~50个字符', '#repoName', {
                tips: [1, '#0FA6D8'] //还可配置颜色
            });
            $('#repoName').focus();
            return;
        }
        // 验证cloneurl
        if ($('#repoUrl').attr('type') !== 'hidden') {
            if(repoUrl.length === 0){
                layer.tips('代码仓库地址不能为空', '#repoUrl', {
                    tips: [1, '#0FA6D8'] //还可配置颜色
                });
                $('#repoUrl').focus();
                return;
            }
            var regUrl = /^(http:\/\/|https:\/\/|(.*@)).*$/;
            if(repoUrl.search(regUrl) === -1){
                layer.tips('请填写完整合法的代码仓库HTTPS/SSH地址,例如：https://a.com/a/a.git', '#repoUrl', {
                    tips: [1, '#0FA6D8'] //还可配置颜色
                });
                $('#repoUrl').focus();
                return;
            }
        }
        // 验证简介
        if(ciSummary.length === 0){
            layer.tips('项目简介不能为空', '#ciSummary', {
                tips: [1, '#0FA6D8'] //还可配置颜色
            });
            return;
            $('#ciSummary').focus();
        }
        // 验证项目名称
        //if(projectName.length === 0){
        //    layer.tips('项目名称不能为空', '#projectName', {
        //        tips: [1, '#0FA6D8'] //还可配置颜色
        //    });
        //    $('#projectName').focus();
        //    return;
        //}
        //if(projectName.length > 20 || projectName.length < 3){
        //    layer.tips('项目名称为3~20个字符', '#projectName', {
        //        tips: [1, '#0FA6D8'] //还可配置颜色
        //    });
        //    $('#projectName').focus();
        //    return;
        //}
        //if(!$("#imageBranch").val()){
        //    layer.tips('请选择代码分支', '#imageBranch', {
        //        tips: [1, '#0FA6D8'] //还可配置颜色
        //    });
        //    $('#imageBranch').focus();
        //    return;
        //}

        //提交表单
        $('#buildBtn').text('创建中...');
        $('#buildForm').submit();
        var index = layer.load(0, {
            shade: [0.5,'#fff'] //0.1透明度的白色背景
        });
    });
})();

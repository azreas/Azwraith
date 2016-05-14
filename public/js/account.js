/**
 * Created by HC on 2016/5/12.
 */
(function () {
    //导航条切换
    $('#baseinfo').click(function () {
        $(this).addClass('active').siblings('a').removeClass('active');
        $('.base').hide();
        $('.user_info').fadeIn();
    });
    $('#psd').click(function () {
        $(this).addClass('active').siblings('a').removeClass('active');
        $('.base').hide();
        $('.edit_pwd').fadeIn();
    });
    $('#phone').click(function () {
        $(this).addClass('active').siblings('a').removeClass('active');
        $('.base').hide();
        $('.edit_iphone').fadeIn();
    });
    switch ($('#selectedPage').val()) {
        case 'password':
            $('#psd').click();
            break;
        case 'phone':
            $('#phone').click();
            break;
        default:
            $('#baseinfo').click();
    }

    //获取用户信息
    $.ajax({
        url: '/user',
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json'
    }).done(function (resp) {
        console.log(resp.people.profile);
        var username = resp.people.account.email_name;
        var email = resp.people.account.email_name + '@' + resp.people.account.email_domain;
        var company = resp.people.profile.company;
        var wechat = resp.people.profile.wechat;
        var phone = resp.people.profile.cellphone;
        var phoneVerify = resp.people.profile.phoneVerify;
        $('#username').text(username);
        $('#emailhide').attr('value', email);
        $('#email').val(email);
        $('#email').next().attr('value', email);
        $('#companyshow').val(company);
        $('#wechatshow').val(wechat);
        $('#company').val(company);
        $('#wechat').val(wechat);
        $('#phonenumber').val(phone);
        if(phoneVerify == true){
            $('.get_code').attr('disabled', 'disabled');
            $('.codemsg').html('<font color="#429368">手机号已验证</font>').fadeIn();
        }
    });

    //保存基本信息
    $('#saveUserInfo').click(function (event) {
        /* Act on the event */
        var self = this;
        var companyOld = $('#company').val();
        var wechatOld = $('#wechat').val();
        var company = $('#companyshow').val();
        var wechat = $('#wechatshow').val();
        var username = $('#username').text();
        if (company == companyOld && wechat == wechatOld) {
            layer.msg('您未做任何修改', {icon: 0, time: 1500});
            return;
        }
        if (!company || company.trim() === '') {
            layer.tips('请输入公司名称', '#companyshow', {tips: [1, '#3595CC'], time: 2000});
            $('#company').focus();
            return;
        }
        if (!wechat || wechat.trim() === '') {
            layer.tips('请输入微信号', '#wechatshow', {tips: [1, '#3595CC'], time: 2000});
            $('#wechat').focus();
            return;
        }
        $(self).attr('disabled', 'disabled');
        $(self).html('&nbsp;&nbsp;&nbsp;提交中&nbsp;&nbsp;&nbsp;');
        // return;
        var json = {
            name: username,
            sub_domain: username,
            company: company,
            wechat: wechat
        };
        var info = JSON.stringify(json);
        $.ajax({
            url: '/user/update',
            type: 'POST',
            data: info,
            contentType: 'application/json',
            dataType: 'json'
        }).done(function (resp) {
            layer.msg('保存成功', {icon: 1, time: 1500});
            $('#company').val(company);
            $('#wechat').val(wechat);
        }).fail(function (err) {
            layer.msg('保存失败', {icon: 2, time: 1500});
        }).complete(function () {
            $(self).removeAttr('disabled');
            $(self).html('&nbsp;&nbsp;&nbsp;&nbsp;保存&nbsp;&nbsp;&nbsp;&nbsp;');
        })
    });

    //修改密码
    $('#changePwd').click(function () {
        var originalPwd = $('#originalPwd').val();
        var newPwd = $('#newPwd').val();
        var confirmNewPwd = $('#confirmNewPwd').val();
        $('.pwdmsg').hide();
        var valid = true;
        if (originalPwd === '') {
            $('#originalPwd').parents('td').next().children('span').text('原密码不能为空！');
            setTimeout(function () {
                $('#originalPwd').parents('td').next().children('span').text('');
            }, 3000);
            valid = false;
            return;
        }
        if (newPwd === '') {
            $('#newPwd').parents('td').next().children('span').text('新密码不能为空！');
            setTimeout(function () {
                $('#newPwd').parents('td').next().children('span').text('');
            }, 3000);
            valid = false;
            return;
        }
        if (newPwd.length < 6 || newPwd.length > 30) {
            $('#newPwd').parents('td').next().children('span').text('新密码长度为6-30位数！');
            setTimeout(function () {
                $('#newPwd').parents('td').next().children('span').text('');
            }, 3000);
            valid = false;
            return;
        }
        if (confirmNewPwd === '' || confirmNewPwd != newPwd) {
            $('#confirmNewPwd').parents('td').next().children('span').text('两次密码输入不一致！');
            setTimeout(function () {
                $('#confirmNewPwd').parents('td').next().children('span').text('');
            }, 3000);
            valid = false;
            return;
        }

        if (valid) {
            var data = {
                oldpasswd: originalPwd,
                newpasswd: newPwd
            };
            //clear error msg
            $('#originalPwd').parents('td').next().children('span').text('');
            $('#newPwd').parents('td').next().children('span').text('');
            $('#confirmNewPwd').parents('td').next().children('span').text('');
            $('.pwdfaspin').fadeIn();
            $.ajax({
                url: '/pwd',
                type: 'POST',
                data: data
            }).done(function (data, status, xhs) {
                if (data == '旧密码错误') {
                    $('.pwdfaspin').hide();
                    $('.pwdmsg').html('<font color="#b94a48">原密码错误！</font>').fadeIn();
                } else {
                    $('.pwdfaspin').hide();
                    $('.pwdmsg').html('<font color="#429368">修改成功！</font>').fadeIn();
                    layer.msg("修改密码成功，即将跳转到登录页面");
                    setTimeout(function () {
                        window.location.href = "/login";
                    }, 3000);
                }
            }).fail(function (data) {
                $('.pwdfaspin').hide();
                $('.pwdmsg').html('<font color="#b94a48">' + data + '</font>').fadeIn();
            });
        }
    });

    //发送邮箱验证
    $('#resendEmail').click(function () {
        var $self = $(this);
        var email = $('#email').val();
        var user_info = {
            toEmail: email
        };
        $self.attr('disabled', 'disabled');
        $('.faspin').show();
        $('.msg').hide();
        $.ajax({
            url: '/mail/verify',
            type: 'POST',
            data: user_info
        }).done(function (data, status, xhs) {
            $('.faspin').hide();
            $('.msg').fadeIn();
            var changeResendTimeInterval = setInterval(_changeResendTime, 1000);

            function _changeResendTime() {
                var time = parseInt($('#resendEmailTime').text());
                time--;
                if (time === 0) {
                    clearInterval(changeResendTimeInterval);
                    $self.removeAttr('disabled');
                    $('#resendEmailTime').text(60);
                    $('.msg').fadeOut();
                    return;
                }
                $('#resendEmailTime').text(time);
            }
        }).fail(function (data) {
            $('.faspin').hide();
        });
    });

    //手机号码验证
    $('.get_code').click(function () {
        var phone = $('#phonenumber').val().trim();
        if (phone.search(/(^(13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7})$/) == -1) {
            if (phone == '') {
                $('.codemsg').html('<font color="#b94a48">手机号码不能为空</font>').fadeIn();
                setTimeout(function () {
                    $('#phonenumber').focus();
                    $('.codemsg').fadeOut();
                }, 1500);
                return;
            }
            $('.codemsg').html('<font color="#b94a48">请输入合法的手机号码</font>').fadeIn();
            setTimeout(function () {
                $('#phonenumber').focus();
                $('.codemsg').fadeOut();
            }, 1500);
            return;
        }
        var data = {tophone: phone};
        $('.get_code').attr('disabled', 'disabled');
        $('.codemsg').hide();
        $('.sendfaspin').show();
        $.ajax({
            url: '/phone/send',
            type: 'POST',
            data: data
        }).done(function (data, status, xhs) {
            if(data.result == false){
                $('.codemsg').html('<font color="#429368">手机号已验证</font>').fadeIn();
                setTimeout(function () {
                    $('.codemsg').fadeOut();
                }, 1500);
                return;
            }

            $('.sendfaspin').hide();
            $('#securitycode').removeClass('hide');
            $('.codemsg').html('<font color="#429368">发送成功</font>').fadeIn();
            $('.get_code').html('<span id="phoneCaptchaCount">60</span>s 后重新获取');
            var countInterval = setInterval(phoneCaptchaCount, 1000);

            function phoneCaptchaCount() {
                var count = parseInt($('#phoneCaptchaCount').text());
                count--;
                if (count <= 0) {
                    window.clearInterval(countInterval);
                    $('.get_code').removeAttr('disabled');
                    $('.get_code').text('发送验证码');
                    return;
                }
                $('#phoneCaptchaCount').text(count);
            }
        }).fail(function (data) {
            $('.sendfaspin').hide();
            $('.codemsg').html('<font color="#b94a48">' + data.responseJSON + '</font>').fadeIn();
            $('.get_code').removeAttr('disabled');
            $('.get_code').html('发送验证码');
        });
    });

    //验证码验证
    $('#codeverify').click(function(){
        var phone = $('#phonenumber').val().trim();
        var codenumber = $('#codenumber').val().trim();
        if(codenumber == ''){
            $('.code').html('<font color="#b94a48">请输入验证码</font>').fadeIn();
            setTimeout(function () {
                $('#codenumber').focus();
                $('.code').fadeOut();
            }, 1500);
            return;
        }
        var data = {
            phonecode: codenumber,
            cellphone: phone
        };
        $('.code').hide();
        $('.sendcode').removeClass('hide');
        $.ajax({
            url: '/phone/verify',
            type: 'POST',
            data: data
        }).done(function (data, status, xhs) {
            console.log(data);
            if(data.result == true){
                $('.sendcode').addClass('hide');
                $('.get_code').text('发送验证码');
                $('.code').html('<font color="#429368">验证成功</font>').fadeIn();
                layer.msg('恭喜，手机号验证成功！',{icon: 1});
                setTimeout(function () {
                    $('#securitycode').addClass('hide');
                }, 1500);
            }else if(data.result == '11'){
                $('.sendcode').addClass('hide');
                layer.msg('抱歉，您的验证码已经失效',{icon: 5});
            }else if(data.result == '12'){
                $('.sendcode').addClass('hide');
                layer.msg('抱歉，手机号已验证',{icon: 5});
            }

        });


    });

    //用户修改密码验证
    //$('#changePwd').click(function () {
    //    var originalPwd = $('#originalPwd').val();
    //    var newPwd = $('#newPwd').val();
    //    var confirmNewPwd = $('#confirmNewPwd').val();
    //    $('.pwdmsg').hide();
    //    var valid = true;
    //    if (originalPwd === '') {
    //        $('#originalPwd').parents('td').next().children('span').text('原密码不能为空！');
    //        setTimeout(function () {
    //            $('#originalPwd').parents('td').next().children('span').text('');
    //        }, 3000);
    //        valid = false;
    //    }
    //    if (newPwd === '') {
    //        $('#newPwd').parents('td').next().children('span').text('新密码不能为空！');
    //        setTimeout(function () {
    //            $('#newPwd').parents('td').next().children('span').text('');
    //        }, 3000);
    //        valid = false;
    //    }
    //    if (newPwd.length < 6 || newPwd.length > 30) {
    //        $('#newPwd').parents('td').next().children('span').text('新密码长度为6-30位数！');
    //        setTimeout(function () {
    //            $('#newPwd').parents('td').next().children('span').text('');
    //        }, 3000);
    //        valid = false;
    //    }
    //    if (confirmNewPwd === '' || confirmNewPwd != newPwd) {
    //        $('#confirmNewPwd').parents('td').next().children('span').text('两次密码输入不一致！');
    //        setTimeout(function () {
    //            $('#confirmNewPwd').parents('td').next().children('span').text('');
    //        }, 3000);
    //        valid = false;
    //    }
    //
    //    if (valid) {
    //        var data = {originalPwd: originalPwd, newPwd: newPwd};
    //        //clear error msg
    //        $('#originalPwd').parents('td').next().children('span').text('');
    //        $('#newPwd').parents('td').next().children('span').text('');
    //        $('#confirmNewPwd').parents('td').next().children('span').text('');
    //        $('.pwdfaspin').fadeIn();
    //        $.ajax({
    //            url: '/pwd',
    //            type: 'POST',
    //            data: data
    //        }).done(function (data, status, xhs) {
    //            $('.pwdfaspin').hide();
    //            $('.pwdmsg').html('<font color="#429368">修改成功！</font>').fadeIn();
    //        }).fail(function (data) {
    //            $('.pwdfaspin').hide();
    //            $('.pwdmsg').html('<font color="#b94a48">' + data.responseJSON + '</font>').fadeIn();
    //        });
    //    }
    //});

})();
/**
 * Created by HC on 2016/5/13.
 */
(function (WebUploader) {

    var $article = $('article')

    //图片上传工具
    var ToolImage = function () {
        var self = this;
        this.$win = $([
            '<div id="uploadimgModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="editorToolImageTitle" aria-hidden="true">',
            '<div class="modal-dialog">',
            '<div class="modal-content">',
            '<div class="modal-header">',
            '<button type="button" data-dismiss="modal" aria-label="Close" aria-hidden="true" class="close"></button>',
            '<h4 id="editorToolImageTitle">上传头像</h4>',
            '</div>',
            '<div class="modal-body" style="padding:15px;">',
            '<div class="upload-img">',
            '<div class="button">选择图片</div>',
            '<div style="margin:10px;color:rgb(155, 155, 155)">或将图片拖到这里</div>',
            '<span class="tip" style="line-height:50px"></span>',
            '<div class="progress hide" style="width:80%;margin:0 auto;">',
            '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">',
            '<span class="sr-only"></span>',
            '</div>',
            '</div>',
            '<div class="alert alert-danger alert-dismissible fade in hide" role="alert" style="width:80%;margin:10px auto;">',
            '<span aria-hidden="true"></span>',
            '<span class="uploadErr"></span>',
            '</div>',
            '</div>',
            '</div>',
            '<div style="margin:-5px 0 15px 25px">* 支持 gif/jpg/jpeg/bmp/png/ico 格式图片，大小不超过1M</div>',
            '</div>',
            '</div>',
            '</div>'
        ].join('')).appendTo($article);

        this.$upload = this.$win.find('.upload-img').css({
            // height: 50,
            padding: '60px 0',
            textAlign: 'center',
            border: '4px dashed#ddd'
        });

        this.$uploadBtn = this.$upload.find('.button').css({
            width: 86,
            height: 40,
            margin: '0 auto'
        });

        this.$uploadTip = this.$upload.find('.tip').hide();

        this.file = false;
        // var _csrf = $('[name=_csrf]').val();
        this.uploader = WebUploader.create({
            swf: '/js/webuploader/Uploader.swf',
            server: '/avatar/avatarupload/',
            pick: this.$uploadBtn[0],
            paste: document.body,
            dnd: this.$upload[0],
            auto: true,
            fileSingleSizeLimit: 1 * 1024 * 1024,
            multiple: false,
            //sendAsBinary: true,
            // 只允许选择图片文件。
            accept: [{
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png,ico',
                mimeTypes: 'image/*'
            }]
        });

        this.uploader.on('beforeFileQueued', function (file) {
            if (self.file !== false || !self.editor) {
                return false;
            }
            self.showFile(file);
        });

        this.uploader.on('uploadProgress', function (file, percentage) {
            // console.log(percentage);
            self.showProgress(file, percentage * 100);
        });

        this.uploader.on('uploadSuccess', function (file, res) {
            if (res.success) {
                self.$win.modal('hide');
                $(self.editor).find('img.username').attr('src', res.url + '?v=' + Math.random().toString(36).substr(2) + '&imageView2/1/w/100/h/100');
                layer.msg('头像上传成功~', {icon: 1, time: 3000});
            }
            else {
                self.removeFile();
                self.showError(res.msg || '服务器走神了，上传失败');
            }
        });

        this.uploader.on('uploadComplete', function (file) {
            self.uploader.removeFile(file);
            self.removeFile();
        });

        this.uploader.on('error', function (type) {
            self.removeFile();
            switch (type) {
                case 'Q_EXCEED_SIZE_LIMIT':
                case 'F_EXCEED_SIZE':
                    self.showError('文件太大了, 不能超过1M');
                    break;
                case 'Q_TYPE_DENIED':
                    self.showError('只能上传 gif/jpg/jpeg/bmp/png/ico 格式图片');
                    break;
                default:
                    self.showError('发生未知错误');
            }
        });

        this.uploader.on('uploadError', function () {
            self.removeFile();
            self.showError('服务器走神了，上传失败');
        });
    };

    ToolImage.prototype.removeFile = function () {
        //var self = this;
        this.file = false;
        this.$uploadBtn.show();
        this.$uploadTip.hide();
        this.$upload.find('.progress').addClass('hide');
    };

    ToolImage.prototype.showFile = function (file) {
        //var self = this;
        this.file = file;
        this.$uploadBtn.hide();
        this.$uploadTip.html('正在上传: ' + file.name).show();
        this.hideError();
    };

    ToolImage.prototype.showError = function (error) {
        this.$upload.find('.uploadErr').html(error);
        this.$upload.find('.alert-danger').removeClass('hide');
    };

    ToolImage.prototype.hideError = function (error) {
        this.$upload.find('.alert-danger').addClass('hide');
    };

    ToolImage.prototype.showProgress = function (file, percentage) {
        var percentageStr = parseInt(percentage) + '%';
        this.$uploadTip
            .html('正在上传: ' + file.name + ' ' + percentageStr)
            .show();
        this.$upload.find('.progress').removeClass('hide');
        this.$upload.find('.progress-bar').attr('style', 'width:' + percentageStr);
        this.$upload.find('.sr-only').html(percentageStr + ' Complete');
    };

    ToolImage.prototype.bind = function () {
        $('.modal-backdrop.fade').remove();
        this.$win.modal('show');
    };

    var toolImage = new ToolImage();
    $(document).on('click', '.btn-upload', function (e) {
        toolImage.bind();
    });
    toolImage.editor = $('body');
})(window.WebUploader);


function getCSRFTokensQuery() {
    var csrfToken = $('meta[name=csrf-token]').attr('content');
    var csrfParam = $('meta[name=csrf-param]').attr('content');
    var query = csrfParam + '=' + csrfToken;
    return query;
}
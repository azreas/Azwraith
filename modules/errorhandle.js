/**
 * 异常处理
 * Created by lingyuwang on 2016/3/25.
 */

module.exports = function (app) {
    // 404
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // 500
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            if (err.status == 404) {
                res.render('404', {});
            } else {
                res.status(err.status || 500);
                res.render('500', {});
            }
        });
    }

    // error
    app.use(function (err, req, res, next) {
        if (err.status == 404) {
            res.render('404', {});
        } else {
            res.status(err.status || 500);
            res.render('500', {});
        }
    });
}


/**
 * grunt 测试配置文件
 * @param grunt
 */

module.exports = function(grunt){
    // 加载插件
    [
        'grunt-contrib-uglify',
        'grunt-contrib-concat',
        'grunt-contrib-watch'
    ].forEach(function(task){
            grunt.loadNpmTasks(task);
    });
    // 配置插件
    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),
        uglify:{
            options:{
                banner:'/* <%= pkg.name %>-<%= pkg.version %> create by <%=grunt.template.today("yyyy-mm-dd")%> */\n'
            },
            /*static_mappings:{
                files:[
                    {
                        src:'public/js/detail.js',
                        dest:'public/build/js/detail.min.js'
                    }
                ]
            },*/
            dynamic_mappings: {
                files: [
                    {
                        expand: true,     
                        cwd: 'public/js',      
                        src: ['**/*.js'],
                        dest: 'public/build/js',
                        ext: '.min.js',
                        extDot: 'last'
                    },
                ],
            }
        }/*,
        concat:{
            bar:{
                src:['build/!*.js'],
                dest:'dest/all.min.js'
            }
        },
        watch:{
            files:['js/index.js'],
            tasks:['uglify','concat']
        }*/
    });
    // 注册任务
    grunt.registerTask('default', ['uglify'/*,'concat','watch'*/]);

    // 自定义任务
    /*grunt.registerTask('default', '测试自定义任务', function() {
        grunt.log.write('打印数据')/!*.ok()*!/;
    });*/
}












































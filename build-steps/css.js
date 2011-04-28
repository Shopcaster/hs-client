
var fs = require('fs'),
    exec = require('child_process').exec,
    _ = require('underscore')._;

exports.name = 'CSS';

exports.build = function(srcDir, buildDir, clbk){
    var buildCss = buildDir+'/css',
        srcCss = srcDir+'/css';

    fs.mkdir(buildCss, 0766, function(){
        fs.readdir(srcCss, function(err, files){
            var output = '',
                done = _.after(files.length, function(){
                    clbk({head: output});
                });
            _.each(files, function(file){
                if (/^[^_][\w-]+\.scss$/.test(file)){
                    var scss = srcCss+'/'+file,
                        css = file.replace('.scss', '.css'),
                        cmd = 'sass '+scss+' '+buildCss+'/'+css;
                    exec(cmd, function(){
                        output += '<link rel="stylesheet" type="text/css" href="';
                        output += 'css/'+css;
                        output += '">';
                        done();
                    });
                }else done();
            });
        });
    });
};

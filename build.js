#!/usr/bin/env node

var _ = require('underscore')._,
    fs = require('fs');

var build = function(buildType){
    var buildDir = './'+buildType+'_build/',
        srcDir = './'+buildType+'/',
        buildOutput = {
            htmlAttr: '',
            head: '',
            body: '',
        },
        steps = [
            require('./build-steps/css.js'),
            require('./build-steps/js.js'),
            require('./build-steps/img.js'),
            require('./build-steps/appCache.js'),
        ];


    var writeOutput = _.after(steps.length, function(){
        console.log('Writing results to file.');
        var htmlFile = srcDir+'/html/index.html';
        fs.readFile(htmlFile, 'utf8', function(err, html){
            html = html.replace('<!--{{ include }}-->', buildOutput);
            fs.writeFile(buildDir+'/index.html', html, function(){
                console.log('Done');
            });
        });
    });

    var updateOutput = function(stepResult){
        _.each(stepResult, function(value, key){
            buildOutput[key] += value +'\n';
        });
    };

    fs.realpath(buildDir, function(err, fullBuildDir){
        buildDir = fullBuildDir;
        fs.realpath(srcDir, function(err, fullSrcDir){
            srcDir = fullSrcDir;
            // rm -rf buildDir && mkdir buildDir
            rmrf(buildDir, function(){ fs.mkdir(buildDir, 0766, function(){
                _.each(steps, function(step){
                    console.log('Starting build step: '+step.name);
                    step.build(srcDir, buildDir, function(result){
                        updateOutput(result);
                        writeOutput();
                    });
                });
            }) });
        });
    });
};


if (process.argv[1] == __filename){
    if (process.argv.length < 3)
        throw('must specify build type');
    build(process.argv[2]);
}else{
    exports = build
}


// rm -rf
function rmrf(dir, clbk){
    fs.readdir(dir, function(err, files){
        if (err) return clbk();
        var done = _.after(files.length+1, function(){
            fs.rmdir(dir, clbk);
        }); done();
        _.each(files, function(f){
            f = dir+f;
            fs.stat(f, function(err, stat){
                if (err) return done();
                if (stat.isDirectory()) rmrf(f, done);
                else fs.unlink(f, done);
            });
        });
    });
}
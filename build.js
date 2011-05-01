#!/usr/bin/env node

var _ = require('underscore')._,
    fs = require('fs'),
    wrench = require('wrench'),
    buildDir = './_build/',
    srcDir = './src/',
    isScript = process.argv[1] == __filename;

var build = function(buildClbk){
    var buildOutput = {
            htmlAttr: '',
            head: '',
            body: '',
        },
        steps = [ // add build steps here:
            require('./_steps/css.js'),
            require('./_steps/js.js'),
            require('./_steps/img.js'),
            require('./_steps/appCache.js'),
        ];

    var writeOutput = _.once(function(){
        console.log('Writing results to file.');
        var htmlFile = srcDir+'/html/index.html';
        fs.readFile(htmlFile, 'utf8', function(err, html){
            if (err) errOut(err);
            html = html.replace('<html', '<html '+buildOutput.htmlAttr);
            html = html.replace('</head>', buildOutput.head+'</head>');
            html = html.replace('</body>', buildOutput.body+'</body>');
            fs.writeFile(buildDir+'/index.html', html, function(){
                console.log('Done');
                if (typeof buildClbk == 'function')
                    buildClbk(null);
                else if (isScript)
                    process.exit();
            });
        });
    });

    var updateOutput = function(stepResult){
        _.each(stepResult, function(value, key){
            buildOutput[key] += value +' ';
        });
    };

    fs.realpath(buildDir, function(err, fullBuildDir){
        if (err) return errOut(err);
        buildDir = fullBuildDir;
        fs.realpath(srcDir, function(err, fullSrcDir){
            if (err) return errOut(err);
            srcDir = fullSrcDir;
            // rm -rf buildDir && mkdir buildDir
            wrench.rmdirRecursive(buildDir, function(err){
                if (err) return errOut(err);
                fs.mkdir(buildDir, 0766, function(err){
                    if (err) return errOut(err);
                    (function doStep(){
                        var step = steps.shift();
                        if (step == null) return writeOutput();

                        console.log('Starting build step:', step.name);
                        step.build(srcDir, buildDir, function(err, result){
                            if (err){
                                console.log('Error in step:', step.name);
                                return errOut(err);
                            }
                            if (typeof result == 'object')
                                updateOutput(result);
                            doStep();
                        });
                    })();
                });
            });
        });
    });

    function errOut(err){
        console.log('Error:', err);

        if (typeof buildClbk == 'function')
            buildClbk(err);
        else if (isScript)
            process.exit(1);
    }
};


if (isScript) build();
else{
    exports.build = build;
    exports.buildDir = buildDir.replace(/^\.\//, module.filename.replace('build.js', ''));
    exports.srcDir = srcDir.replace(/^\.\//, module.filename.replace('build.js', ''));
}

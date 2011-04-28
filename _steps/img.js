
var fs = require('fs'),
    wrench = require('wrench'),
    _ = require('underscore')._;

exports.name = 'Images';

exports.build = function(srcDir, buildDir, clbk){
    wrench.copyDirRecursive(srcDir+'/img', buildDir+'/img', function(err){
        clbk();
    });
};


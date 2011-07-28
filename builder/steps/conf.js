
exports.name = 'Conf';

exports.build = function(opt, clbk){
  clbk(null, {head: '<script>var conf = '+JSON.stringify(opt.conf)+'</script>'});
};

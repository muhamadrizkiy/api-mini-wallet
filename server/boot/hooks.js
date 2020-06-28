module.exports = function(server) {
    var remotes = server.remotes();
    // modify all returned values
    remotes.after('**', function (ctx, next) {
        if (ctx.result && !ctx.result.error) {
            var status = 'Success'
        } else if (ctx.result.error){
            var status = 'Fail'
        } else {
            var status = 'Fail'
        }
      ctx.result = {
        status: status,
        data: ctx.result
      };
  
      next();
    });
  };
'use strict';

let crypto = require('crypto');
var async = require('async');


module.exports = function(Init) {

    Init.disableRemoteMethodByName('create'); 
    Init.disableRemoteMethodByName('upsert');
    Init.disableRemoteMethodByName('updateAll');
    Init.disableRemoteMethodByName('prototype.updateAttributes');
    Init.disableRemoteMethodByName('find');
    Init.disableRemoteMethodByName('findById');
    Init.disableRemoteMethodByName('findOne');
    Init.disableRemoteMethodByName('deleteById');
    Init.disableRemoteMethodByName('exists');
    Init.disableRemoteMethodByName('count');
    Init.disableRemoteMethodByName('replaceOrCreate');
    Init.disableRemoteMethodByName('upsertWithWhere');
    Init.disableRemoteMethodByName('unlink');
    Init.disableRemoteMethodByName('replace');
    Init.disableRemoteMethodByName('change-stream');


    Init.remoteMethod(
      'init',
      {
        description: 'Init my account Init',
        accepts: [
          {arg: 'customer_xid', type: 'string', required: true}
        ],
        returns: {
          arg: 'res', type: 'object', root: true
        },
        http: { path: '/', verb: 'post' }
      }
    );


    Init.init = function(customer_xid,callback) {
      var password = 'password'
      async.waterfall([
        function(next) {
          let User = Init.app.models.User
          var accountData = {
            username : customer_xid,
            password : password,
            email : 'muhamadrizkiy@gmail.com'
          }
          User.create(accountData, function(err, userInstance) {
            console.log(userInstance)
            if (err) next(err);
            else next(null, userInstance);
          });
        },
        function(userInstance, next) {
          let User = Init.app.models.User
          let data = {
            username : userInstance.username,
            password : password
          }
          User.login(data, function(err, result) {
            console.log(result)
            if (err) next(err);
            else next(null, result);
          });
        },
      ],
      function(err, result) {
        console.log(result)
        if (err) callback(err);
        else {
          let newRes = {
            token : result.id
          }
          callback(null, newRes);
        }
          
      });
    }
};

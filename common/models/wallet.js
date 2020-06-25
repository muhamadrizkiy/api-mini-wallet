'use strict';

let crypto = require('crypto')

module.exports = function(Wallet) {

    Wallet.disableRemoteMethodByName('create'); 
    Wallet.disableRemoteMethodByName('upsert');
    Wallet.disableRemoteMethodByName('updateAll');
    Wallet.disableRemoteMethodByName('prototype.updateAttributes');
    Wallet.disableRemoteMethodByName('find');
    Wallet.disableRemoteMethodByName('findById');
    Wallet.disableRemoteMethodByName('findOne');
    Wallet.disableRemoteMethodByName('deleteById');
    Wallet.disableRemoteMethodByName('exists');
    Wallet.disableRemoteMethodByName('count');
    Wallet.disableRemoteMethodByName('replaceOrCreate');
    Wallet.disableRemoteMethodByName('upsertWithWhere');
    Wallet.disableRemoteMethodByName('unlink');
    Wallet.disableRemoteMethodByName('replace');

    Wallet.enableWallet = function(options, cb) {

      const walletId = crypto.randomBytes(16).toString("hex");

      let data = {
        status: "success",
        data: {
          wallet: {
            id: walletId,
            owned_by: options.accessToken.userId,
            status: "enabled",
            enabled_at: Date.now(),
            balance: 0
          }
        } 
      }

      Wallet.create(data, function(err, res){
        if(err) {
          res.status = "failed"
          res.data = {}
          cb(err);
        }
        else {
          res.is_disable = false
          cb(null, res)
        }
      });

    };
    
    Wallet.remoteMethod(
        'enableWallet',
        {
          description: 'Enable wallet',
          accepts: [
            {"arg": "options", "type": "object", "http": "optionsFromRequest"}
          ],
          returns: {
            arg: 'res', type: 'object', root: true
          },
          http: { path: '/', verb: 'post' }
        }
      );


    Wallet.getBalance = function(callback) {

      Wallet.find(function(err, result){
        if(err) callback(err);
        else callback (null, result);
      });

    };

    Wallet.remoteMethod(
      'getBalance',
      {
        description: 'View my wallet balance',
        accepts: [
        ],
        returns: {
          arg: 'result', type: 'object', root: true
        },
        http: { path: '/', verb: 'get' }
      }
    );


    Wallet.deposit = function(amounts, options, callback) {

      const reference_id = crypto.randomBytes(16).toString("hex");

      let userId = options.accessToken.userId

      var filter = {
        where: {
          data: {
            owned_by : userId
          }
        }
      }

      Wallet.findOne(filter).then((updateState) => {
        if(!updateState) callback(err);
        else {
          let newAmount = updateState.amount + amounts
          updateState.updateAttributes({amount: newAmount}, function(err, res){
            callback (null, res);
          })
        } 
      })

    }

    Wallet.remoteMethod(
      'deposit',
      {
        description: 'Add virtual money to my wallet',
        accepts: [
          {arg: 'amounts', type: 'number', required: true},
          {arg: "options", type: "object", http: "optionsFromRequest"}
        ],
        returns: {
          arg: 'result', type: 'object', root: true
        },
        http: { path: '/deposits', verb: 'post' }
      }
    );




     
    


      
      

};

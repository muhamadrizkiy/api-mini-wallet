'use strict';

let crypto = require('crypto')

module.exports = function(Wallet) {


    let MSG_ERR_NOT_FOUND = 'Cannot Find The Wallet. Please register your wallet!'
    let MSG_ERR_EXIST = 'The Wallet Already Exists. Try to Deposits'
    let MSG_ERR_BALANCE = 'The amount being used must not be more than the current balance'
    let MSG_ERR_DISABLE = 'Please Enable Your Wallet'


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

    Wallet.enableWallet = function(options, callback) {

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

      var filter = {
        where: {
          data: {
            owned_by : options.accessToken.userId
          }
        }
      }

      Wallet.findOne(filter).then((checkState) => {
        if(!checkState) {
          data.is_disable = false
          Wallet.create(data, function(err, res){
            if(err) {
              callback(err);
            }
            else {
              callback(null, res);
            }
          });
        }
        else if (checkState && checkState.is_disable == true) {
          checkState.updateAttributes({is_disable: false}, function(err, res){
            callback (null, res);
          })
        } 
        else {
          let data = {
            status : 'Failed',
            message : MSG_ERR_EXIST
          }
          callback (null, data);
        }
      })

    };
    
    Wallet.remoteMethod(
        'enableWallet',
        {
          description: 'Enable wallet',
          accepts: [
            {arg: "options", type: "object", http: "optionsFromRequest"}
          ],
          returns: {
            arg: 'res', type: 'object', root: true
          },
          http: { path: '/', verb: 'post' }
        }
      );


    Wallet.getBalance = function(options,callback) {

      var filter = {
        where: {
          data: {
            owned_by : options.accessToken.userId
          }
        }
      }

      Wallet.findOne(filter,function(err, result){
        if(err) callback(err);
        else if (!result || result.is_disable){
          let data = {
            status : 'Failed',
            message : MSG_ERR_DISABLE
          }
          callback (null, data);
        }
        else callback (null, result);
      });

    };

    Wallet.remoteMethod(
      'getBalance',
      {
        description: 'View my wallet balance',
        accepts: [
          {arg: "options", type: "object", http: "optionsFromRequest"}
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
        else if (updateState.is_disable){
          let data = {
            status : 'Failed',
            message : MSG_ERR_DISABLE
          }
          callback (null, data);
        }
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

    Wallet.withdrawals = function(amounts, options, callback) {

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
        else if (updateState.is_disable){
          let data = {
            status : 'Failed',
            message : MSG_ERR_DISABLE
          }
          callback (null, data);
        }
        else if (amounts > updateState.amount) {
          let data = {
            status : 'Failed',
            message : MSG_ERR_BALANCE
          }
          callback (null, data);
        }
        else {
          let newAmount = updateState.amount - amounts
          updateState.updateAttributes({amount: newAmount}, function(err, res){
            callback (null, res);
          })
        } 
      })

    }

    Wallet.remoteMethod(
      'withdrawals',
      {
        description: 'Use virtual money from my wallet',
        accepts: [
          {arg: 'amounts', type: 'number', required: true},
          {arg: "options", type: "object", http: "optionsFromRequest"}
        ],
        returns: {
          arg: 'result', type: 'object', root: true
        },
        http: { path: '/withdrawals', verb: 'post' }
      }
    );


    Wallet.disableWallet = function(options, callback) {

      var filter = {
        where: {
          data: {
            owned_by : options.accessToken.userId
          }
        }
      }

      Wallet.findOne(filter).then((checkState) => {
        if(!checkState) {
          let data = {
            status : 'Failed',
            message : MSG_ERR_NOT_FOUND
          }
          callback (null, data);
        }
        else {
          checkState.updateAttributes({is_disable: true}, function(err, res){
            callback (null, res);
          })
        }
      })

    };
    
    Wallet.remoteMethod(
        'disableWallet',
        {
          description: 'Disable wallet',
          accepts: [
            {arg: "options", type: "object", http: "optionsFromRequest"}
          ],
          returns: {
            arg: 'res', type: 'object', root: true
          },
          http: { path: '/', verb: 'patch' }
        }
    );
};

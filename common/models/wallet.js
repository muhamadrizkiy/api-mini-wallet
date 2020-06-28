'use strict';

let crypto = require('crypto')

module.exports = function(Wallet) {
  
    let MSG_ERR_NOT_FOUND = 'Cannot Find The Wallet. Please register your wallet!'
    let MSG_ERR_EXIST = 'The Wallet Already Exists. Try to Deposits!'
    let MSG_ERR_BALANCE = 'The amount being used must not be more than the current balance.'
    let MSG_ERR_DISABLE = 'Please Enable Your Wallet!'
    let MSG_ERR_LOGIN = 'Authorization Required!'

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

      if (!options.accessToken) {
        let data = {
          error : true ,
          message : MSG_ERR_LOGIN
        }
        callback (null, data);
      } else {
        let userId = options.accessToken.userId

        var data = {
              id: crypto.randomBytes(16).toString("hex"),
              owned_by: userId,
              status: "enabled",
              enabled_at: Date.now().toISOString
        }

        var filter = {
          where: {
              owned_by : userId
          }
        }

        Wallet.findOne(filter).then((checkState) => {
          if(!checkState) {
            Wallet.create(data, function(err, res){
              if(err) {
                callback(err);
              }
              else {
                let newRes = {
                  wallet : res
                }
                callback(null, newRes);
              }
            });
          }
          else if (checkState && checkState.status === 'disabled') {
            checkState.updateAttributes({status: "enabled"}, function(err, res){
              callback (null, res);
            })
          } 
          else {
            let data = {
              error : true ,
              message : MSG_ERR_EXIST
            }
            callback (null, data);
          }
        })
      }
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

    Wallet.getBalance = function(options, callback) {
      
      if (!options.accessToken) {
        let data = {
          error : true ,
          message : MSG_ERR_LOGIN
        }
        callback (null, data);
      } else {
        let userId = options.accessToken.userId
        var filter = {
          where: {
              owned_by : userId
          }
        }
        Wallet.findOne(filter,function(err, result){
          console.log(result)
          if(err) callback(err);
          else if (!result){
            let data = {
              error : true ,
              message : MSG_ERR_DISABLE
            }
            callback (null, data);
          }
          else {
            let newRes = {
              wallet : result
            }
            callback (null, newRes);
          }
        });
      }
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

    Wallet.deposit = function(amount, reference_id, options, callback) {
      
      if (!options.accessToken) {
        let data = {
          error : true ,
          message : MSG_ERR_LOGIN
        }
        callback (null, data);
      } else {
        var userId = options.accessToken.userId
        var filter = {
          where: {
              owned_by : userId
          }
        }

        Wallet.findOne(filter).then((updateState) => {
          if(!updateState) callback(err);
          else if (updateState.status === 'disabled'){
            let data = {
              error : true ,
              message : MSG_ERR_DISABLE
            }
            callback (null, data);
          }
          else {
            var newAmount = updateState.balance + amount
            updateState.updateAttributes({balance: newAmount}, function(err, res){

              let newRest = {
                deposit: {
                    id: crypto.randomBytes(16).toString("hex"),
                    deposited_by: userId,
                    status: "success",
                    deposited_at: Date.now().toISOString,
                    amount: amount,
                    reference_id:  reference_id
                  
                }
              }
              callback (null, newRest);
            })
          } 
        })
      }
    }

    Wallet.remoteMethod(
      'deposit',
      {
        description: 'Add virtual money to my wallet',
        accepts: [
          {arg: 'amount', type: 'number', required: true},
          {arg: 'reference_id', type: 'string', required: true},
          {arg: "options", type: "object", http: "optionsFromRequest"}
        ],
        returns: {
          arg: 'result', type: 'object', root: true
        },
        http: { path: '/deposits', verb: 'post' }
      }
    );

    Wallet.withdrawals = function(amount, reference_id, options, callback) {

      if (!options.accessToken) {
        let data = {
          error : true ,
          message : MSG_ERR_LOGIN
        }
        callback (null, data);
      } else {
        let userId = options.accessToken.userId
        var filter = {
          where: {
              owned_by : userId
            
          }
        }

        Wallet.findOne(filter).then((updateState) => {
          if(!updateState) {
            let data = {
              error : true ,
              message : MSG_ERR_DISABLE
            }
            callback (null, data);
          }
          else if (updateState.status === 'disabled'){
            let data = {
              error : true ,
              message : MSG_ERR_DISABLE
            }
            callback (null, data);
          }
          else if (amount > updateState.balance) {
            let data = {
              error : true ,
              message : MSG_ERR_BALANCE
            }
            callback (null, data);
          }
          else {
            let newAmount = updateState.balance - amount
            updateState.updateAttributes({balance: newAmount}, function(err, res){
              if (err) callback(err)
              else {
                let newRest = {
                  deposit: {
                      id: crypto.randomBytes(16).toString("hex"),
                      withdrawn_by: userId,
                      status: "success",
                      withdrawn_at: Date.now().toISOString,
                      amount: amount,
                      reference_id:  reference_id
                    
                  }
                }
                callback (null, newRest);
              }
            })
          } 
        })
      }
      
    }

    Wallet.remoteMethod(
      'withdrawals',
      {
        description: 'Use virtual money from my wallet',
        accepts: [
          {arg: 'amount', type: 'number', required: true},
          {arg: 'reference_id', type: 'string', required: true},
          {arg: "options", type: "object", http: "optionsFromRequest"}
        ],
        returns: {
          arg: 'result', type: 'object', root: true
        },
        http: { path: '/withdrawals', verb: 'post' }
      }
    );

    Wallet.disableWallet = function(options, callback) {
      

      if (!options.accessToken) {
        let data = {
          error : true ,
          message : MSG_ERR_LOGIN
        }
        callback (null, data);
      } else {
        let userId = options.accessToken.userId
        var filter = {
          where: {
            data: {
              owned_by : userId
            }
          }
        }

        Wallet.findOne(filter).then((checkState) => {
          if(!checkState) {
            let data = {
              error : true ,
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
      }
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

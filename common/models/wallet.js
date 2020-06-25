'use strict';

let helpers = require('utils');
let crypto = require('crypto')

module.exports = function(Wallet) {

    helpers.remoteMethod.disableAllMethods(Wallet,
		[
			'find',
			'create',
      'findById',
			'updateAttributes',
			'deleteById'
    ]);

    Wallet.enableWallet = function(cb) {

      const walletId = crypto.randomBytes(16).toString("hex");

      let data = {
        status: "success",
        data: {
          wallet: {
            id: walletId,
            owned_by: "c4d7d61f-b702-44a8-af97-5dbdafa96551",
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
          description: 'enable wallet',
          accepts: [
          ],
          returns: {
            arg: 'res', type: 'object', root: true
          },
          http: { path: '/enable', verb: 'post' }
        }
      );


     
    


      
      

};

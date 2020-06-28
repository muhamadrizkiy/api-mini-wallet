var loopback = require('loopback');

module.exports = function(app) {

var memory = loopback.createDataSource({
    connector: loopback.Memory,
    file: "mydata.json"
});

};


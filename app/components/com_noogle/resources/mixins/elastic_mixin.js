var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var request = require('request');
var elastic = require('elastic');

/* *************** MODULE ********* */

module.exports = {

    init: function(frame, cb){
        elastic.status(function(err, body){
            console.log(body);
            console.log(err);

            cb();
        })
    }
}
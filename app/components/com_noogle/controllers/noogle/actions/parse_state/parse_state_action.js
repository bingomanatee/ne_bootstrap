var _ = require('underscore');
var util = require('util');
var fs = require('fs');

/* *************** MODULE ********* */

module.exports = {

    on_validate:function (rs) {
        this.models.wizard_state.get_state(function(err, state){
            console.log('err: %s, state: %s', util.inspect(err, util.inspect(state)));
            rs.send(state ? state : {files: 0, done: 0});

        }, 'noogle', 'parse_indexes');
    }

}
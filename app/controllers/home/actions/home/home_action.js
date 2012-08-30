var util = require('util');
var _DEBUG = false;
module.exports = {
    on_validate: function(rs){
        this.on_input(rs);
    },

    on_input: function(rs){
        this.on_process(rs, rs.req_props);
    },

    on_process: function(rs, input){
        if (!input){
            input = {name: 'World'}
        } else if (!input.name){
            input.name = 'World';
        }
        if (_DEBUG) console.log('outputting %s', util.inspect(input))
        this.on_output(rs, input);
    }


}
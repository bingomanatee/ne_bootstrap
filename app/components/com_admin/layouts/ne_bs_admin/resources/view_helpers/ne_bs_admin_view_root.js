var path = require('path');
var fs = require('fs');

var _nebsavr;
module.exports = {
    init: function(rs, input, cb){

        var ln = false;
        if (input.hasOwnProperty('layout_name') && input.layout_name) {
            ln = input.layout_name
        } else {
            ln = rs.action.get_config('layout_name', false);
        };

        if (!(ln == 'ne_bs_admin')) {
            return cb();
        }

        if (!input.helpers){
            input.helpers = {};
        }

        if (!_nebsavr){
            _nebsavr = path.resolve(__dirname, '../../view');
            if (!fs.existsSync(_nebsavr)){
                throw new Error('bad path ' + _nebsavr);
            }
        }
        input.helpers.nebsavr = _nebsavr;
        cb();
    }
}
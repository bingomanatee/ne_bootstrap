var _DEBUG = true;
var util = require('util');
var _ = require('underscore');

module.exports = {
    weight:100,
    init:function (rs, input, cb) {
        var ln = rs.action.get_config('layout_name');
      if (_DEBUG) {
          console.log('input: %s', util.inspect(input));
          console.log('layout name: %s', ln);
      }
        if (!(ln == 'ne_bs_admin')){
            return cb();
        }
        ['nav', 'sidebar', 'hero'].forEach(function (t) {

            if (!input.hasOwnProperty(t)) {
                input[t] = false;
            }

        })
        input.sidebar = [
            {  title:'Administration',
                links:[
                    {link:'/admin/home', title:'Home'},
                    {link:'/admin/options', title:'Options'}
                ]}
        ];
        cb();
    }
}
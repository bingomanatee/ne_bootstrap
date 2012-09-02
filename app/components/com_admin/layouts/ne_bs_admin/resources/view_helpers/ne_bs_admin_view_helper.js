var _DEBUG = false;
var util = require('util');
var _ = require('underscore');

module.exports = {
    weight:100,
    init:function (rs, input, cb) {

        var ln = false;
        if (input.hasOwnProperty('layout_name') && input.layout_name) {
            ln = input.layout_name
        } else {
            ln = rs.action.get_config('layout_name', false);
        }

        if (!(ln == 'ne_bs_admin')) {
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
                    {link: '/', title: 'Site Home'},
                    {link:'/admin/home', title:'Admin home'},
                    {link:'/admin/options', title:'Options'}
                ]}
        ];
        cb();
    }
}
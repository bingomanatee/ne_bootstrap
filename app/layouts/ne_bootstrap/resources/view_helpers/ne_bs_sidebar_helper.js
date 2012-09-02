var _ = require('underscore');
var util = require('util');
var fs = require('fs');

function _layout_name(rs, input) {
    var ln = false;
    if (input.hasOwnProperty('layout_name') && input.layout_name) {
        ln = input.layout_name
    } else {
        ln = rs.action.get_config('layout_name', false);
    }

    return ln;
}

/* *************** MODULE ********* */

module.exports = {

    init:function (rs, input, cb) {

        if (input.sidebar) return cb();

        if (!(_layout_name(rs, input) == 'ne_bootstrap')) {
            // only apply this sidebar to the layout that we know about.
            return cb();
        }

        var member = rs.session('member');
        if (member) {
            var member_menu = {
                title:'Membership',
                links:[
                    {
                        link:'/member/' + member._id,
                        title:'viewing as ' + member.member_name
                    },
                    {
                        modal:'/sign_out',
                        link: false,
                        script:  "/js/member/sign_out/sign_out_response.js",
                        title:'Sign Out'
                    }
                ]
            }
        } else {
            var member_menu = {
                title:'Membership',
                links:[
                    {
                        modal:'/sign_in',
                        script:  "/js/member/sign_in/sign_in_response.js",
                        title:'Sign in'
                    },
                    {
                        link:'/join_us',
                        title:'Join Us'
                    }
                ]
            }
        }

        input.sidebar = [
            {  title:'Site',
                links:[
                    {link:'/', title:'Home'},
                    {link:'/admin/home', title:'Administer'}
                ]}
            ,
            member_menu
        ];
        cb();
    }
}
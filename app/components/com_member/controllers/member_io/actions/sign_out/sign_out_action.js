var _ = require('underscore');
var util = require('util');
var fs = require('fs');

/* *************** MODULE ********* */

module.exports = {

    /* ************* GET ************** */


    on_validate:function (rs) {
        this.on_input(rs);
    },

    on_input:function (rs) {
        this.on_process(rs);
    },

    on_process: function(rs){
        rs.clear_session('member');
        rs.flash('info', 'you are now signed out. Goodbye!');
        rs.go('/modal_confirm?modal_title=Signed%20Out');
    },

    _on_error_go:'/modal_error'

}
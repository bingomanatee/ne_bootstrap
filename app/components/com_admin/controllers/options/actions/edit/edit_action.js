var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var _DEBUG = true;

/* *************** MODULE ********* */

module.exports = {

    /* ************* GET ************** */


    on_get_validate:function (rs) {
        this.on_get_input(rs);
    },

    on_get_input:function (rs) {
        var self = this;
        self.on_get_process(rs, rs.req_props.name);
    },

    on_get_process:function (rs, name) {
        var target = this.models.site_options.db.find(function (i) {
            return i.get('name') == name;
        })

        this.on_output(rs, target.toJSON());
    },

    /* ************* POST ************** */

    on_post_validate:function (rs) {
        if (rs.has_content('name')){
            this.on_post_input(rs);
        } else {
            this.emit('validate_error', rs, 'no name passed');
        }
    },

    on_post_input:function (rs) {
        var name = rs.req_props.name;
        var value = rs.req_props.value;
        var target = this.models.site_options.db.find(function (i) {
            return i.get('name') == name;
        });

        if (target) {
            this.on_post_process(rs, target, value);
        } else {
            this.emit('input_error', rs, 'cannot find site option ' + name);
        }
    },

    on_post_process:function (rs, target, value) {
        target.set('value', value);
        rs.send({site_option:target.toJSON(), saved:true, error:false});
    },

    _on_post_error_go:true

}
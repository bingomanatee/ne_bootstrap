var _DEBUG = false;
var util = require('util');
var _ = require('underscore');
module.exports = {

    model:function () {
        return this.models.wizard_state;
    },

    /* ****** GET ****** */

    on_get_validate:function (rs) {
        var self = this;
        this.on_get_input(rs);
    },

    on_get_input:function (rs) {
        var self = this;
        this.models.wizard_state.get_state(function (err, state) {
            self.on_get_process(rs, state);
        }, 'init_site');
    },

    on_get_process:function (rs, state) {
        this.on_output(rs, {state: state});
    },

    /* ****** POST ****** */

    on_post_validate:function (rs) {
        var self = this;
        this.on_post_input(rs);
    },

    on_post_input:function (rs) {
        this.on_post_process(rs, rs.req_props, rs.req_props.hasOwnProperty('next'), rs.req_props.hasOwnProperty('prev'));
    },

    on_post_process:function (rs, props, next, prev) {
        if (_DEBUG) console.log('next: %s, prev: %s', util.inspect(next), util.inspect(prev));
        // note - no input here.
        if (next) {
            this.model().set_state (function(){
                rs.flash('info', 'You have completed the site wizard');
                rs.go('/init_site/done');
            }, 'done', 'init_site','wizard');
        } else if (prev) {
            rs.go('/init_site/')
        } else {
            self.on_output(rs, {})
        }

    },
    /* ****** PUT ****** */

    /* ****** DELETE ****** */

    a:'a' // last comma
}
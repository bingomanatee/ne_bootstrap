var _ = require('underscore');
var util = require('util');
var fs = require('fs');

/* *************** MODULE ********* */

module.exports = {

    on_validate:function (rs) {
        if (rs.has_content('name', 'tasks')){

            this.on_input(rs);
        } else {
            this.emit('validate_error', rs, 'missing name or tasks');
        }
    },

    on_input:function (rs) {
        this.on_process(rs, rs.req_props);
    },

    on_process:function (rs, input) {
        var self = this;
        var new_role = {
            name: input.name,
            tasks: input.tasks
        }

        this.models.member_role.put(new_role, function(err, new_role_record){
            if (err){
                self.emit('process_error', rs, err);
            } else if (new_role_record) {
                rs.flash('info', 'created new role ', + new_role_record.name);
                rs.send(new_role_record.toJSON());
            } else {
                self.emit('process_error', rs, 'Cannot create ' + util.inspect(new_role));
            }
        })
    },

    _on_error_go: true

}
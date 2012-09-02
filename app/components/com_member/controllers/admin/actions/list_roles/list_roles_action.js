var _ = require('underscore');
var util = require('util');
var fs = require('fs');

/* *************** MODULE ********* */

module.exports = {

    on_validate:function (rs) {
        var self = this;
        this.models.member.can(rs, ['admin site'], function (err, can) {
            if (err) {
                self.emit('validate_error', rs, err);
            } else if (can) {
                self.on_input(rs);
            } else {
                self.emit('validate_error', rs, 'you are not authorized to see this page')
            }
        })
    },
    _on_validate_error_go:'/',

    on_input:function (rs) {
        var self = this;
        this.models.member_role.active(function (err, roles) {
            if (err) {
                self.emit('input_error', rs, err);
            } else {
                self.models.member_task.active(function (err2, tasks) {
                    if (err2) {
                        self.emit('input_error', rs, err2);
                    } else {
                        self.on_process(rs, roles, _.pluck(tasks, 'name'));
                    }
                })
            }
        });
    },

    on_process:function (rs, roles, tasks) {
        var self = this;

        var data_table_config = {
            title:'Member Roles',
            data:roles,
            columns:[
                {label:'Name', field:'name', width:'12em'}
            ]}

        self.on_output(rs, {data_table_config:data_table_config, tasks:tasks});
    }

}
var _ = require('underscore');
var util = require('util');
var fs = require('fs');

/* *************** MODULE ********* */

module.exports = {

    on_validate:function (rs) {
        this.on_input(rs);
    },

    on_input:function (rs) {
        var self = this;
        this.models.member_role.active(function (err, roles) {
            if (err) {
                self.emit('input_error', rs, err);
            } else {
                self.models.member_task.active(function(err2, tasks){
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

        self.on_output(rs, {data_table_config:data_table_config, tasks: tasks});
    }

}
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var ejs = require('ejs');

var _edit_button = ejs.compile('<a href="/admin/member/<%= _id %>" ><i class="icon-edit"></i> Edit Member</a>');

var _roles = function(member){
    return member.roles ? member.roles.join(', ') : '--'
}
/* *************** MODULE ********* */

module.exports = {

    /* ****************** GET **************** */

    on_get_validate:function (rs) {
        this.on_get_input(rs);
    },

    on_get_input:function (rs) {
        var self = this;
        this.models.member_role.active(function (err, roles) {
            if (err) {
                self.emit('input_error', rs, err);
            } else {
                self.models.member_task.active(function (err2, tasks) {

                    if (err2) {
                        self.emit('input_error', rs, err2);
                    } else {
                        self.on_get_process(rs, roles, tasks);
                    }
                })
            }
        })
    },

    on_get_process:function (rs, roles, tasks) {

        this.on_output(rs, {
            list:false,
            roles:_.pluck(roles, 'name'),
            tasks:_.pluck(tasks, 'name')
        });
    },

    /* ************** POST **************** */

    on_post_validate:function (rs) {
        this.on_post_input(rs);
    },

    on_post_input:function (rs) {
        var self = this;

       var q = this.models.member.active().sort('member_name');

        var p = rs.req_props;
        console.log('p: %s', util.inspect(p));

        if (p.find_by_name){
            q.regex('member_name', '.*' + rs.req_props.name + '.*');
        }

        if (p.find_by_role){
            q.where('roles').in(rs.req_props.roles);
        }

        if (p.find_by_task){
            q.where('tasks').in(rs.req_props.tasks);
        }

        q.slice(0, 50);
        q.exec(function (err, members) {
            if (err) {
                self.emit('input_error', rs, 'err');
            } else {
                var data_table_config = {
                            title:'Members',
                            data:members,
                            columns:[
                                {label: 'Member_name', field: 'member_name'},
                                {label:'Real Name', field:'real_name'},
                                {label:'roles', template: _roles},
                                {label:'&nbsp;', template:_edit_button}
                            ]}

                self.on_output(rs, {list:true, data_table_config: data_table_config, "layout_name": "empty"});
            }
        })
    }

}
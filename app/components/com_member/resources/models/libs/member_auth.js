var _ = require('underscore');
var util = require('util');

var member_role_factory = require('./../member_role_model');

function _get_member_tasks(member, cb){
    if (!member.roles){
       return cb(null, []);
    } else {
        var member_roles = member_role_factory();
        member_roles.roles_tasks(member.roles, cb);
    }
}

module.exports = {

    can:function (member, can_tasks, cb) {

        if (!member){
            console.log('returning false no member');
            return cb(null, false);
        }

        console.log('can with "member" %s %s, roles %s', member.CLASS, util.inspect(member, true, 1), util.inspect(member.roles));

        if (member.CLASS == 'Req_State'){
            member = member.session('member');
            console.log('can with session member %s', util.inspect(member, true, 0));
            return this.can(member, can_tasks, cb);
        }

        if (!member.tasks) {
            this.member_tasks(member, function (err, member_tasks) {
                if (err){
                    return cb(err);
                }
                console.log('member tasks: %s, can tasks: %s', util.inspect(member_tasks), util.inspect(can_tasks));
                member.tasks = member_tasks;
                var matched_tasks = _.intersection(can_tasks, member.tasks);
                console.log('lengths %s, %s', matched_tasks.length , can_tasks.length);
                cb(null, (matched_tasks.length == can_tasks.length));
            })
        } else {
            var matched_tasks = _.intersection(can_tasks, member.tasks);
            cb(null, (matched_tasks.length == can_tasks.length));
        }

    },

    member_tasks: function(member, cb){
        var self = this;
        if (member._id){
            _get_member_tasks(member, cb);
        } else {
            this.get(member, function(err, m_record){
                if (err){
                    return cb(err);
                } else {
                    _get_member_tasks(m_record, cb)
                }
            })
        }
    }

}
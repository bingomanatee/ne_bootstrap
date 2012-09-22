var util = require('util');
var path = require('path');
var _ = require('underscore');

var NE = require('nuby-express');

module.exports = {
    name:'admin_menu',
    exec:function (rs, menus, cb) {

        var self = this;
        rs.action.models.member.can(rs, [
            "edit any scope"], function (err, can) {
            if (can) {
                self.add_menu_items(menus, 'admin', {
                    label:'Wiki',
                    weight:200,
                    links:[
                        {
                            link:'/admin/wiki/scopes',
                            type:'link',
                            label:'Scopes'
                        }
                    ]
                })
            }
            cb();
        })
    }



}
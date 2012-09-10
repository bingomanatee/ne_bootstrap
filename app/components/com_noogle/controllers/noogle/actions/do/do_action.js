var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var request = require('request');
var DOMAIN_DEBUGGABLE = 'http://nodejs.debuggable.com';
var DOMAIN_STATIC_IZS_ME = 'http://static.izs.me/irclogs/node.js'
var gate = require('gate');
var path = require('path');
var http = require('http');
var url = require('url');
var write_chat = require('write_chat');

var FILE_ROOT = path.resolve(__dirname, '../../../../chat_files');

/* ************* MODULE ************* */

module.exports = {

    on_validate:function (rs) {
        if (rs.has_content('act')){
            this.on_input(rs);
        } else {
            rs.send({error: true, message: 'no act'})
        }
    },

    on_input:function (rs) {
        var self = this;

        self.on_process(rs.req_props.act);

    },

    on_process:function (rs, act) {

        switch(act){
            case 'reindex':


                self.models.noogle_file.model.update({deleted:false},
                    {"$set":{deleted:true}},
                    {multi:true},
                    function () {
                        self.models.noogle_file.add_dirs(function () {
                            rs.send({error: false, message: 'index reset'})
                        })
                    }
                )

                break;

            default:

                rs.send({error: true, message: 'cannot execute action ' + act});

        }
    }

}
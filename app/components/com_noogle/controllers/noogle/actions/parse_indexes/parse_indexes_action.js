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
var elastic = require('elastic');
var elastic_parsing = require('elastic/parsing');

var FILE_ROOT = path.resolve(__dirname, '../../../../chat_files');
/* *************** CLOSURE ******** */

function _parse_debuggable(file_dir, cb) {
    var g = gate.create();
    fs.readdir(file_dir, function (err, files) {
        files.forEach(function (file) {

            if (/\.txt$/.test(file)) {
                var file_path = path.resolve(file_dir, file);
                var regex = /\[([^\]]+)\] ([\w]+): (.*)/;

                var ended = false;
                var lines = 0;
                var gcb = g.latch();

                elastic_parsing.parse_file(file_path, regex, function (err, result, count, fails) {
                    if (ended) {
                        return;
                    }
                    if (result == 'end') {
                        ended = true;
                        gcb(null, count, fails);
                        return;
                    }
                    if (err) {
                        ended = true;
                        gcb(err);
                        return;
                    }
                    ++lines;
                    // really no other feedback we care about

                })
            }

        });

        g.await(cb);
    })
}


function _parse_izs(file_dir, cb) {
    var g = gate.create();
    fs.readdir(file_dir, function (err, files) {
        files.forEach(function (file) {
            /**
             *
             00:50 <@isaacs> do that
             00:50 < TooTallNate> Hotroot: do that if you're only sending 1 string or buffer
             */
            if (/\.txt$/.test(file)) {
                var file_path = path.resolve(file_dir, file);
                var regex = /\[([:\d]+)\] <[ @]?([\w]+)> (.*)/;

                var ended = false;
                var lines = 0;
                var gcb = g.latch();

                elastic_parsing.parse_file(file_path, regex, function (err, result, count, fails) {
                    if (ended) {
                        return;
                    }
                    if (result == 'end') {
                        ended = true;
                        gcb(null, count, fails);
                        return;
                    }
                    if (err) {
                        ended = true;
                        gcb(err);
                        return;
                    }
                    ++lines;
                    // really no other feedback we care about

                })
            }

        });

        g.await(cb);
    })
}

/* *************** MODULE ********* */

module.exports = {

    on_validate:function (rs) {
        this.on_input(rs);
    },

    on_input:function (rs) {
        this.on_process(rs);
    },

    on_process:function (rs) {
        var self = this;
        var g = gate.create();

        fs.readdir(FILE_ROOT, function (err, dirs) {

            dirs.forEach(function (dir) {
                switch (dir) {
                    case 'nodejs.debuggable.com':
                        _parse_debuggable(path.resolve(FILE_ROOT, dir), g.latch(dir));
                        break;

                    case 'static.izs.me':
                        _parse_izs(path.resolve(FILE_ROOT, dir), g.latch(dir));
                        break;
                }
            });

            g.await(function (err, results) {
                console.log('results: %s', util.inspect(results, false, 3));
                if (err) {
                    self.emit('process_error', rs, err);
                } else {
                    function _red(m, data) {
                        m.count += parseInt(data[1]);
                        m.fails += parseInt(data[2]);
                        return m;
                    }

                    var summary = _.reduce(results['nodejs.debuggable.com'][1], _red, {count:0, fails:0});
                    summary = _.reduce(results['static.izs.me'][1], _red, summary);
                    rs.send(summary);
                }
            })
        })

        // self.on_output(rs, output);
    }

}
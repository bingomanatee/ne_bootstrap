var util = require('util');
var _ = require('underscore');
var URL = require('url');
var NE = require('nuby-express');
var mm = NE.deps.support.mongoose_model;
var gate = require('gate');

var _model;

module.exports = function (mongoose_inject) {

    if (!_model) {

        if (!mongoose_inject) {
            mongoose_inject = NE.deps.mongoose;
        }

        var ObjectId = mongoose_inject.Schema.Types.ObjectId;

        var schema = new mongoose_inject.Schema({
            domain: 'string',
            file: 'string',
            parsed: 'mixed',
            deleted:{type:Boolean, default:false}
        });

        _model = mm.create(
            schema,
            {
                name:"noogle_file",
                get_file: function(domain, file, cb){
                    this.find({domain: domain, file: file}, cb);
                },

                add_file: function(domain, file, cb){
                    var self = this;
                    this.find(domain, file, function(err, old_file){
                        if (old_file){
                            cb(null, old_file);
                        } else {
                            self.put({domain: domain, file: file, parsed: ''}, cb);
                        }
                    })
                },

                add_files: function(domain, files, cb){
                    var g = gate.create();
                    var self = this;

                    files.forEach(function(file){
                        self.add_file(domain, file, g.latch(file));
                    })

                    g.await(cb);
                },

                dom_info: function(){
                   return URL,parse(this.domain);
                }
            }, mongoose_inject
        )
    }
    return _model;
}

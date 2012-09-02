var NE = require('nuby-express');
var mm = NE.deps.support.mongoose_model;
var mongoose = NE.deps.mongoose;
var util = require('util');
var _ = require('underscore');
var ObjectId = mongoose.Schema.Types.ObjectId;
var _DEBUG = true;

var schema = new mongoose.Schema({
    member:ObjectId,
    wizard_name:String,
    step_name:String,
    state:mongoose.Schema.Types.Mixed,
    deleted:{type:Boolean, default:false}
});

var _model = mm.create(schema,
    {
        name:"wizard_state",

        set_state:function (cb, state, wiz_name, step_name, member) {
            var self = this;
            if (member) {
                this.find_one({
                    wizard_name:wiz_name,
                    step_name:step_name,
                    member:member,
                    '$nor':[
                        {deleted:true}
                    ]
                }, function (err, state_record) {
                    if (state_record) {
                        state_record.state = state;
                        state_record.save();
                    } else {
                        self.add({
                            wizard_name:wiz_name,
                            step_name:step_name,
                            member:member,
                            state:state
                        }, cb)
                    }
                })
            } else {
                this.find_one({
                    wizard_name:wiz_name,
                    step_name:step_name,
                    '$nor':[
                        {deleted:true}
                    ]
                }, function (err, state_record) {
                    if (state_record) {
                        state_record.state = state;
                        state_record.save(cb);
                    } else {
                        self.add({
                            wizard_name:wiz_name,
                            step_name:step_name,
                            state:state
                        }, cb)
                    }
                })

            }
        },

        get_state:function (cb, wiz_name, step_name, member) {

            function _found(err, doc) {
                if (err) {
                    cb(err);
                } else if (doc) {
                    cb(null, doc.state);
                } else {
                    cb(null, null);
                }
            }

            function _found_many(err, doc) {
                if (err) {
                    cb(err);
                } else if (doc) {
                    cb(null, _.reduce(doc, function(cat, item){
                        cat[item.step_name] = item.state;
                        return cat;
                    }, {}));
                } else {
                    cb(null, []);
                }
            }

            var self = this;
            if (member) {
                this.find_one({
                    wizard_name:wiz_name,
                    step_name:step_name,
                    member:member,
                    '$nor':[
                        {deleted:true}
                    ]
                }).exec(_found);

            } else if (step_name) {

                this.find_one({
                    wizard_name:wiz_name,
                    step_name:step_name,
                    '$nor':[
                        {deleted:true}
                    ]
                }).exec(_found);
            } else {

                this.find({
                    wizard_name:wiz_name,
                    '$nor':[
                        {deleted:true}
                    ]
                }).exec(_found_many);
            }

        },

        clear_state:function (cb, wiz_name, step_name, member) {
            var self = this;
            if (member) {
                var stream = this.find({
                    wizard_name:wiz_name,
                    step_name:step_name,
                    member:member
                }).stream();

            } else {

                var stream = this.find({
                    wizard_name:wiz_name,
                    step_name:step_name
                }).stream();
            }

            stream.on('data', function (doc) {
                self.delete(doc);
            });

            stream.on('error', cb);
            stream.on('close', cb);
        }
    }, mongoose
);

module.exports = function () {
    return _model;
}

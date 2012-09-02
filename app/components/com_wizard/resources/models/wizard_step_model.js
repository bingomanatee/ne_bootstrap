var NE = require('nuby-express');
var mm = NE.deps.support.mongoose_model;
var mongoose = NE.deps.mongoose;
var util = require('util');
var _ = require('underscore');
var ObjectId = mongoose.Schema.Types.ObjectId;
var _DEBUG = true;

var step_schema = new mongoose.Schema({
    wizard: ObjectId,
    title:String,
    bc_title: String,
    name: String,
    notes: String,
    content_type: {type: String, enum: ['text', 'html', 'json']},
    content: String,
    order: Number,
    deleted: false
});

var _model = mm.create(
    step_schema,
    {
        name:"wizard_step",

        find_wizard_steps: function(wizard, cb){
            if (_DEBUG) console.log('finding steps for wizard %s', util.inspect(wizard));

            if (wizard._id){
                wizard = wizard._id;
            }

            _model.find({wizard: wizard, '$nor':[{deleted: true}]}).sort('order').exec(cb);
        }
    }, mongoose
);

module.exports = function () {
    return _model;
}

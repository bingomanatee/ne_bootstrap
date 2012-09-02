var NE = require('nuby-express');
var mm = NE.deps.support.mongoose_model;
var mongoose = NE.deps.mongoose;
var util = require('util');
var _ = require('underscore');
var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new mongoose.Schema({
    name:String,
    title:String,
    notes:String,
    content_type: {type: String, enum: ['text', 'html', 'json']},
    content: String,
    def_path:String,
    parent:ObjectId,
    state:mongoose.Schema.Types.Mixed,
    deleted:{type:Boolean, default:false}
});

var _model = mm.create(
    schema,
    {
        name:"wizard",
        get_name:function (name, cb) {
            this.find_one({name:name}, cb);
        }
    }, mongoose
)

module.exports = function () {
    return _model;
}

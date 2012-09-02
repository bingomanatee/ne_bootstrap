var NE = require('nuby-express');
var mm = NE.deps.support.mongoose_model;
var mongoose = NE.deps.mongoose;
var util = require('util');
var _ = require('underscore');

var schema = new mongoose.Schema({
    name:String,
    deleted:{type:Boolean, default:false}
});

schema.statics.active = function (cb) {
    return this.find('deleted', {'$ne':true}).run(cb);
}

schema.statics.inactive = function (cb) {
    return this.find('deleted', true).run(cb);
}

var model_def = {name:"member_task", type:"model"};

var _model;

module.exports = function (mongoose_inject) {
    if (!_model) {
        _model = mm.create(schema, model_def, mongoose_inject ? mongoose_inject : mongoose);
    }
    return _model;
}

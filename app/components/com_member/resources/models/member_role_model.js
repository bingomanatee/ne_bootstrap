var NE = require('nuby-express');
var mm = NE.deps.support.mongoose_model;
var mongoose = NE.deps.mongoose;
var util = require('util');
var _ = require('underscore');
var schema = new mongoose.Schema({
    name: {type: String, index: {unique: true}},
    tasks: [String],
    deleted: {type: Boolean, deleted: true}
});

schema.statics.active = function (cb) {
    return this.find('deleted', {'$ne':true}).run(cb);
}

schema.statics.inactive = function (cb) {
    return this.find('deleted', true).run(cb);
}

var _model = mm.create(schema,
    {name:"member_role", type:"model"},
    mongoose
);

module.exports = function () {
    return _model;
}

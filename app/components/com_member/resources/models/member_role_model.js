var NE = require('nuby-express');
var mm = NE.deps.support.mongoose_model;
var mongoose = NE.deps.mongoose;
var util = require('util');
var _ = require('underscore');
var schema = new mongoose.Schema({
    name:{type:String, index:{unique:true}},
    tasks:[String],
    deleted:{type:Boolean, deleted:true}
});

schema.statics.active = function (cb) {
    return this.find('deleted', {'$ne':true}).run(cb);
}

schema.statics.inactive = function (cb) {
    return this.find('deleted', true).run(cb);
}

var _model;

var model_def = {
    name:"member_role",
    type:"model",

    roles_tasks:function (roles, cb) {
        if (!roles || (roles.length == 0)) {
            return cb(null, []);
        } else if (!_.isArray(roles)) {
            roles = [roles];
        }

        this.find({name:{"$in":roles}}, function (err, roles) {
            //@TODO: might be more efficient to cache by combination of role names on a production site.
            if (err) {
                cb(err);
            } else {
                var tasks = _.reduce(roles, function (m, r) {
                    return m.concat(r.tasks);
                }, []);
                cb(null, _.sortBy(_.uniq(tasks), _.identity));
            }

        })
    },

    options: function(checked, cb){
        this.active(function(err, roles){
            if (err){
                return cb(err);
            } else {
                var options = _.map(roles, function(role){
                    return {
                        name: role.name,
                        checked:_.include(checked, role.name)
                    };
                });
                cb(null, options);
            }
        })
    }

};

module.exports = function (mongoose_inject) {
    if (!_model) {
        _model = mm.create(schema, model_def, mongoose_inject ? mongoose_inject : mongoose);
    }
    return _model;
}

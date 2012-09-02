var NE = require('nuby-express');
var mm = NE.deps.support.mongoose_model;
var mongoose = NE.deps.mongoose;
var util = require('util');
var _ = require('underscore');
var Gate = NE.deps.support.Gate;
var _DEBUG = false;

var constraint = new mongoose.Schema({
    type:String,
    value:mongoose.Schema.Types.Mixed
});

var schema = new mongoose.Schema({
    src:{type:String, required:true},
    name:{type:String, required:true, unique:true},
    data_type:{type:String, enum:['number', 'date', 'daterange', 'string', 'text']},
    default:mongoose.Schema.Types.Mixed,
    notes:String,
    value:mongoose.Schema.Types.Mixed,
    deleted:{type:Boolean, default:false}
});

var _model = mm.create(schema,
    {
        name:"site_options",
        type:"model",
        option_value:function (name, cb) {
            var self = this;
            if (_.isArray(name)) {
                this.find({name:{"$in":name}}, function (err, opts) {
                    if (err) {
                        cb(err);
                    } else {
                        var opt_values = {};
                        name.forEach(function (n) {
                            opt_values[n] = null;
                        });
                        opts.forEach(function (o) {
                            opt_values[o.name] = o.value
                        });
                        if (_DEBUG) console.log('returning opt values: %s', util.inspect(opt_values));
                        cb(null, opt_values);
                    }
                });
            } else {
                this.find_one({name:name}, function (err, opt) {
                    if (err) {
                        cb(err);
                    } else if (opt) {
                        cb(null, opt.value);
                    } else {
                        cb(new Error('cannot find option ' + name));
                    }
                })
            }
        },

        read_resource_options:function (src) {
            var opts = src.direct_config('options');
            if (opts && _.isArray(opts)) {
                opts.forEach(function (opt) {
                    opt.src = src.path;
                    _model.find_one({name:opt.name}, function (err, opt_record) {
                        if (opt_record) {
                        } else {
                            _model.put(opt, function (err, saved_new_record) {
                                if (err) {
                                    throw err;
                                } else if (saved_new_record) {
                                    saved_new_record.value = opt.default;
                                    saved_new_record.save();
                                }
                            })
                        }
                    })
                })
            }
        },

        cache:false,

        get_cache:function (cb) {
            if (cb) {
                _model.active(function (err, options) {
                    if (err) {
                        return cb(err);
                    }
                    _model.cache = {}; // wipe out any leftover / legacy
                    options.forEach(function (option) {
                        _model.cache[option.name] = option.value;
                    });

                    cb(null, _model.cache);
                })
            } else {
                return _model.cache;
            }
        },

        /**
         * note EVERY key passed must exist or NO values are set.
         * Also, this method does NOT confirm changes.
         *
         * @param opts
         * @param cb
         * @return {*}
         */
        set_options:function (opts, cb) {
            if (!opts) return cb(new Error('no opts passed'));
            if (!_.isObject(opts)) return cb(new Error('opts are not object'));

            var self = this;
            var keys = _.sortBy(_.keys(opts), _.identity);

            this.find({name:{"$in":keys}}, function (err, opt_records) {
                if (opt_records.length < keys.length) {
                    return cb(new Error('could not find all the keys'));
                }

                var keyed_records = _.reduce(opt_records, function (kr, record) {
                    kr[record.name] = record;
                    return kr;
                }, {});


                if (_.isEqual(_.sortBy(_.keys(keyed_records), _.identity), keys)) {
                    _.each(keyed_records, function (record, key) {
                        record.value = opts[key];

                        if (_DEBUG) {
                            console.log('setting %s option to %s', record.name, record.value);
                        }
                        record.save(); // @TODO: care about response?
                        _model.cache[key] = opts[key];
                    });


                    // well... care a little bit - wait a second
                    setTimeout(function () {
                        cb(null, keyed_records);
                    }, 1000);
                } else {
                    cb(new Error('bad match of keys'));
                }
            })
        }
    }, mongoose
);

module.exports = function () {

    if (!_model) {
        _model.cache = {};
        _model.all(function (err, records) {
            if (records) {
                _.each(records, function (r) {
                    _model.cache[r.name] = r.value;
                })
            }
        });
    }

    return _model;
}

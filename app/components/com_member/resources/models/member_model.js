var NE = require('nuby-express');
var mm = NE.deps.support.mongoose_model;
var util = require('util');
var _ = require('underscore');
var _member_signin = require('member_signin');
var _member_auth = require('member_auth');

var model_def = {
    name:"member",
    type:"model"
};
_.extend(model_def, _member_signin);
_.extend(model_def, _member_auth);

var _model;

module.exports = function (mongoose_inject) {
    if (!_model){

        if (!mongoose_inject){
            mongoose_inject = NE.deps.mongoose;
        }

        var schema = new mongoose_inject.Schema({
            real_name:String,
            member_name:{type:String, required:true, index:{unique:true}},
            pass:String,
            meta_fields:mongoose_inject.Schema.Types.Mixed,
            deleted:{type:Boolean, default:false},
            location:String,
            country:String,
            locale:String,
            email:String,
            public_profile:String,
            private_profile:String,
            roles:[String],
            enc_method:{type:String, enum:['md5', 'sha1', 'sha256', 'ripemd160']},
            enc_envelope:{type:String},
            admin_notes:String
        });

      _model  = mm.create(schema, model_def, mongoose_inject);
    }
    return _model;
}

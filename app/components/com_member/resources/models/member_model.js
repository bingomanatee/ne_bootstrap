var NE = require('nuby-express');
var mm = NE.deps.support.mongoose_model;
var mongoose = NE.deps.mongoose;
var util = require('util');
var _ = require('underscore');
var paj_encrypt = require('paj_encrypt');
var _DEBUG = true;

var role_schema = new mongoose.Schema({
    name:String,
    tasks:[String]
});

var schema = new mongoose.Schema({
    real_name:String,
    member_name:{type:String, required:true, index:{unique:true}},
    pass:String,
    meta_fields:mongoose.Schema.Types.Mixed,
    deleted:{type:Boolean, default:false},
    location:String,
    country:String,
    locale:String,
    email:String,
    public_profile:String,
    private_profile:String,
    roles:[role_schema],
    enc_method:{type:String, enum:['md5', 'sha1', 'sha256', 'ripemd160']},
    enc_envelope:{type:String},
    admin_notes:String
});

var _model = mm.create(schema,
    {
        name:"member",
        type:"model",

        /**
         * note - this finds member from typical sign in fields - it doesn't
         * actually affect session.
         *
         * @param cb: function - where member goes
         * @param name can be member_name OR email
         * @param pass
         */
        sign_in:function (cb, name, pass) {
            if (_DEBUG) console.log('signing in as %s, %s', name, pass);
            if (pass) {
                if (name) {
                    _model.find_one({"$or":[
                        {member_name:name},
                        {email:name}
                    ]}, function (err, member) {
                        console.log('... result: %s, %s', util.inspect(err), util.inspect(member));
                        if (err) {
                            cb(err)
                        } else if (member) {
                           if (_DEBUG) console.log('member to test: %s', util.inspect(member));
                            try {
                                var ep = _model.encrypt_password(pass, member.enc_method, member.enc_envelope);
                                if (ep == member.pass) {
                                    cb(null, member);
                                } else {
                                    cb(new Error('bad pasword for ' + member.member_name));
                                }
                            } catch (err) {
                                cb(err)
                            }

                        } else {
                            cb(new Error("cannot find member " + name));
                        }
                    })

                } else {
                    cb(new Error('No name provided'));
                }
            } else {
                cb(new Error('No password provided'));
            }
        },

        set_member_pass:function (cb, member, pass, method, envelope) {
            if (!envelope){
                envelope = _model.make_envelope();
            }
            if (!method){
                method = 'md5';
            }
           // console.log('set_member_pass(%s,%s,%s,%s,%s)', cb,member, pass, method, envelope);
            if (!method){
                throw new Error('no method!!!!!!')
            }
            member.enc_method = method;
            member.enc_envelope = envelope;
            member.save(function (err, new_member) {
                if (err) {
                    member.enc_method = '';
                    member.enc_envelope = '';
                    member.save(function (e) {
                        if(e){
                            console.log('cannot set member pass: %s: ---- %s',util.inspect(member), util.inspect(e))
                            cb(e);
                        } else {
                            console.log('cannot set member pass: %s: ---- %s',util.inspect(member), util.inspect(err))
                            cb(err);
                        }
                    })
                } else {
                    member.pass = _model.encrypt_password(pass, method, envelope);
                    member.save(cb);
                }
            })
        },

        encrypt_password:function (pass, method, envelope) {
            if (!method){
                throw new Error('encrypt_password: no method!!!!!!')
            }
            console.log('encrypt password(%s,%s,%s)', pass, method, envelope);
            switch (method) {
                case 'md5':
                    var e_pass = envelope.replace('*', pass);
                    if (e_pass == envelope) {
                        throw new Error('bad envelope ' + envelope);
                    }


                    break;
                case 'sha1':
                    var e_pass = envelope.replace('*', pass);
                    if (e_pass == envelope) {
                        throw new Error('bad envelope ' + envelope);
                    }


                    break;
                case 'sha256':
                    var e_pass = envelope.replace('*', pass);
                    if (e_pass == envelope) {
                        throw new Error('bad envelope ' + envelope);
                    }


                    break;
                case 'ripemd160':
                    var e_pass = envelope.replace('*', pass);
                    if (e_pass == envelope) {
                        throw new Error('bad envelope ' + envelope);
                    }


                    break;

                default:
                    throw new Error('cannot find method ' + method);
            }

            return paj_encrypt[method].any(e_pass, 'utf8');
        },

        make_envelope:function () {
            return Math.random() + "*" + Math.random()
        }

    }, mongoose
);

module.exports = function () {
    return _model;
}

var util = require('util');
var _ = require('underscore');

var NE = require('nuby-express');
var mm = NE.deps.support.mongoose_model;

var _model;

module.exports = function (mongoose_inject) {

    if (!_model) {

        if (!mongoose_inject) {
            mongoose_inject = NE.deps.mongoose;
        }

        var arch_schema_def = {
            title:'string',
            author:{ type:mongoose_inject.Schema.Types.ObjectId, ref:'member' },
            write_date:'string',
            summary:'string',
            content_type:{type:'string', enum:['text', 'html', 'json']},
            content:'string'
        }

        var arch_fields = _.keys(arch_schema_def);

        var full_schema_def = _.extend({
            name:{type:'string', index:true},
            versions:[arch_schema_def],
            deleted:{type:'boolean', default:false},
            scope:{type:'string', index:true},
            scope_root:{type:'boolean', default:false}
        }, arch_schema_def);

        var schema = new mongoose_inject.Schema(full_schema_def);
        schema.index({title:true, scope:true});
        schema.index({name:true, scope:true});

        _model = mm.create(
            schema,
            {
                name:"wiki_article",
                get_title:function (title, cb, scope) {
                    if (scope) {
                        this.find_one({title:title, scope:scope}, cb);
                    } else {
                        this.find_one({title:title}, cb);
                    }
                },

                scope:function (scope, cb) {
                    this.find_one({scope_root:true, scope:scope, deleted: false}).select('-versions').exec(cb);
                },

                article: function(scope, article, cb){
                    this.find_one({scope: scope, name: article, deleted: false}).select('-versions').exec(cb);
                },

                scopes:function (cb) {
                    this.find({scope_root:true}).select('-versions').sort('name').exec(cb);
                },

                preserve:function (doc, new_data) { // call this method BEFORE you start saving updated data to the record
                    if (!doc.versions) {
                        doc.versions = [];
                    }

                    var arch_data = {};

                    arch_fields.forEach(function (key) {
                        arch_data[key] = doc[key];
                    })

                    doc.versions.push(arch_data);
                    if (doc.markModified) {
                        doc.markModified('versions');
                    }

                    if (new_data){
                        arch_fields.forEach(function (key) {
                            console.log('wiki article: setting %s to %s', key, new_data[key]);
                            doc[key] = new_data[key];
                        })
                    }
                    doc.write_date = new Date();

                    return doc;
                },

                pre_save:function (doc, author, date) {
                    if (author) {
                        doc.author = author;
                    }
                    doc.write_date = date ? date : new Date();
                    return doc;
                }

            }, mongoose_inject
        )
    }
    return _model;
}

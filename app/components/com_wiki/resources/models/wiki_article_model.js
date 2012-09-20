var util = require('util');
var _ = require('underscore');

var NE = require('nuby-express');
var mm = NE.deps.support.mongoose_model;

var _DEBUG = false;

var _model;

module.exports = function (mongoose_inject) {

    if (!_model) {

        if (!mongoose_inject) {
            mongoose_inject = NE.deps.mongoose;
        }

        var arch_schema_def = {
            title:'string',
            author:{ type:mongoose_inject.Schema.Types.ObjectId, ref:'member' },
            write_date:'date',
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
            creator:{ type:mongoose_inject.Schema.Types.ObjectId, ref:'member' },
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

                promote_basis:function (article) {
                    if (article.scope_root) {
                        return 'wiki.' + article.scope;
                    } else {
                        return 'wiki.' + article.scope + '.' + article.name;
                    }
                },

                scope:function (scope, cb, full) {
                    var q = this.find_one({scope_root:true, scope:scope, deleted:false});
                    if (full) {
                        q.populate('versions.author');
                    } else {
                        q.select('-versions');
                    }
                    q.populate('author').populate('creator').exec(cb);
                },

                article:function (scope, article, cb, full) {
                    var q = this.find_one({scope:scope, name:article, deleted:false});
                    if (full) {
                        q.populate('versions.author');
                    } else {
                        q.select('-versions');
                    }
                    q.populate('author').populate('creator').exec(cb);
                },

                scopes:function (cb, full) {
                    var q = this.find({scope_root:true, deleted: false});
                    if (full) {
                        q.populate('versions.author');
                    } else {
                        q.select('-versions');
                    }
                    q.sort('name').populate('author').populate('creator').exec(cb);
                },

                articles_for_scope:function (scope, cb, full) {
                    var q = this.find({scope_root:false, scope: scope, deleted: false});
                    if (full) {
                        q.populate('versions.author');
                    } else {
                        q.select('-versions');
                    }
                    q.sort('name').populate('author').populate('creator').exec(cb);
                },

                revise:function (article, new_data, author) {
                    this.preserve(article, new_data);
                    this.sign(article, author);
                    return article;
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

                    if (new_data) {
                        arch_fields.forEach(function (key) {
                            var value = new_data[key];
                            switch (key) {
                                case 'author':
                                    if (value._id) {
                                        value = value._id;
                                    }
                                    break;

                                case 'creator':

                                    if (value._id) {
                                        value = value._id;
                                    }
                                    break;
                            }
                            if (_DEBUG) console.log('wiki article: setting %s to %s', key, value);
                            doc[key] = value;
                        })
                    }
                    doc.write_date = new Date();

                    return doc;
                },

                sign:function (doc, author, date) {
                    if (author) {
                        if (_DEBUG) console.log('setting new scope author to ', author);
                        if (author._id) {
                            author = author._id;
                        }
                        doc.author = author;
                        if (!doc.creator) {
                            doc.creator = author;
                        }
                    }

                    doc.write_date = date ? date : new Date();
                    return doc;
                }

            }
            ,
            mongoose_inject
        )
    }
    return _model;
}

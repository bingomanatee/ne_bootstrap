var _ = require('underscore');
var util = require('util');

module.exports = {

    model:function () {
        return this.models.wiki_article;
    },

    /* ****** GET ****** */

    on_get_validate:function (rs) {
        var self = this;
        self.on_get_input(rs)
    },

    on_get_input:function (rs) {
        var self = this;
        var input = rs.req_props;
        console.log('getting scope %s, article %s', input.scope, input.article);

        function _article(err, article){
            console.log('retrieved article %s', util.inspect(article));
            if (err){
                self.emit('input_error', rs, err);
            } else if (article){
                self.on_get_process(rs, article);
            } else {
                self.emit('cannot find article ' + input.article);
            }
        }

        if (input.article) {
            this.model().article(input.scope, input.article, _article);
        } else {
            this.model().scope(input.scope, _article);
        }
    },

    on_get_process:function (rs, article) {
        var self = this;
        self.on_output(rs, {article: article})
    },

    /* ****** POST ****** */

    on_post_validate:function (rs) {
        var self = this;
        self.on_post_input(rs)
    },

    on_post_input:function (rs) {
        var self = this;
        var input = rs.req_props;
        self.on_post_process(rs, input)
    },

    on_post_process:function (rs, input) {
        var self = this;
        rs.send(input)
    },

    /* ****** PUT ****** */

    on_put_validate:function (rs) {
        var self = this;
        self.on_put_input(rs)
    },

    on_put_input:function (rs) {
        var self = this;
        var input = rs.req_props;
        self.on_put_process(rs, input)
    },

    on_put_process:function (rs, input) {
        var self = this;
        rs.send(input)
    },

    /* ****** DELETE ****** */

    on_delete_validate:function (rs) {
        var self = this;
        self.on_delete_input(rs)
    },

    on_delete_input:function (rs) {
        var self = this;
        var input = rs.req_props;
        self.on_delete_process(rs, input)
    },

    on_delete_process:function (rs, input) {
        var self = this;
        rs.send(input)
    },

    a:'a' // last comma
}
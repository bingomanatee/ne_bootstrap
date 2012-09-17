var util = require('util');

module.exports = {

    model:function () {
        return this.models.wiki_article;
    },

    /* ****** GET ****** */
    /**
     * Note - GET retrieves ONE article; there is no real scenario
     * for retrieving all articles (even all articles of a scope)
     * with a generic rest endpoint.
     *
     */

    on_get_validate:function (rs) {
        var self = this;
        self.on_get_input(rs)
    },

    on_get_input:function (rs) {
        var self = this;

        function _on_article(err, article) {
            if (err) {
                self.emit('input_error', rs, err);
            } else if (article) {
                self.on_get_process(rs, article)
            } else {
                self.emit('input_error',
                    util.format('cannot find article %s in scope %s',
                        input.article, input.scope));
            }
        }

        var input = rs.req_props;
        if (input.scope) {
            if (input.article) {
                this.model().article(input.scope, input.article, _on_article);
            } else { // scope root
                this.model().scope(input.scope, _on_article);
            }
        } else {
            this.emit('input_error', rs, 'Cannot find article without scope');
        }
    },

    on_get_process:function (rs, article) {
        var self = this;
        rs.send(article);
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
        self.on_put_input(rs);
    },

    on_put_input:function (rs) {
        var self = this;
        var input = rs.req_props;
        console.log('article rest put getting scope %s, article %s', input.scope, input.article);

        function _article(err, article){
            console.log('retrieved article %s', util.inspect(article));
            if (err){
                self.emit('input_error', rs, err);
            } else if (article){
                self.on_put_process(rs, article, input);
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

    on_put_process:function (rs, article, input) {
        var self = this;
        console.log('put: new data %s', util.inspect(input));
        this.model().preserve(article, input);
        article.save(function(err, new_art){

            var j = new_art.toJSON();
            console.log('put article %s', util.inspect(j));

            delete j.versions;
            rs.send(j)
        })
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

    _on_error_go: true
}
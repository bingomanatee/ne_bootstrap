module.exports = {

    model:function () {
        return this.models.wiki_article;
    },

    /* ****** GET ****** */

    on_validate:function (rs) {
        var self = this;
        self.on_input(rs)
    },

    on_input:function (rs) {
        var self = this;
        this.model().scope(rs.req_props.scope, function(err, scope){
            if (err){
                self.emit('input_error', rs, err);
            } else if (scope){
                self.on_process(rs, scope, [])
            } else {
                self.on_process(rs,
                    {name: rs.req_props.scope,
                     title: rs.req_props.scope.replace('_', ' ')}, [])
            }
        })
    },

    on_process:function (rs, scope, items) {
        var self = this;
        self.on_output(rs, {scope: scope, items: items})
    }
}
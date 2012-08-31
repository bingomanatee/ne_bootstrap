var BB = require('backbone');

var ModelClass;
var CollectionClass

module.exports = function () {
    if (!ModelClass) {
        ModelClass = BB.Model.extend({
            defaults:{
                "name":"--",
                "value":""
            }
        });
        CollectionClass = BB.Collection.extend({model:ModelClass}, {})
    }
    return {
        "name":"site_options",
        ModelClass:ModelClass,
        CollecctionClass:CollectionClass,
        db:new CollectionClass([
            {
                name:'foo',
                value:1
            },
            {
                name:'bar',
                value:'Purple Posies'
            }
        ])
    };
}
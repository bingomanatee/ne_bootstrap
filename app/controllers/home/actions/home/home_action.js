var util = require('util');
var _DEBUG = true;
module.exports = {
    on_validate:function (rs) {
        this.on_input(rs);
    },

    on_input:function (rs) {
        this.on_process(rs, rs.req_props);
    },

    on_process:function (rs, input) {
        if (!input) {
            input = {name:'World'}
        } else if (!input.name) {
            input.name = 'World';
        }
        /* ************* SIDEBER ****** */


        if (input.sidebar) {
            input.sidebar = [
                {  title:'Sidebar title',
                    links:[
                        {link:'/section/1', title:'Section One'},
                        {link:'/section/2', title:'Section Two'}
                    ]}
            ];
        }
        /* ************* NAV ********** */

        if (input.nav) {
            input.nav = [
                {
                    dropdown:true,
                    title:'Sections',
                    links:[
                        {link:'/section/1', title:'Section One'},
                        {link:'/section/2', title:'Section Two'}
                    ]
                },
                {
                    title:'Section 3', link:'/section/3'
                }

            ]
        }

        /* *********** HERO ************* */

        if (input.hero) {
            input.hero = {
                more:{
                    title:'Xena Warrior Princess',
                    link:'/xena'
                },
                title:'I need a hero',
                text:'Where have all good men gone <br />' +
                    'And where are all the gods? <br />' +
                    'Where’s the street-wise Hercules <br />' +
                    'To fight the rising odds? <br />' +
                    ' <br />' +
                    'Isn’t there a white knight upon a fiery steed? <br />' +
                    'Late at night I toss and turn and dream of what I need'
            }
        }

        if (_DEBUG) console.log('outputting %s', util.inspect(input))
        this.on_output(rs, input);
    }


}
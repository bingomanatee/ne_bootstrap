var tap = require('tap');
var util = require('util');
var NE = require('nuby-express');
var member_role_model = require('./../resources/models/member_role_model');
var member_task_model = require('./../resources/models/member_task_model');
var _ = require('underscore');

var con = 'mongodb://localhost/member_security_' + Math.floor(Math.random() * 100000 + .001);
console.log('creating %s', con);
NE.deps.mongoose.connect(con);
var tests_done = 0;
var TEST_COUNT = 1;

function _drop() {
    NE.deps.mongoose.connection.db.executeDbCommand({dropDatabase:1}, function (err, result) {
        console.log(err);
        console.log(result);
        process.exit(0);
    });
}

tap.test('', function (t) {

    var task_model = member_task_model();
    var role_model = member_role_model();

    task_model.add([
        {name:'alpha'},
        {name:'beta'},
        {name:'gamma'},
        {name:'delta'},
        {name: 'omega'}
    ], function(){

        role_model.add([{name: 'ab', tasks: ['alpha', 'beta']},
            {name: 'gd', tasks: ['gamma', 'delta']},
            {name: 'bg', tasks: ['beta', 'delta']},
            {name: 'admin', tasks: ['alpha','beta','gamma', 'delta', 'omega']}
        ], function(){

            role_model.roles_tasks(['bg', 'gd'], function(err, tasks){
                console.log('ab gd tasks: %s', util.inspect(tasks));

                t.ok(!_.include(tasks, 'alpha'), 'ab gd doesn\'t have alpha');
                t.ok(_.include(tasks, 'beta'), 'ab gd has beta');
                t.ok(_.include(tasks, 'gamma'), 'ab gd has gamma');
                t.ok(_.include(tasks, 'delta'), 'ab gd has delta');
                t.ok(!_.include(tasks, 'omega'), 'ab gd doesn\'t have omega');

                _drop();
                t.end();
            })


        });

    })

})
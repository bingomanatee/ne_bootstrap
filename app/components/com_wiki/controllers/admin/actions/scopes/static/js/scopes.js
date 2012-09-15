angular.module('scopes', ['scopesServices']);

angular.module('scopesServices', ['ngResource'])
    factory('Scopes',function ($resource) {
        return $resource('/admin/wiki/scope_rest/:_id', {_id:"@_id"}, {
            get:{method:'GET'},
            query:{method:'GET', isArray:true},
            add:{method:'POST' },
            update:{method:'PUT' },
            delete:{method:'DELETE'}
        });
    });/*..factory('WizardSteps', function ($resource) {
        return $resource('/admin/wizard/step_rest/:_id', {_id:"@_id"}, {
            get:{method:'GET'},
            query:{method:'GET', isArray:true},
            add:{method:'POST' },
            update:{method:'PUT' },
            delete:{method:'DELETE'}
        });
    }); */

function ScopesCtrl($scope, $filter, $compile) {

    /* *************** MODEL ************************** */

    $scope.scopes = [
        {name: 'foo', title: 'Foo', _id: 1},
        {name: 'bar', title: 'Bar', _id: 2},
        {name: 'vey', title: 'Vey', _id: 3}
    ];  // Scopes.query();
    $scope.colspan = 7;

    $scope.add_scope = function(){
        document.location='/admin/wiki/add_scope';
    }

}

ScopesCtrl.$inject = ['$scope', '$compile', 'Scopes'];



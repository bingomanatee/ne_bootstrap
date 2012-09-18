angular.module('scopes', ['scopesServices']);

angular.module('scopesServices', ['ngResource']).factory('Scopes',
    function ($resource) {
        return $resource('/admin/wiki/scope_rest/:_id', {_id:"@_id"}, {
            get:{method:'GET'},
            query:{method:'GET', isArray:true},
            add:{method:'POST' },
            update:{method:'PUT' },
            delete:{method:'DELETE'}
        });
    });

function ScopesCtrl($scope, $filter, $compile, Scopes) {

    /* *************** MODEL ************************** */

    $scope.scopes = Scopes.query(function (e, scopes) {
        console.log('got: ', e, scopes);
    });  // Scopes.query();
    $scope.colspan = 7;

    $scope.add_scope = function () {
        document.location = '/admin/wiki/add_scope';
    }

    $scope.edit_scope = function (s) {
        document.location = '/wiki/es/' + s.scope;
    }

    $scope.view_scope = function (s) {
        document.location = '/wiki/s/' + s.scope;
    }

}

ScopesCtrl.$inject = ['$scope', '$filter', '$compile', 'Scopes'];



angular.module('scopes', ['scopesServices']);

angular.module('scopesServices', ['ngResource']).factory('Scopes', function ($resource) {
    return $resource('/admin/wiki/scope_rest/:_id', {_id:"@_id"}, {
        get:{method:'GET'},
        query:{method:'GET', isArray:true},
        add:{method:'POST' },
        update:{method:'PUT' },
        delete:{method:'DELETE'}
    });
});
/*..factory('WizardSteps', function ($resource) {
 return $resource('/admin/wizard/step_rest/:_id', {_id:"@_id"}, {
 get:{method:'GET'},
 query:{method:'GET', isArray:true},
 add:{method:'POST' },
 update:{method:'PUT' },
 delete:{method:'DELETE'}
 });
 }); */

function ScopesCtrl($scope, $filter, $compile, Scopes) {

    /* *************** MODEL ************************** */

    var _def_summary = 'New scope summary...';

    $scope.scopes = [
        {name:'foo', title:'Foo', _id:1},
        {name:'bar', title:'Bar', _id:2},
        {name:'vey', title:'Vey', _id:3}
    ];  // Scopes.query();
    $scope.colspan = 7;

    $scope.new_scope = {name:'new_scope', title:'New Scope', summary:_def_summary}

    /* **************** NAME ************************** */

    $scope.name_error = '';
    $scope.name_row_class = 'control-group';
    var _name_regex = /^[a-z][\w]{4,}$/i;

    $scope.$watch('new_scope.name', function (name) {
        //     console.log('name: ', name);

        $scope.name_error = 'The scope name is required. It will be used in the URL; no spaces or special characters';
        $scope.name_row_class = 'control-group error';
        if (_name_regex.test(name)) {
            if (/new_scope/i.test(name)) {
                $scope.name_row_class = 'control-group';
            } else {
                $scope.name_error = '';
                $scope.name_row_class = 'control-group success';
            }
        }
        $scope.new_scope.name = name.toLowerCase().replace(/[\s]+/g, '_');
        _set_can_submit();
    });

    /* **************** TITLE ************************** */

    $scope.title_error = '';
    $scope.title_row_class = 'control-group';

    var _title_regex = /[^\s]{3,}/i

    $scope.$watch('new_scope.title', function (title) {
        //  console.log('title: ', title);

        $scope.title_error = 'The scope title is required. It will be shown on the page - all characters allowed';
        $scope.title_row_class = 'control-group error';
        if (_title_regex.test(title)) {
            if (/New Scope/i.test(title)) {
                $scope.title_row_class = 'control-group';
            } else {
                $scope.title_error = '';
                $scope.title_row_class = 'control-group success';
            }
        }
        _set_can_submit();
    });

    /* **************** SUMMARY ************************** */

    $scope.summary_error = '';
    $scope.summary_row_class = 'control-group';
    $scope.summary_md = '';

    var _summary_ph_regex = new RegExp(_def_summary, 'i');

    $scope.$watch('new_scope.summary', function (summary) {

        $scope.summary_error = 'The summary will be shown on lists, search results, hover overs, etc.';
        $scope.summary_row_class = 'control-group error';
        if ((summary.length > 5) && (summary.length < 500)) {
            if (_summary_ph_regex.test(summary)) {
                $scope.summary_row_class = 'control-group';
            } else {
                $scope.summary_error = '';
                $scope.summary_row_class = 'control-group success';
            }
        }
        $scope.summary_md = marked(summary);
        _set_can_submit();
    });

    /* ********************* ********************** */
    $scope.add_scope = function () {
        document.location = '/admin/wiki/add_scope';
    }

    function _set_can_submit(){
        $scope.can_submit = ((!$scope.summary_error) && (!$scope.title_error) && (!$scope.name_error));
    }

}

ScopesCtrl.$inject = ['$scope', '$compile', 'Scopes'];



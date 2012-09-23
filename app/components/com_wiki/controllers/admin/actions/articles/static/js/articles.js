angular.module('articles', ['articleservices']);

angular.module('articleservices', ['ngResource']).factory('Articles',
    function ($resource) {
        return $resource('/admin/wiki/article_rest/:scope/:name', {scope:'@scope', name:'@name'}, {
            get:{method:'GET'},
            query:{method:'GET', isArray:true},
            add:{method:'POST' },
            update:{method:'PUT' },
            delete:{method:'DELETE'}
        });
    }).filter('article_scope', function () {
        return function (article) {
            return article.scope_root ? '<b>' + article.scope + '</b>' : article.scope;
        };
    }).filter('article_name', function () {
        return function (article) {
            return article.scope_root ? '' : article.name;
        };
    });

function ArticlesCtrl($scope, $filter, $compile, Articles) {

    /* *************** MODEL ************************** */

    $scope.articles = Articles.query();

}

ArticlesCtrl.$inject = ['$scope', '$filter', '$compile', 'Articles'];



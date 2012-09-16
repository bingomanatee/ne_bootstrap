angular.module('scopes', ['scopesServices']);

angular.module('scopesServices', ['ngResource']).factory('Scopes',
    function ($resource) {
        return $resource('/wiki/article_rest/:scope/:article', {scope:"@scope", article:"@article"}, {
            get:{method:'GET'},
            query:{method:'GET', isArray:true},
            add:{method:'POST' },
            update:{method:'PUT' },
            delete:{method:'DELETE'}
        });
    });

function ScopesCtrl($scope, $filter, $compile, Scopes) {

    /* *************** MODEL ************************** */

    $scope.edit_article = Scopes.get({article:article, scope:scope});

    $scope.update_article = function () {
        Scopes.update($scope.edit_article, function (art) {
            console.log('update article result: ', art);
            if (art){
                if (art.scope_root){
                    document.location="/wiki/s/" + art.name + '?flash_info=' + encodeURI('Updated article');
                }
            }
        });
    }

    /* ********************* HELPERS ********************** */

    function _set_can_submit() {
        $scope.can_submit = (
            (!$scope.summary_error) &&
                (!$scope.content_error) &&
                (!$scope.title_error)
            );
    }

    function _update_scope_menu() {
        var rep = '<scope_menu>' + $scope.edit_article.name + '</scope_menu>';
        if (_scope_menu_regex.test($scope.edit_article.content)) {
            $scope.edit_article.content = $scope.edit_article.content.replace(_scope_menu_regex, rep);
            console.log('_update_scope_menu set content to ', $scope.edit_article.content);
        } else {
            console.log('_update_scope_menu: no scope menu in content');
        }
    }

    /* **************** TITLE ************************** */

    $scope.title_error = '';
    $scope.title_row_class = 'control-group';

    var _title_regex = /[^\s]{3,}/i

    $scope.$watch('edit_article.title', function (title) {
        //  console.log('title: ', title);

        $scope.title_error = 'The scope title is required.' +
            ' It will be shown on the page - all characters allowed';
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

    $scope.$watch('edit_article.summary', function (summary) {

        $scope.summary_error = 'The summary will be shown on lists, search results,' +
            ' hover overs, etc. It should be 5-500 characters';
        $scope.summary_row_class = 'control-group error';
        if ((summary.length > 5) && (summary.length < 500)) {
            $scope.summary_error = '';
            $scope.summary_row_class = 'control-group success';
        }
        wiki(summary, function (err, h) {
            if (err) {
                return console.log('error in wiki: ', err);
            } else {
                console.log('setting summary to ', h);
            }
            $('#summary_md').html(h);
        });
        _set_can_submit();
    });

    /* **************** SUMMARY ************************** */

    $scope.content_error = '';
    $scope.content_row_class = 'control-group';
    $scope.content_md = '';


    $scope.$watch('edit_article.content', function (content) {

        $scope.content_error = 'The content will be shown on page visits. ' +
            'It should be at least 5 characters.';
        $scope.content_row_class = 'control-group error';
        if ((content.length > 5)) {
            $scope.content_error = '';
            $scope.content_row_class = 'control-group success';
        }
        var h = wiki(content, function (err, h) {
            if (err) {
                return console.log('error in wiki: ', err);
            } else {
                console.log('setting content to ', h);
            }
            $('#content_md').html(h);
        });

        _set_can_submit();
    });

}

ScopesCtrl.$inject = ['$scope', '$filter', '$compile', 'Scopes'];



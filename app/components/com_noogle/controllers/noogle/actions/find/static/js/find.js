angular.module('messages', ['messagesServices']);

angular.module('messagesServices', ['ngResource']).factory('Messages',
    function ($resource) {
        return $resource('/noogle/find_result/:size/:start?format=json',
            {size:'@size', start:'@start'}, {
                query:{method:'POST', fr:0}
            });
    });

function MessagesCtrl($scope, $filter, $compile, Messages) {

    /* *************** MODEL ************************** */

    /* $scope.scopes = Messages.query(function (e, scopes) {
     console.log('got: ', e, scopes);
     });  // Messages.query(); */

    $scope.size = 20;
    $scope.start = 0;

    $scope.messages = [];

    $scope.m_reverse = true;

    $scope.order_field = 'date';

    $scope.find = function () {

        Messages.query({start:'' + $scope.start, size:$scope.size, search: $scope.search, format:'json'},
            function (result) {
                console.log(result);
                $scope.messages = result.hits ? _.map(result.hits.hits, function (hit) {
                    var out = hit._source;
                    out.score = hit.score;
                    if (out.time){
                        out.time_date = new Date(out.time);
                    }
                    return out;
                }) : []
            }
        )
    }

}

MessagesCtrl.$inject = ['$scope', '$filter', '$compile', 'Messages'];

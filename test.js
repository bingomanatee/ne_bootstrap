var myApp = angular.module('myApp', []).filter('median', function () {
    return function (input, lose) {
        var data = _.sortBy(input, parseFloat);
        console.log('median ordered', data);
        for (var i = 0; i < lose; ++i){
            data.pop();
            data.shift();
        }
        return data;
    };
});

//myApp.directive('myDirective', function() {});
//myApp.factory('myService', function() {});

function MyCtrl($scope, $filter) {
    var orderByFilter = $filter('orderBy');
    var filterFilter = $filter('filter');
    var limitToFilter = $filter('limitTo');

    $scope.data = [-10, 0, 5, 2, 1.25, -6, 200];
    $scope.values = [2,
        {
            foo:2},
        "et 2 brutus?",
        {
            a:1,
            foo:2,
            b:400},
        0.2,
        "two",
        3,
        {
            a:1,
            b:3}
    ];
    /**
     * note - this filter returns a Boolean value
     * to determine whether a value should be displayed.
     */
    $scope.two = 2;
    $scope.positive = function (n) {
        return n > 0
    };
    $scope.foo_two = {
        foo:2
    };

    $scope.float = parseFloat

    // ----------------- MEMBERS ---------------
    $scope.members = [
        {
            "id":1,
            "name":"Bob",
            "last":"Smith",
            "age":10,
            "gender":"m"},
        {
            "id":2,
            "name":"Jane",
            "last":"Smith",
            "gender":"f",
            "age":5},
        {
            "id":3,
            "name":"Steve",
            "last":"Austin",
            "age":50,
            "gender":"m"},

        {
            "id":4,
            "name":"Sarah",
            "last":"Connor",
            "age":35,
            "gender":"f"},
        {
            "id":5,
            "name":"Jon",
            "last":"Connor",
            "gender":"m",
            "age":16},
        {
            "id":6,
            "name":"Bab",
            "last":"Johnson",
            "gender":"f",
            "age":20},
        {
            "id":7,
            "name":"Jon",
            "last":"Jones",
            "gender":"m",
            "age":40},
        {
            "id":8,
            "name":"Sue",
            "last":"Jones",
            "gender":"m",
            "age":60}


    ];

    $scope.adults = function (m) {
        return m.age >= 18;
    };

    $scope.adult_males = function () {
        var am = filterFilter($scope.members, {
            gender:'m'
        });
        am = orderByFilter(am, 'age');
       // console.log('adult males: ', _.pluck(am, 'name'));
        return am;
    }


    $scope.$watch('members', function (m) {
        $scope.am = $scope.adult_males();
    });
    $scope.next = function (m, f) {
        var am = $scope.am;

       // console.log('looking for ', m, 'in', _.pluck(am, 'id'));
        var place = -1;
        for (var i = 0; i < am.length; ++i) {
            if (am[i].id == m.id) {
               // console.log(m, 'matches', i, am[i])
                place = i;
            }
        }
        if (place > -1) {
           // console.log('found match at ', place)
            var record = am[place + 1]
            if (record) {
          //      console.log('record', record, 'field', f);
                return f ? record[f] : record
            } else {
          //      console.log('did NOT find match for ', m);
                return '.';
            }
        } else {
            return '--';
        }
    }
}

MyCtrl.$inject = ['$scope', '$filter'];
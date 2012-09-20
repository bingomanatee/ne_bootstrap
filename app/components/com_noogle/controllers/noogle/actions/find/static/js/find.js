angular.module('messages', ['messagesServices']);

angular.module('messagesServices', ['ngResource']).factory('Messages',
    function ($resource) {
        return $resource('/noogle/find_result/:size/:start?format=json',
            {size:'@size', start:'@start'}, {
                query:{method:'POST', fr:0}
            });
    });

function MessagesCtrl($scope, $filter, $compile, Messages) {

    $('#noogle_tab a').click(function (e) {
        e.preventDefault();
        //  console.log('tabbing', this.innerHTML);
        $(this).tab('show');
    })

    $('#noogle_tab a:first').tab('show');
    /* *************** MODEL ************************** */

    /* $scope.scopes = Messages.query(function (e, scopes) {
     console.log('got: ', e, scopes);
     });  // Messages.query(); */

    $scope.size = 20;
    $scope.start = 0;
    $scope.show_words = true;
    $scope.words = [];

    $scope.users = [];
    
    var _stopwords = 'a,about,above,after,again,against,all,am,an,and,any,are,aren\'t,as,at,be,because,been,before,being,below,between,both,but,by,can\'t,cannot,could,couldn\'t,did,didn\'t,do,does,doesn\'t,doing,don\'t,down,during,each,few,for,from,further,had,hadn\'t,has,hasn\'t,have,haven\'t,having,he,he\'d,he\'ll,he\'s,her,here,here\'s,hers,herself,him,himself,his,how,how\'s,i,i\'d,i\'ll,i\'m,i\'ve,if,in,into,is,isn\'t,it,it\'s,its,itself,let\'s,me,more,most,mustn\'t,my,myself,no,nor,not,of,off,on,once,only,or,other,ought,our,ours,ourselves,out,over,own,same,shan\'t,she,she\'d,she\'ll,she\'s,should,shouldn\'t,so,some,such,than,that,that\'s,the,their,theirs,them,themselves,then,there,there\'s,these,they,they\'d,they\'ll,they\'re,they\'ve,this,those,through,to,too,under,until,up,very,was,wasn\'t,we,we\'d,we\'ll,we\'re,we\'ve,were,weren\'t,what,what\'s,when,when\'s,where,where\'s,which,while,who,who\'s,whom,why,why\'s,with,won\'t,would,wouldn\'t,you,you\'d,you\'ll,you\'re,you\'ve,your,yours,yourself,yourselves'.split(',')

    $scope.ww = {weighted: true}

    $scope.word_style= function(word){
      //  console.log($scope.words);
        if (word.weighted){
            return 'font-weight: bold; color: rgb(0,0,100)';
        } else if (word.stop ){
            return '; color: rgba(0,0,0,0.25)';
        }
    }

    function _is_weighted(word){   return word.weighted
    }
    $scope.weighted_words = function(){
        var ww = {words: _.pluck( _.filter($scope.words, _is_weighted), 'word')};

        ww.username = _.pluck( _.filter($scope.users, _is_weighted), 'username');
        return ww;
    }

    $scope.$watch('messages', function(messages){

        if (messages&& messages.length){
            var words = _.reduce($scope.messages, function(w, m){
                var mw = m.message.toLowerCase().split(/[\W]+/i);
                w = _.union(mw, w);
                m.words = mw;
                return w;
            }, []);

            words = _.sortBy(words, _.identity);

            $scope.words = _.map(words, function(w){
                return {word: w, weighted: false, stop:_.include(_stopwords, w)};
            })

            var users = _.reduce($scope.messages, function(u, m){
               if (!(_.include(u, m.username))){
                   u.push(m.username);
               }
                return u;
            }, []);

            users = _.sortBy(users, _.identity);

            $scope.users = _.map(users, function(u){
               return {username: u, weighted: false};
            });

        } else {
            $scope.words = [];
        }
    })

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

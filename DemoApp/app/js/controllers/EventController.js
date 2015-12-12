(function () {

  'use strict';

  angular.module('eventsApp').controller('EventController',['EventData','$scope',EventController]);

  function EventController(EventData, $scope){

    $scope.bindsnippet = 'Bind this';
    $scope.bool = true;
    $scope.bstyle = {color:'blue'};
    $scope.bclass = 'blue';
    $scope.sortorder = '-name';

    var vm = this;
    vm.event = EventData.event;

    vm.upVoteSession=function(session){
      session.upVoteCount++;
    }
    vm.downVoteSession=function(session){
      session.upVoteCount--;
    }

  };

})();

(function () {

  'use strict';

  angular.module('eventsApp').controller('EventController',['eventData','$scope',EventController]);

  function EventController(eventData, $scope){

    $scope.bindsnippet = 'Bind this';
    $scope.bool = true;
    $scope.bstyle = {color:'blue'};
    $scope.bclass = 'blue';
    $scope.sortorder = '-name';

    var vm = this;
    // instead of vm.event = eventData.event;
    eventData.getEvents(function(eventObjData){
      vm.event = eventObjData;
    })
    vm.upVoteSession=function(session){
      session.upVoteCount++;
    }
    vm.downVoteSession=function(session){
      session.upVoteCount--;
    }

  };

})();

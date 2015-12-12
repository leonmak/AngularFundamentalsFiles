(function () {

  'use strict';

  angular.module('eventsApp').controller('EventController',['eventData','$scope','$log' ,EventController]);

  function EventController(eventData, $scope, $log){

    $scope.bindsnippet = 'Bind this';
    $scope.bool = true;
    $scope.bstyle = {color:'blue'};
    $scope.bclass = 'blue';
    $scope.sortorder = '-name';

    var vm = this;
    // instead of vm.event = eventData.event;
    // vm.event = eventData.getEvents();
    eventData.getEvents()
    .$promise
        .then(function(data){ vm.event= data; })              // .success
        .catch(function(response){ console.log(response);}    // .error
      );

    vm.upVoteSession=function(session){
      session.upVoteCount++;
    }
    vm.downVoteSession=function(session){
      session.upVoteCount--;
    }

  };

})();

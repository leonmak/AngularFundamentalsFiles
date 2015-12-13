(function () {

  'use strict';

  angular.module('eventsApp').controller('EventController',['eventData','$scope','$log', '$anchorScroll','$routeParams',EventController]);

  function EventController(eventData, $scope, $log, $anchorScroll, $routeParams){

    $scope.bindsnippet = 'Bind this';
    $scope.bool = true;
    $scope.bstyle = {color:'blue'};
    $scope.bclass = 'blue';
    $scope.sortorder = '-name';

    $scope.scrollToSession = function(){
      $anchorScroll();
    }

    var vm = this;
    // instead of vm.event = eventData.event;
    // vm.event = eventData.getEvents();
    eventData.getEvent($routeParams.eventId)
    .$promise
    .then(function(data){ vm.event= data; console.log(vm.event);
    })              // .success
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

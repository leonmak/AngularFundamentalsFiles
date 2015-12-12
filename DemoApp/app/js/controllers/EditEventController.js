'use strict';

eventsApp.controller('EditEventController',
function EditEventController($scope,eventData){

  $scope.saveEvent = function(event, newEventForm){
    if(newEventForm.$valid){
      eventData.save(event)
      .$promise
      .then(function(res){console.log("success",res);})
      .catch(function(res){console.log("fail",res);})
    };
  };

  $scope.cancelEvent = function() {
    window.location = '/EventDetails.html';
  };

});

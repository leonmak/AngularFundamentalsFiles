'use strict';

angular.module('eventsApp').controller('EditEventController',function EditEventController($scope){

  $scope.saveEvent = function(event, newEventForm){
    if(newEventForm.$valid){ // use <form name>.$valid to see if validations pass
      window.alert(event.name, 'Valid');
    }
  };

  $scope.cancelEvent = function() {
    window.location = 'f.html/';
  };

});

eventsApp.directive('eventThumbnail', function(){
  return {
    restrict: "E",
    replace: true,
    templateUrl : '/templates/directives/eventThumbnail.html',
    scope: { // isolate scope of eventThumbnail
        event: "="
    }

  }
})

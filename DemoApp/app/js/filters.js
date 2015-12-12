'use strict';
eventsApp.filter('durations',function(){
  return function(durationIndex){
    switch(durationIndex){
      case 1: return 'Half Hour';
      case 2: return '1 Hour';
      case 3: return '2 Hours';
      case 4: return 'Half Day'
    }
  }
})

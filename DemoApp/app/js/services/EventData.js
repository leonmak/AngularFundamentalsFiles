eventsApp.factory('eventData',function($http,$log){
  return { //services return object that will become the service
    // instead of event : {.....}
    getEvents : function(callback){
      $http({method:'GET', url:'data/event/1 '})
      .success(function(data,status,headers,config){
        callback(data);
      })
      .error(function(data,status,headers,config){
        $log.warn(data,status,headers(),config);
      });
    }
  }
});

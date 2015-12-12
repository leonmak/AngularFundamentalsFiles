eventsApp.factory('eventData',function($resource){
  return { //services return object that will become the service
    // instead of event : {.....}
    getEvents : function(){
      return $resource('data/event/:id', {id:'@id'}).get({id:1});
    }
  };
});

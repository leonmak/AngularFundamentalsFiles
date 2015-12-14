'use strict';

var eventsApp = angular.module('eventsApp', ['ngResource', 'ngRoute']);

eventsApp.config(function($routeProvider, $locationProvider){
  $routeProvider.when('/newEvent',
  {
    templateUrl:'templates/NewEvent.html',
    controller: 'EditEventController'
  });
  $routeProvider.when('/events',
  {
    templateUrl: 'templates/EventList.html',
    controller: 'EventListController'
  });
  $routeProvider.when('/event/:eventId',
  {
    templateUrl: 'templates/EventDetails.html',
    controller: 'EventController as vm'
  });
  $routeProvider.otherwise({
    redirectTo: '/events'
  });
  $locationProvider.html5Mode(true);
});


eventsApp.factory('myCache',function($cacheFactory){
  return $cacheFactory('myCache', {capacity:3});
})

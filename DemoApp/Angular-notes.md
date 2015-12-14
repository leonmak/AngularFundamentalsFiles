## Controller -> Scope <-> View
Ctrl's job is to create a scoped object to 2 way bind to view
view can bind to model through the scope which exposes the model
model is data put into the scope

```html
  <div ng-controller="EventController">
    {{event.name}}
    <!-- From $scope.event = {name:...} -->
  </div>
```

to run the prg
```    
./server.sh
```

#### ng-src for images
```html
<img ng-src="{{vm.event.imageUrl}}" alt="{{vm.event.name}}">
```

#### ng-click to call functions
```html
  <div class="votingButton" ng-click="upVoteSession(session)">
```

#### if using $scope, attach all obj to $scope
```js
'use strict';

eventsApp.controller('EventController',
  function EventController($scope) {
    $scope.sortorder = 'name';
```
```html
<div ng-controller="EventController" style="padding-left:20px">
  <img ng-src="{{event.imageUrl}}" alt="{{event.name}}">
```

#### else if using IIFE method, wrap whole ctrl in IIFE
``` js
(function () {
  'use strict';
  angular.module('eventsApp').controller('EventController',[EventController]);

  function EventController(){
    var vm = this;
    vm.sortorder = 'name';
```

```html
  <div ng-controller="EventController as vm">
  <div class="votingButton" ng-click="vm.upVoteSession(session)">
  // w/o $scope need to refer to controller

```
Directives allow DOM manipulation and ways to extend HTML
like Tags, Attributes, Classes, transforming HTML into a DSL


#### ngBind
Replaces anything between tags with bound value
```html
<div ng-bind="bindsnippet">Change to bound variable</div>
```
```js
$scope.bindsnippet = 'HI THERE';
```

#### ngHide ngShow
```html
<div ng-hide="bool">hide</div>
<div ng-show="bool">Show</div>
```
```js
$scope.bool = true;
```

#### ngCloak
hides angular {{ }} until all loads
```css
[ng\:cloak], [ng-cloak], [data-ng-cloak], [x-ng-cloak], .ng-cloak, .x-ng-cloak {
  display: none !important;
}
```
```html
<body ng-cloak>
```

#### ngClass and style
```js
$scope.bstyle = {color:'blue'};
$scope.bclass = 'blue';
```
```html
<div ng-class="bclass">Blue</div>
<div ng-style="bstyle">Blue</div>
```
#### ngDisabled
```html
<button class="btn" ng-disabled="true">Btn</button>
```
#### ngNonBindable
```html
<div ng-non-bindable>{{1+2}}</div>
```

*for IE, polyfill Json and no ng-tags*

*expressions can take arrays*
### Filters
```html
<select ng-model="sortorder" class="input-small">
  <option selected value="name" >Name</option>
  <option value="-upVoteCount">Votes</option>
  <option value="-name" >Name Desc</option>
</select>
<select ng-model="query.level">
  <option value="">All</option>
  <option value="Introductory">Introductory</option>
  <option value="Intermediate">Intermediate</option>
  <option value="Advanced">Advanced</option>
</select>
<ul class="thumbnails">
  <li ng-repeat="session in vm.event.sessions | orderBy: sortorder | filter:query">
```
orderBy takes a string, sortorder is $scope.sortorder,
ng-model can change $scope.sortorder
```js
$scope.sortorder = '-name';
//default value will be -name, and option set to 'Name Desc'
```
__filter Filter__ : passes query arg (each session in sessions array) to ng-model
Then ng-model see if query.level is subset of option.value. if "" means all true

#### Custom Filters w/ .filter()
```js
// .filter(<name-of-filter>,function(){
//    return function(<input>){
//  return <o/p>}})
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
```
```html
<!-- can use in expression -->
<span>Duration: {{session.duration | durations }}</span><br />
<!-- include -->
<script src="/js/filters.js"></script>
```
Custom filters eg: durations can be injected into controllers as durationsFilter

## ngModel directive
sends user input (input, textarea, select) to scope
```html
  <style>input.ng-invalid.ng-dirty{background-color: pink}</style>
  <form name ="newEventForm">
  <!-- need <form name='..'>  to access .$invalid/.$valid -->
  <fieldset>
    <label for="eventName">Event Name:</label>
    <input type="text" id="eventName" ng-model="event.name" placeholder="Name of event" required>
    <!-- ng-model creates event object if not in the scope already -->
    <label for="eventDate">Event Date:</label>
    <input type="text" id="eventDate" ng-model="event.date" ng-pattern="/\d\d/\d\d/\d\d\d\d/" required placeholder="Date of event: mm/dd/yy">
    <!-- ng-pattern uses regex -->
    <!-- if required and 'touched', Angular marks form as ng-invalid and ng-dirty -->

    <button type='submit' ng-disabled="newEventForm.$invalid" ng-click='saveEvent(event, newEventForm)' class="btn btn-primary">Save</button>
```

## Service$
Stateless client objects, like $scope.
Whereas ctrl are for each view, services are for the entire app, like business logic.
```js
// in ctrl.js
function EditProfileController($scope, GravatarUrlBuilder) {
    $scope.getGravatarUrl = function(email) {
        return GravatarUrlBuilder.buildGravatarUrl(email);

// in service.js, abstract the buildGravatarUrl
eventsApp.factory('GravatarUrlBuilder', function() {
    return {
        buildGravatarUrl: function(email) {

```
```html
<div class="container-fluid" ng-controller="EditProfileController">
<img ng-src="{{getGravatarUrl(user.emailAddress)}}" alt="f" />
```
* Remember to include the new service in the main .html file

## Using $http w/ callback for client side getting json
```js
// in EventCtrl
var vm = this;
// instead of vm.event = eventData.event;
// Passes a callback fn to service, which runs after .success gets data
eventData.getEvents(function(eventObjData){
  vm.event = eventObjData;
})

// in eventData Service
// instead of returning
// event : {.....}
getEvents : function(callback){
  $http({method:'GET', url:'data/event/1 '})
  .success(function(data,status,headers,config){
    callback(data);
  })
  .error(function(data,status,headers,config){
    $log.warn(data,status,headers(),config);
  });
}
```

### Simulating request to server-side db with local json files
the url above has id of 1

```js
// scripts/web-server.js
var events = require('./eventsController');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/data/event/:id', events.get); //when method:'GET'
app.post('/data/event/:id', events.save);

// scripts/eventsController.js, exports get and save
var fs = require('fs');
module.exports.get = function(req, res) {
    var event = fs.readFileSync('app/data/event/' + req.params.id + '.json', 'utf8');
    res.setHeader('Content-Type', 'application/json');
    res.send(event); // send back data which success executes
};
module.exports.save = function(req, res) {
    var event = req.body;
    fs.writeFileSync('app/data/event/' + req.params.id + '.json', JSON.stringify(event));
    res.send(event);
}

```

## using http promises in client instead of callback
put success error functions in ctrl instead of services
```js
// eventData.js
getEvents : function(){
  return $http({method:'GET', url:'data/event/1 '});
}

// eventCtrl.js
eventData.getEvents()
.success(function(data){
  vm.event = data;
})
.error(function(data,status,headers,config){
  $log.warn(data,status,headers(),config);
});

```

## using $resource in client for ajax calls
so we don't need to keep typing success and error.
NOT a promise, so can't .then() Need $promise.then()
```html
<script src="/lib/angular/angular-resource.js"></script>
```
```js
// eventCtrl.js, can directly bind to getEvents()
vm.event = eventData.getEvents();

// eventData.js
eventsApp.factory('eventData',function($resource){
  return {
    getEvents : function(){
      return $resource('data/event/:id', {id:'@id'}).get({id:1});
}

// app.js
var eventsApp = angular.module('eventsApp', ['ngResource']);
```

## using $promise.then()
```js
eventData.getEvents()
.$promise
  .then(function(data){ vm.event= data; })              // .success
  .catch(function(response){ console.log(response);}    // .error
);  
// .$promise.then(
//   function(data){console.log(data);vm.event= data; }, // .success
//   function(response){ console.log(response);}         // .error
// )
```

## Saving data to json file with $resource
```js
// ctrl.js
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

// eventData service
eventsApp.factory('eventData',function($resource){
  var resource  = $resource('data/event/:id', {id:'@id'});
  return {
save: function(event){
  event.id = 999;
  return resource.save(event);
}
```
server-side same


## $anchorScroll
```html
<button class="button button-primary" ng-click="scrollToSession()">scroll</button>
```
```js
$scope.scrollToSession = function(){
  $anchorScroll();
}
```

Other $services, $parse, $compile, $locale, $timeout, $exceptionHandler(override)

# Templates
Just html, views are final product, html+model
cut the content portion out into a template, and replace w/ ng-view tag
so index.html is left with navbar, head, and footer w/ scripts

## routing
in app.js,
```js
var eventsApp = angular.module('eventsApp', ['ngResource', 'ngRoute']);
eventsApp.config(function($routeProvider){
  $routeProvider.when('/newEvent',        // when /#/newEvent
  {
    templateUrl:'template/NewEvent.html', // load file
    controller: 'EditEventController'
  })
});
```
```html
<li><a href="#/newEvent">Create Event</a></li>
<script src="/lib/angular/angular-route.js"></script>
```

## access url id w/ $routeParams
event link from EventList.html
```html
<a href="#/event/{{event.id}}">
```

```js
// in app.js routes
$routeProvider.when('/event/:eventId',
{
  templateUrl: 'templates/EventDetails.html',
  controller: 'EventController as vm'
});
$routeProvider.otherwise({
  redirectTo: '/events'
});

// in EventController.js
angular.module('eventsApp').controller('EventController',['eventData','$routeParams',EventController]);
function EventController(eventData, $routeParams){
  eventData.getEvent($routeParams.eventId)
  .$promise
  .then(function(data){ vm.event= data; console.log(vm.event);})
  .catch(function(response){ console.log(response);}
);

// in EventData.js factory, gets json based on url id
var resource  = $resource('data/event/:id', {id:'@id'});
return {
getEvent : function(eventId){
  return resource.get({id:eventId});
}

getAllEvents: function(){
  return resource.query(); // QUERY sends get request without :id
}

// server side, web-server.js
app.get('/data/event', events.getAll);

// eventsController
module.exports.getAll = function(req, res) {
    var path = 'app/data/event/';
    var files = [];
    // ... GETS ALL EVENTS AS ARRAY .. //

```

$route service can access url queries <param>?foo=bar


### Remove need for `#` in url
```html
<base href="/">

```
```js
//app.js
  eventsApp.config(function($routeProvider, $locationProvider){
  //...
  $locationProvider.html5Mode(true);
  }

// server-side, web-server.js
app.get('*', function(req,res){ res.sendFile(rootPath + '/app/index.html');});

```
* Remember to remove # in links w/ "#/events"


## resolve url for slow loading sites
```js
// app.js
$routeProvider.when('/event/:eventId',
    {
        templateUrl: 'templates/EventDetails.html',
        controller: 'EventController',
        resolve: {
            event: function($route, eventData) {
                return eventData.getEvent($route.current.pathParams.eventId).$promise;
            }
        }
    });

// EventController
$scope.event = $route.current.locals.event
```
Waits until ajax call finishes then displays, if it's minor just use ng-cloak


## $location
altv to routing, using ng-click(createEvent()) instead of href='/route'
```html
<div class="navbar" ng-controller="MainMenuController">
      <li><a href="#" ng-click="createEvent()">Create Event</a></li>
```
```js
// ctrl.js
eventsApp.controller('MainMenuController',
    function MainMenuController($scope, $location) {
        console.log('absUrl:', $location.absUrl());
        console.log('protocol:', $location.protocol());
        console.log('port:', $location.port());
        console.log('host:', $location.host());
        console.log('path:', $location.path());
        console.log('search:', $location.search());
        console.log('hash:', $location.hash());
        console.log('url:', $location.url());
        $scope.createEvent = function() {
            $location.replace();
            $location.url('/newEvent');
        }
    })
```


# Directives
Can be element, class, attribute

<appName>.directive('<dirName>',
  function(<dep/svc>){ return
    restrict: // default is a - attr, can be e,

    template: // Angular compiles for you.
//  is shortform for link:function(scope,el){
//  angular.element(element).html($compile("<div>Markup</div>")(scope))}

    replace: true
    link:
    controller:

    require:

    priority:
    terminal:
})

### Sample Directive
```html
<div class="my-sample" />

```
```js
eventsApp.directive('mySample', function($compile) {
    return {
        restrict: 'C', // for class
        template: "<input type='text' ng-model='sampleData' /> {{sampleData}}<br/>"
    };
});
```
### Element as template expanding, eg. for each event panel
Similar to how routes can allow you to 'cutout' parts of html,
Directives are like sub-templates, allowing you cutout parts of the template.
```html
// templates/eventList.html
<li ng-repeat="event in events|orderBy:sortorder" class="span5">
    <!-- put into directive eventThumbnail.html  -->
    <event-thumbnail />
</li>

// templates/directives/eventThumbnail.html
<a href="event/{{event.id}}">
//...
</a>

// index.html
<script src="/js/directives/eventThumbnail.js"></script>
```
```js
eventsApp.directive('eventsThumbnail', function(){
// Angular transforms camelCase to normal-case
  return {
    restrict: "E",
    replace: true, // so <event-thumbnail> doesn't show in resultant html
    templateUrl : '/templates/directives/eventThumbnail.html'
  }
})
```

### Passing data in attr to Isolate scope of directives
```html
<li ng-repeat="eventItem in events" class="span5">
<event-thumbnail event="eventItem" />
```
```js
scope: { // isolate scope of eventThumbnail
    event: "=" // event: "=event" // "=event" is attr
}
```
Other types of bindings:
* upvote :"&" -function
* votes  :"@" -string

```js
eventsApp.directive('upvote', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/templates/directives/upvote.html',
        scope: {
            upvote: "&",
            downvote: "&",
            count: "@" // if "=" , count="session.upVoteCount" in eventDetails.html
        }
    }
});
```
```html
/* template/directives/upvote.html */
<div class="span0 well votingWidget">
    <div class="votingButton" ng-click="upvote()">
  // upvote(): call method in scope which will call method in parent scope
        <i class="icon-chevron-up icon-white"></i>
    </div>
    <div class="badge badge-inverse">
        <div>{{count}}</div>
    </div>
    <div class="votingButton" ng-click="downvote()">
        <i class="icon-chevron-down"></i>
    </div>
</div>

/* templates/eventDetails.html */
<li ng-repeat="session in vm.event.sessions">
  <div class="row session">
    <!-- voting widget cut into directive -->
    <!-- <div class="span0 well votingWidget">
      <div class="votingButton" ng-click="vm.upVoteSession(session)">
        <i class="icon-chevron-up icon-white"></i>
      </div>
      <div class="badge badge-inverse">
        <div>{{session.upVoteCount}}</div>
      </div>
      <div class="votingButton" ng-click="vm.downVoteSession(session)">
        <i class="icon-chevron-down"></i>
      </div>
    </div> -->
<upvote upvote="vm.upVoteSession(session)" downvote="vm.downVoteSession(session)" count="{{session.upVoteCount}}"/>
/* session is mentioned only in this line, not in child directives anymore, so can reuse*/
```

### Link runs after directive is compiled and linked up
link: function(e) {elemt.on('keydown',function(event){ ... return false}) }

### Event handling with link,
restrict letters for date, bind to keydown event
```js
// dateKeys.js
link: function($scope, element, attrs, controller) {
    element.on('keydown', function(event) {
        if (isNumericKeyCode(event.keyCode) || isForwardSlashKeyCode(event.keyCode) || isNavigationKeycode(event.keyCode)) {
            return true;
        }
        return false; // False cancels input
// ... refer to isNumericKeyCode functions //
```

### El as responding to changes for gravatar:
* attrs.$observe('<attr>',function(new,old){}),
* attrs.$set('<attr>',<fn()>);
```js
eventsApp.directive('gravatar', function(gravatarUrlBuilder) { // inject service
template: '<img />',
replace: true,
link: function(scope, element, attrs, controller) {
    attrs.$observe('email', function(newValue, oldValue) {
        if(newValue !== oldValue) {
            attrs.$set('src', gravatarUrlBuilder.buildGravatarUrl(newValue));
        }
    });
```
```html
<gravatar email="{{user.emailAddress}}"/>
<!-- <img src = "<result from passing in scope's email address to gravatar>"> -->

<script src="/js/directives/gravatar.js"></script>
```

###  Attr directive using Element directive's controller:
Use require property of directive
```js
eventsApp
    .directive('greeting', function() {
        return {
            restrict: 'E',
            replace: true,
            template: "<button class='btn' ng-click='sayHello()'>Say Hello</button>",
            controller: function GreetingController($scope) {
                var greetings = ['hello'];
                $scope.sayHello = function() {
                    alert(greetings.join());
                }
                this.addGreeting = function(greeting) {
                    greetings.push(greeting);
                }
            }
        };
    })
    .directive('finnish', function() {
        return {
            restrict: 'A',
            require: 'greeting',
            link: function(scope, element, attrs, controller) {
                controller.addGreeting('hei'); // Attr use function from Element's ctrl
            }
        }
    })


```

Run attributes Order
 priority: -1,
 terminal: true,

## Sharing controllers with nested directive
```js
require: '^greeting', // ^ traverses upwards
link: function(scope, element, attrs, controller) {
    controller.addGreeting('hei');
}

```
```html
<greeting>
  <div hindi finnish>
</greeting>

```
```js
Transclusion, keep the html within directive
eventsApp.directive('collapsible', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div><h4 class="well-title" ng-click="toggleVisibility()">{{title}}</h4><div ng-show="visible" ng-transclude></div></div>',
// ng-transcule for items in between collapsible tags
        controller: function($scope) {
            $scope.visible = true;

            $scope.toggleVisibility = function() {
                $scope.visible = !$scope.visible;
            }
        },
        transclude: true,
        scope: {
            title: '@'
        }
```
```html
<collapsible title="{{session.name}}">
    <h6 style="margin-top:-10px">{{session.creatorName}}</h6>
    <span>Duration: {{session.duration | durations}}</span><br />
    <span>Level: {{session.level}}</span>
    <p>{{session.abstract}}</p>
</collapsible>
```

Manipuate DOM with compile property, advanced, eg. ng-repeat uses it internally

Making Jquery plugins more explicit
```html
// index.html
<link rel="stylesheet" href="/lib/jquery-ui-1.11.4.custom/jquery-ui.css">
<script src="/lib/jquery.min.js"></script>

// newEvent.html
<input type="text" id="eventDate" date-keys date-picker ng-model="event.date" ng-pattern="/\d\d/\d\d/\d\d\d\d/" required placeholder="Date of event: mm/dd/yy">
```
```js
eventsApp.directive('datePicker', function() {
  return {
    restrict: 'A',
    link: function(scope, element){
      element.datePicker();
    }
  }
})
```

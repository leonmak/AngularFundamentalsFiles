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

## Services
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

## Using $http
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

### Simulating request from a db with local json files
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

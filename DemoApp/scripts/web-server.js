var express = require('express');
var path = require('path');
var app= express();
var rootPath = path.normalize(__dirname +'/../');

app.use(express.static(rootPath + '/app'));
// serve the files in app w/o processing them

app.listen(8000);
console.log("Listen on 8000");

'use strict';
var e = require('express');
//var path = require('path');
var mungo = require('mongodb');
var routes = require('./index.js');
var api = require('./aldubshort.js');
require('dotenv').config({
  silent: true
});
var a = e.createServer = e();
//var a = e();
mungo.MongoClient.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/aldubshort', function(err, db) {

  if (err) {
    throw new Error('Database failure');
  } else {
    console.log('Successfully connected to MongoDB.');
  }

  a.set('view options',{layout: false});
  a.use(e.static(__dirname + '/'));
  a.get('/', function(pakiusap,tugon){
      tugon.render('index.html');
  });

  db.createCollection("sites", {
    capped: true,
    size: 5242880,
    max: 5000
  });

  routes(a, db);
  api(a, db);

  a.listen(process.env.PORT, function() {
    console.log('... listening on port ' + process.env.PORT);
  });

});


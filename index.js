'use strict';
module.exports = function(a, db) {
  a.route('/')
    .get(function(req, res) {
      res.render('index');
    });
  a.route('/luv')
    .get(function(req, res) {
      res.render('index', {
        err: "Error: See to it that you have added a proper url"
      });
    });
};
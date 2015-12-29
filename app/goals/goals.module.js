(function () {
  "use strict";

  angular
    .module('goals', [
      'ui.bootstrap',
      'ngRoute'
    ])
    .config(function ($routeProvider) {
      $routeProvider
      .when('/add-goals', {
        templateUrl: 'goals/views/add-goals.html',
        controller: 'GoalsController as goalCtrl'
      })
      .when('/view-goals', {
        templateUrl: 'goals/views/view-goals.html',
        controller: 'GoalsController as goalCtrl'
      })
      .when('/goals/strength', {
        templateUrl: 'goals/views/strength.html',
        controller: 'GoalsController as goalCtrl'
      })
      .when('/goals/stamina', {
        templateUrl: 'goals/views/stamina.html',
        controller: 'GoalsController as goalCtrl'
      })
      .when('/goals/wisdom', {
        templateUrl: 'goals/views/wisdom.html',
        controller: 'GoalsController as goalCtrl'
      })
      .when('/goals/intellect', {
        templateUrl: 'goals/views/intellect.html',
        controller: 'GoalsController as goalCtrl'
      })
      .when('/goals/dexterity', {
        templateUrl: 'goals/views/dexterity.html',
        controller: 'GoalsController as goalCtrl'
      })
        .otherwise({ redirectTo: '/404'});
    });



})();

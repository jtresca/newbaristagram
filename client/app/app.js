'use strict';

angular.module('baristagramApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'main/main',
        controller: 'MainCtrl'
      })
      .when('/admin', {
        templateUrl: 'admin/admin',
        controller: 'AdminCtrl'
      })
      .when('/failed', {
        templateUrl: 'partials/failed'
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
  });

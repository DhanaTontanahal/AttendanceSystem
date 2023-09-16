define([
    'angular',
    'angular-messages',
    'angular-route',
    'ui-grid',
    'angular-touch',
    'angular-resource',
    'jquery',
    'bootstrap',
    'ui-bootstrap',
   'angular-spinner',
   'angular-animate',
   'angular-print',//this js file defines the angular app
    // 'ng-dialog',
    './controllers/index',
    './directives/index',
    './services/index',
    './constants/index',
    './filters/index'
], function (ng) {
    'use strict';

    return ng.module('app', 
        [

        'angucomplete-alt',
        'chart.js',
        'ngMessages',
        'firebase',
        'ngRoute',
        'ui.grid',
        'ui.grid.selection', 
        'ui.grid.exporter',
        'ui.grid.pagination',
        'ui.grid.edit', 
        'ui.grid.rowEdit',
        'ui.grid.autoResize',
        'ui.grid.cellNav',
        'ngTouch',
        'ngResource',
        'ui.bootstrap',
        'ui.bootstrap.transition',
        'angularSpinner',
        'ngAnimate',
        // 'ngDialog',
        'app.services',
        'app.controllers',
        'app.directives',
        'app.constants',
        'app.filters',
        'angular-toArrayFilter',
        'AngularPrint'//Here we are  giving the module dependency..!!!!How to get the name of the Dependency..????

            ]);
});
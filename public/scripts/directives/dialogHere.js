// define(['./module'], function (directives) {
//     'use strict';
//     directives.directive('dialogHere',['$http','$rootScope' , 'ngDialog', function ($http,$rootScope,ngDialog) {

// return {
//       restrict: 'A',
//       link: function(scope, element, attrs) {
//         element.on('click', function() {
//           scope.$dialog = ngDialog.open({
//             template: '<button class="icon icon--close" data-ng-click="closeThisDialog()">close dialog</button> test',
//             plain: true,
//             className: 'inside-directive-plain',
//             name: 'inside-directive-plain',
//             showclose: false
//           });
//         });

//       }
//     };
//     }]);
// });
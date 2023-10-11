define(["./app"], function (app) {
  "use strict";
  return app.config([
    "$routeProvider",
    function ($routeProvider) {
      $routeProvider.when("/authLogin", {
        templateUrl: "partials/authentication/login.html",
        controller: "AuthenticationLoginCtrl",
      });

      $routeProvider.when("/ssmarkattendance", {
        templateUrl: "partials/satsangsamudaye/markattendance.html",
        controller: "markattendanceCtrl",
      });

      $routeProvider.when("/notes", {
        templateUrl: "partials/satsangsamudaye/notes.html",
        controller: "notesCtrl",
      });

      $routeProvider.when("/addNewActivity", {
        templateUrl: "partials/satsangsamudaye/addNewActivity.html",
        controller: "addNewActivityCtrl",
      });
      $routeProvider.when("/addNewStoreItem", {
        templateUrl: "partials/satsangsamudaye/addNewStoreItem.html",
        controller: "addNewStoreItemCtrl",
      });

      $routeProvider.when("/admingrid", {
        templateUrl: "partials/satsangsamudaye/adminGrid.html",
        controller: "adminGridCtrl",
      });

      $routeProvider.when("/ssaddNewUser", {
        templateUrl: "partials/satsangsamudaye/addNewUser.html",
        controller: "addNewUserCtrl",
      });

      $routeProvider.when("/summaryData", {
        templateUrl: "partials/satsangsamudaye/santSu.html",
        controller: "santSuCtrl",
      });

      $routeProvider.when("/BMSsummaryData", {
        templateUrl: "partials/satsangsamudaye/BMSsummaryData.html",
        controller: "BMSsummaryDataCtrl",
      });

      $routeProvider.when("/BESsummaryData", {
        templateUrl: "partials/satsangsamudaye/BESsummaryData.html",
        controller: "BESsummaryDataCtrl",
      });

      $routeProvider.when("/exportspecific", {
        templateUrl: "partials/satsangsamudaye/MCsummaryData.html",
        controller: "MCsummaryDataCtrl",
      });

      $routeProvider.when("/ECsummaryData", {
        templateUrl: "partials/satsangsamudaye/ECsummaryData.html",
        controller: "ECsummaryDataCtrl",
      });

      $routeProvider.when("/WcsummaryData", {
        templateUrl: "partials/satsangsamudaye/WcsummaryData.html",
        controller: "WcsummaryDataCtrl",
      });

      $routeProvider.when("/WwusummaryData", {
        templateUrl: "partials/satsangsamudaye/WwusummaryData.html",
        controller: "WwusummaryDataCtrl",
      });

      $routeProvider.when("/CusummaryData", {
        templateUrl: "partials/satsangsamudaye/CusummaryData.html",
        controller: "CusummaryDataCtrl",
      });

      $routeProvider.when("/esAllSD", {
        templateUrl: "partials/satsangsamudaye/esAlSum.html",
        controller: "esAlSumCtrl",
      });

      $routeProvider.when("/bmsPS", {
        templateUrl: "partials/satsangsamudaye/bmsPS.html",
        controller: "bmsPSCtrl",
      });

      $routeProvider.when("/temporaryVisitors", {
        templateUrl: "partials/satsangsamudaye/temporaryVisitors.html",
        controller: "tempororyVisitorsCtrl",
      });

      $routeProvider.when("/ssexportexcel", {
        templateUrl: "partials/satsangsamudaye/exportexcel.html",
        controller: "exportexcelCtrl",
      });

      $routeProvider.when("/ssbarCodeProcessor", {
        templateUrl: "partials/satsangsamudaye/barcodeReaderProcessor.html",
        controller: "barCodeProcessorCtrl",
      });

      $routeProvider.otherwise({
        redirectTo: "/authLogin",
      });
    },
  ]);
});

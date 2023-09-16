define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('addNewActivityCtrl',['$rootScope', '$timeout','$scope','$window', '$location', function ($rootScope,$timeout,$scope,$window,$location) {


console.log(" addNewActivityCtrl..");

$rootScope.isNewUserAdded = false;

function writeUserData(activityName,activityType) {
  firebase.database().ref('activities/'+activityName).set({
    activityName: activityName,
    activityType : activityType
  });
}


$scope.addActivity = function() {
      if($scope.message.activityName === "" || $scope.message.activityType === "")
      {
        alert("Please enter the required values");
        return;
      }
      else
      {
         writeUserData($scope.message.activityName,$scope.message.activityType);
         $rootScope.isNewActivityAdded = true;
         $scope.alreadyPresent = false;
         var hideNewActivitySuccessNotification = function() {
         	$rootScope.isNewActivityAdded = false;
         }
        $timeout(hideNewActivitySuccessNotification, 3000);
      }
  
     $scope.message.activityName = "";
     $scope.message.activityType = "";
     
     };





    }]);
});
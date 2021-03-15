define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('exportDataForBranchCodeCtrl',['$timeout','$rootScope','AuthService','$firebaseArray','uiGridExporterService', 'uiGridExporterConstants','$scope','$window', '$location', function ($timeout,$rootScope,AuthService,$firebaseArray,uiGridExporterService,uiGridExporterConstants,$scope,$window,$location) {



	$scope.getDataO = function(){
      $scope.messagesData.$loaded();
      //console.log($scope.messagesData);
    }


    

/*$scope.currentLevelUser = AuthService.resolveUser();
$rootScope.loggedInAs = $scope.currentLevelUser.email;*/

  $scope.exportExcelForBrSelData = function(branchCode)
  {
	var ref = firebase.database().ref("satsangiUsers-attendance/"+branchCode);
    $scope.messagesData = $firebaseArray(ref);
	$scope.getDataO();
	var wb = XLSX.utils.table_to_book(document.getElementById('sjs-table'));
	XLSX.writeFile(wb, "export.xlsx");
   

  }

  






    }]);
});
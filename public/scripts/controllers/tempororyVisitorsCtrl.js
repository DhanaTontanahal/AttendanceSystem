define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('tempororyVisitorsCtrl',['$timeout','$rootScope','$scope','$window', '$location', function ($timeout,$rootScope,$scope,$window,$location) {



$scope.temporary = {
	nameSatsangi:"",
  branchCode:""
};


$scope.isNewUserAdded = false;

$scope.addTV = function(){

	console.log("-"+$scope.temporary.nameSatsangi);
	addNewUIDForTodaysDateByBranchCode(0,"temporary user",$scope.temporary.nameSatsangi,"temporary","temporary user","temporary user UID",$rootScope.attendanceForThisDataGlobal,$rootScope.selectedNameOfActivityGlobal,$scope.temporary.branchCode+'-'+$scope.temporary.nameSatsangi);
	writeNewPost(0,"temporary user","temporary user","temporary user","temporary user",$rootScope.attendanceForThisDataGlobal,$rootScope.selectedNameOfActivityGlobal,$scope.temporary.branchCode+'-'+$scope.temporary.nameSatsangi,$scope.temporary.nameSatsangi);
	$scope.temporary.nameSatsangi="";
	$scope.isNewUserAdded = true;
}

var hideNewUserSuccessNotification = function() {
         $scope.isNewUserAdded = false;
          }
          $timeout(hideNewUserSuccessNotification, 3000);


function addNewUIDForTodaysDateByBranchCode(childAtts,deps,nameSatsangi,indexForRS,index,uid,datePresent,activityName,branchCode) {
  if(deps === undefined){
    deps = "-";
  }
  var postData = {
    linked:deps,
    childAtts:childAtts,
    indexForRS:indexForRS,
    index:index,
    uid: uid,
    activityName:activityName,
  
    branchCode:branchCode,
    nameSatsangi:nameSatsangi,
    datePresent:datePresent
};

  var newPostKey = firebase.database().ref().child('satsangiUsers-attendance').push().key;
  var updates = {};
  updates['/satsangiUsers-attendance/' + datePresent + '/' +activityName+'/'+ branchCode] = postData;

return firebase.database().ref().update(updates);
   
  }


function writeNewPost(childAtts,deps,indexForRS,index,uid,datePresent,eventType,branchCode,nameSatsangi) {
  if(deps === undefined){
    deps = "-";
  }
  var postData = {
    linked:deps,
    childAtts:childAtts,
    indexForRS:indexForRS,
    index:index,
    uid: uid,
    datePresent:datePresent,
    activityName:eventType,
    branchCode:branchCode,
    nameSatsangi:nameSatsangi
};
  var newPostKey = firebase.database().ref().child('satsangiUsers-attendance').push().key;
  var updates = {};
  updates['/satsangiUsers-attendance/' + eventType + '/' + branchCode+'/'+datePresent] = postData;
  firebase.database().ref().update(updates);
  
}




    }]);
});
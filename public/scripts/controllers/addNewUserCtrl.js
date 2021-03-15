define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('addNewUserCtrl',['$filter','AuthService','$rootScope', '$scope','$http','$log','$timeout',
  'uiGridConstants','$templateCache', 
  '$interval' , 'chatMessages',
   function ($filter,AuthService,$rootScope,$scope,$http,$log,$timeout,$uiGridConstants,$templateCache,$interval,chatMessages){



$timeout(function () {
      $scope.currentLevelUser = AuthService.resolveUser();
      $rootScope.loggedInAs = $scope.currentLevelUser.email;

      if($scope.currentLevelUser.email==="level1@ams.com" || $scope.currentLevelUser.email==="satsangi@ams.com")
      {
        $rootScope.levelOneUserLoggedIn = true;
      }
       else if($scope.currentLevelUser.email==="robinsdei@gmail.com" || $scope.currentLevelUser.email==="admin@ams.com" || $scope.currentLevelUser.email==="mukesh.dei90@gmail.com" || $scope.currentLevelUser.email==="level2@ams.com" || $scope.currentLevelUser.email==="hrsa03gurgaon@gmail.com")
      {
        $rootScope.levelTwoUserLoggedIn = true;
      }
      else if($scope.currentLevelUser.email==="ggauravkapoor81@gmail.com" || $scope.currentLevelUser.email==="ritukhanna77@gmail.com" || $scope.currentLevelUser.email==="kavya.rawat108@gmail.com" || $scope.currentLevelUser.email==="lpsharma9@yahoo.co.in" || $scope.currentLevelUser.email==="seth.shubhangi28@gmail.com"|| $scope.currentLevelUser.email==="level3@ams.com" || $scope.currentLevelUser.email==="bshubhanka@gmail.com" || $scope.currentLevelUser.email==="ankitadei@gmail.com")
      {
        $rootScope.levelThreeUserLoggedIn = true;
      }



    }, 2000);

$scope.fdt = $filter('date')(new Date() , 'dd-MMMM-yyyy');
$scope.attendanceForThisData = $filter('date')($scope.fdt , 'dd-MM-yyyy');

// $scope.dateValue = new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate();
$scope.dateValue = $scope.attendanceForThisData;
$scope.message = {

}


$scope.message.dateValue = $scope.dateValue ;
$scope.message.deps = "";
function writeUserData(userId, name, branchCode,dateAdded,deps) {
  firebase.database().ref('satsangiUsers/' + userId).set({
    uid: userId,
    nameSatsangi: name,
    branchCode : branchCode,
    dateValue:dateAdded,
    deps:deps
  });
}

$rootScope.isLoading = true;
$rootScope.isNewUserAdded = false;

 $scope.columns = [
  { name:'branchCode', field: 'branchCode',enableFiltering: false },
  { name:'nameSatsangi', field: 'nameSatsangi' }, 
  { name:'uid', field: 'uid' },
  { name: 'Is Present?', cellTemplate: 'mapPresent.html',enableFiltering: false  }

   ];
 $scope.gridOptions = {
  enableFiltering: true,
  enableRowSelection: true,
  enableSorting: true,
  selectionRowHeaderWidth: 35,
  rowHeight: 35,
  paginationPageSizes: [5,10,20],
  paginationPageSize: 20,
  columnDefs: $scope.columns
  };
  
$scope.gridOptions.multiSelect = true;

$scope.gridOptions.onRegisterApi = function(gridApi){
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row) {

        $scope.id = row.entity.$id;
        var id = $scope.id;
        $scope.addAttendance(id,row.isSelected);
    
    
    });

    
  gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {  
   });
    }; 



    $scope.messages = chatMessages;

    $scope.addMessage = function() {
     
      if($scope.message.nameSatsangi === "" || $scope.message.branchCode === "" || $scope.message.uid === "" || $scope.message.activityName === "" || $scope.message.dateValue=== "")
      {
        alert("Please enter the required values");
        return;
      }
      // console.log("1"+$scope.message.uid);
      // $scope.checkIfTheuserisAlreadyPresent($scope.message.uid);
      // console.log("3"+$scope.checkIfTheuserisAlreadyPresent($scope.message.uid));
      if($scope.checkIfTheuserisAlreadyPresent($scope.message.uid,$scope.message.branchCode))
      {
        // console.log("user alreadyadded...");
        return;
      }
      else
      {
        writeUserData($scope.message.uid,$scope.message.nameSatsangi,$scope.message.branchCode,$scope.message.dateValue,$scope.message.deps);
         $rootScope.isNewUserAdded = true;
         $scope.alreadyPresent = false;
         var hideNewUserSuccessNotification = function() {
         $rootScope.isNewUserAdded = false;
          }
          $timeout(hideNewUserSuccessNotification, 3000);
      }
      
     /*$scope.messages.$add({
        branchCode: $scope.message.branchCode,
        nameSatsangi: $scope.message.nameSatsangi,
        uid: $scope.message.uid,
        activityName:$scope.message.activityName,
        dateValue:$scope.message.dateValue,
       
      });*/

    
     

     $scope.message.branchCode = "";
     $scope.message.nameSatsangi = "";
     $scope.message.uid = "";
     $scope.message.activityName= "Weekly-E-Satsang";
     
     };

    $scope.getData = function(){
    $scope.messages.$loaded();

    }
    
  
  $scope.assignDatatoGrid = function(){
    $scope.gridOptions.data = $scope.messages;
  }
firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        
            var user = firebase.auth().currentUser;
              if(user != null){
                // console.log("signedin...");
                $scope.getData();
                $scope.assignDatatoGrid();
              }

              } 
              else {
               return null;
              }
      });

$scope.checkIfTheuserisAlreadyPresent = function(uid,branchCode){
// console.log("checking....for...."+uid)
$scope.satsangiUsers= firebase.database().ref('satsangiUsers');

// $scope.satsangiUsersAttendance= firebase.database().ref('satsangiUsers-attendance/'+ datePresent);
$scope.satsangiUsers.on('value', function(snapshot) {
  $scope.alreadyPresent  = false;
  if(snapshot.val() != null)
  {
    snapshot.forEach(function(childSnapshot) {

    var childData = childSnapshot.val();
    // console.log(childData.branchCode);
    // console.log((childData.branchCode === branchCode));
    if(childSnapshot.key === uid || childData.branchCode === branchCode)
    {
      // console.log("User already added for this date");
      $scope.alreadyPresent = true;
      return $scope.alreadyPresent;
    }
    else
    {
        // console.log("User not added for this date");
        // addCountForTodaysDate(dateFor,true)
        $scope.alreadyPresent = false;
        return $scope.alreadyPresent;
    }

   });

  }
  
   });

return $scope.alreadyPresent;
}



 $scope.getData();
 $scope.assignDatatoGrid();

    }]);
});
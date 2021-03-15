
define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('MCsummaryDataCtrl',['$firebaseObject','$q','$location','$firebaseArray','$filter','uiGridExporterService', 'uiGridExporterConstants','AuthService','$rootScope', '$scope','$http','$log','$timeout',
  'uiGridConstants','$templateCache', 
  '$interval' , 'chatMessages',
   function ($firebaseObject,$q,$location,$firebaseArray,$filter,uiGridExporterService,uiGridExporterConstants,AuthService,$rootScope,$scope,$http,$log,$timeout,$uiGridConstants,$templateCache,$interval,chatMessages){

firebase.database().ref("attendanceSummary").remove();

$scope.todaysDate = new Date();

$scope.generateCacheuIDName = function(){
  var ref = firebase.database().ref("satsangiUsers");
  ref.once("value")
  .then(function(snapshot) {
  if(snapshot.val() != null)
  {
    snapshot.forEach(function(childSnapshot) {
    localStorage.setItem(childSnapshot.val().uid, childSnapshot.val().nameSatsangi);
    // writeNewSummaryPost("",childSnapshot.val().uid,0,0,"");
    });
  }

  });
}

$scope.generateCacheuIDName();
// $scope.namesOfActivity =["E-Satsang","Branch Morning Satsang","Branch Evening Satsang","Branch Special Satsang","Morning Cleaning","Evening Cleaning","Windup","Weekly Cleaning","Basant Arti","Basant Bhandara","Holi Arti","Holi Bhandara","Arti","Bhandara","Copy Unit","Bag Unit","Night Duty","Select"];

$scope.namesOfActivity = ["Morning Cleaning"];
$scope.messagesData = [];

  $scope.columns1 = [
  
   { name:'Name',  visible:true,headerCellClass: 'blue',field: 'nameSatsangi' ,enableFiltering: true } ,
   { name:'UID',  visible:true,headerCellClass: 'blue',field: 'uid' ,enableFiltering: true } ,

  { name:'Morning Cleaning', visible:true, headerCellClass: 'blue', field: 'countVallueE-Satsang',enableFiltering: true },
  { name:'datesPresent', visible:true, headerCellClass: 'blue', field: 'datesPresent',enableFiltering: true },
  // { name:'Attendance count',  visible:true,headerCellClass: 'blue',field: 'countVallue' ,enableFiltering: true },
 

];

$scope.gridOptions1 = {
  enableFiltering: true,
  enableGridMenu: true,
  enableRowSelection: true,
  enableSorting: false,
  selectionRowHeaderWidth: 35,
  rowHeight: 35,
  paginationPageSizes: [5,10,20,100],
  paginationPageSize: 100,
  columnDefs: $scope.columns1
  };
  
$scope.gridOptions1.multiSelect = false;

$scope.getData1 = function(){

  $scope.messages1 = [];
  var ref = firebase.database().ref("attendanceSummary");
  $scope.messages1 =  $firebaseArray(ref);
  $scope.messages1.$loaded();

  
}

$scope.assignDatatoGrid1 = function(){
  $scope.gridOptions1.data = $scope.messages1;
}
  



$scope.getDataO = function(){
  var ref = firebase.database().ref("attendanceSummary");
  $scope.messagesData = $firebaseArray(ref);
  $scope.messagesData.$loaded();
  console.log($scope.messagesData);
    }

  setTimeout(function(){
      // $scope.getDataO();
      $scope.getData1();
      $scope.assignDatatoGrid1();
    },5000);



function writeNewSummaryPost(datesPresent,activity,uid,countVallue,countDSE,dateFor) {
  

  var postData = {
    "nameSatsangi":localStorage.getItem(uid),
    "activityE-Satsang":activity,
    "uid":uid,
    "countVallueE-Satsang":countVallue,
    "countValueDSE":countDSE,
    "dateFor":dateFor,
    "datesPresent":datesPresent.join(', ')
};
  var newPostKey = firebase.database().ref().push().key;
  var updates = {};
  updates['/attendanceSummary/'+uid] = postData;
  return firebase.database().ref().update(updates);
  
}


$scope.getDBReference = function(){
return firebase.database().ref('satsangiUsers-attendance');

}


$scope.frBrnchCode1 = $scope.getDBReference();
$scope.getAllSummary = function(activity,uid){
$scope.dateKeysForESatsang1 = [];
$scope.arrayDay = [];
$scope.dateKeysForDailySatsangEvening = [];
$scope.frBrnchCode1.child(activity).child(uid).on('value', function(snapshot)
 {
  
  if(snapshot.val() != null)
  {
    snapshot.forEach(function(childSnapshot) {

    // console.log(childSnapshot.key+"-"+JSON.stringify(childSnapshot.val()));
      $scope.dateKey = childSnapshot.key;
      if("Daily Satsang Evening" ===activity){
        $scope.dateKeysForDailySatsangEvening.push(childSnapshot.key);
      }
      if("Morning Cleaning" === activity){
        $scope.dateKeysForESatsang1.push(childSnapshot.key);
        $scope.arrayDay.push(childSnapshot.key);
      }
      // $scope.dateKeysForESatsang1.push(childSnapshot.key);
      // $scope.ESatsangPresentsFrThisBrCode1 = $scope.dateKeysForESatsang1.length;
      
  });
  }
  // document.write("Activity "+'<b>'+activity+'</b>'+"  presents for UID "+uid+"-"+$scope.dateKeysForESatsang1.length);
  // document.write("<br>")
  // document.write("<hr>")
  $scope.activity = activity;
  $scope.uid = uid;
  $scope.countVallue = $scope.dateKeysForESatsang1.length;
  $scope.countValueDSE= $scope.dateKeysForDailySatsangEvening.length;
  $scope.dateFor = $scope.dateKey;
  $scope.datesPresent = $scope.arrayDay;
  // $scope.nameSatsangi = nameSatsangi
  // console.log({activity:$scope.activity,uid:$scope.uid ,countVallue:$scope.countVallue,dateFor:$scope.dateFor});
  writeNewSummaryPost($scope.datesPresent,$scope.activity,$scope.uid,$scope.countVallue,$scope.countValueDSE,$scope.dateFor);
  
    
  
  
  
  /*console.log( 
  $scope.activity,
  $scope.uid ,
  $scope.countVallue,
  $scope.dateFor);*/
// console.log($scope.messages1.length)
// console.log("Activity "+activity+"  presents for UID "+uid+"-"+$scope.dateKeysForESatsang1.length);

});
}

$scope.getActivitySummary = function(activity){
  $scope.frBrnchCode1.child(activity).on('value', function(snapshot)
 {
  if(snapshot.val() != null)
  {
    snapshot.forEach(function(childSnapshot) {
      // console.log(JSON.stringify(childSnapshot.key))
      $scope.getAllSummary(activity,childSnapshot.key);
    });
  }
 });
}

for(var index=0 ; index< $scope.namesOfActivity.length ; index++){
  console.log($scope.namesOfActivity[index])
  $scope.getActivitySummary($scope.namesOfActivity[index]);
}

$scope.exportExcelForBrSelData = function(branchCode)
  {
  
  var wb = XLSX.utils.table_to_book(document.getElementById('summary'));
  XLSX.writeFile(wb, "exportSummary.xlsx");
   

  }


}]);
});


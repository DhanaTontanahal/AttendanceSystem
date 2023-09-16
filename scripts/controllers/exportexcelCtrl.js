define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('exportexcelCtrl',[ 'uiGridConstants', 'activitiesService', '$location','$firebaseArray', '$filter','uiGridExporterService', 'uiGridExporterConstants','AuthService','$rootScope', '$scope','$http','$log','$timeout',
  'uiGridConstants','$templateCache', 
  '$interval' , 'chatMessages',
   function ( uiGridConstants , activitiesService,$location,$firebaseArray,$filter,uiGridExporterService,uiGridExporterConstants,AuthService,$rootScope,$scope,$http,$log,$timeout,$uiGridConstants,$templateCache,$interval,chatMessages){

$scope.namesOfActivity =[];

$scope.selectedNameOfActivity = "Select";

 $scope.activitiesFromServer= activitiesService;
 
$scope.getActivitiesData = function()
  {
    $scope.activitiesFromServer.$loaded();
  }
$scope.getActivitiesData();

setTimeout(function(){
    for(var i = 0 ; i < $scope.activitiesFromServer.length ; i++){
            console.log($scope.activitiesFromServer[i].activityName)
            // $scope.namesOfActivity = ["Stamp", "LTS","Star Track","Trainings","Scheduled meetings", "Survey" , "Townhall" , "Events","Select"];
           // $scope.namesOfActivity.push($scope.activitiesFromServer[i].activityName);
          
          $scope.$apply();
          }
  },5000);

$rootScope.totalItemsPresent ={valueNum : 0};
$scope.showPie = false;

$scope.hidePieChart = function(){
$scope.showPie = false;

}
$scope.showPieChart = function(){
  $scope.labels = ["Total Strength", "Head count"];
  var one = $rootScope.totalItemsStrength.valueNum;
  var two = $rootScope.totalItemsPresent.valueNum;
  // alert(one,two)
  $scope.data = [one,two ];

  $timeout(function () {
  $scope.showPie = true;
    }, 2000);

}

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

// $scope.namesOfActivity =["E-Satsang","Branch Morning Satsang","Branch Evening Satsang","Branch Special Satsang","Morning Cleaning","Evening Cleaning","Windup","Weekly Cleaning","Basant Arti","Basant Bhandara","Holi Arti","Holi Bhandara","Arti","Bhandara","Copy Unit","Bag Unit","Night Duty","Select"];
// $scope.selectedNameOfActivity = "Select";


$scope.namesOfActivity = ["Special Cleaning", "Special Satsang", "E-Satsang", "Branch Morning Satsang", "Branch Evening Satsang", "Branch Special Satsang", "Morning Cleaning", "Evening Cleaning", "Windup", "Weekly Cleaning", "Basant Arti", "Basant Bhandara", "Holi Arti", "Holi Bhandara", "Arti", "Bhandara", "Copy Unit", "Bag Unit", "Night Duty", "Select"];

// $scope.namesOfActivity = ["Special Cleaning" , "Special Satsang","E-Satsang", "Branch Satsang", "Bhandara","Aarti","Cleaning Sewa","Mahila Association","Medical Camp","Daily Satsang Morning","Daily Satsang Evening","Night Duty","Youth Path","Helpdesk E-Satsang","Helpdesk-Aarti","Helpdesk Bhandara" , "Select"];
// $scope.selectedNameOfActivity = "E-Satsang";
$scope.fdt = $filter('date')(new Date() , 'dd-MMMM-yyyy');
$scope.attendanceForThisData = $filter('date')($scope.fdt , 'dd-MM-yyyy');
$scope.dtmax = new Date();
$scope.currentLevelUser = AuthService.resolveUser();
$rootScope.loggedInAs = $scope.currentLevelUser.email;

 $scope.openF = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.openedF = true;
    };

     $scope.dateOptions = {
      'year-format': 'yy',
      'show-weeks': false,


    };

$scope.changeActivity = function(){
  $scope.getData();
  $scope.assignDatatoGrid();
}
     $scope.changeSelectF = function(dt){
     
      $scope.attendanceForThisData =  $filter('date')(dt, 'dd-MMMM-yyyy');
      $scope.timeFromtheSelectedDate = dt.getTime();

      $scope.getData();
      $scope.assignDatatoGrid();

      $scope.attendanceForThisData = $scope.attendanceForThisData;
      console.log("hg"+$scope.attendanceForThisData)
  
    }
$rootScope.isLoading = true;
$scope.exportCsv = function() {
  console.log($scope.attendanceForThisData);

    var grid = $scope.gridApi.grid;
    var rowTypes = uiGridExporterConstants.ALL;
    var colTypes = uiGridExporterConstants.ALL;
    uiGridExporterService.csvExport(grid, rowTypes, colTypes);
  };

/*  $scope.exportPdf = function() {
    var grid = $scope.gridApi.grid;
    var rowTypes = uiGridExporterConstants.ALL;
    var colTypes = uiGridExporterConstants.ALL;
    uiGridExporterService.pdfExport(grid, rowTypes, colTypes);
  };
  */
  $scope.columns = [
  { name:'UID', visible:true, headerCellClass: 'blue', field: 'branchCode',enableFiltering: true },
  { name:'Name',  visible:true,headerCellClass: 'blue',field: 'nameSatsangi' ,enableFiltering: true }, 
  // { name:'uid',headerCellClass: 'blue',field: 'uid' },
  { name:'datePresent',enableFiltering: false,headerCellClass: 'blue',field: 'datePresent' },
   { name:'activityName',enableFiltering: false,headerCellClass: 'blue',field: 'activityName' },
  // { name: 'Dependants Present', headerCellClass: 'blue',field: 'childAtts',enableFiltering: false  }
  /*{ name:'Present', headerCellClass: 'blue',enableFiltering: false , cellTemplate:'<div>{{" Present"}}</div>' }*/

{ name:'Gender',  filter: {
          term: 'Male',
          flags: { caseSensitive: true },
          type: uiGridConstants.filter.SELECT,
          selectOptions: [ { value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' } ],
          cellFilter:  function(){
            var genderHash = {
                'Male': 'Male',
                'Female': 'Female'
              };
             
              return function(input) {
                if (!input){
                  return '';
                } else {
                  return genderHash[input];
                }
              };
          }
        },
         visible:true,headerCellClass: 'blue',field: 'gender' ,enableFiltering: true }, 
  { name:'DOB Year', visible:true, headerCellClass: 'blue', field: 'dobyear',enableFiltering: true },
  { name:'Age',  visible:true,headerCellClass: 'blue',field: 'age' ,enableFiltering: true }, 
  { name:'Initiation',filter: {
          term: 'Initiated',
          type: uiGridConstants.filter.SELECT,
          selectOptions: [ { value: 'Initiated', label: 'Initiated' }, { value: 'Jigyasu', label: 'Jigyasu' }, { value: 'Children below 18', label: 'Children below 18' }  ],
          cellFilter:  function(){
            var genderHash = {
                'Initiated': 'Initiated',
                'Jigyasu': 'Jigyasu',
                'Children below 18':'Children below 18'
              };
             
              return function(input) {
                if (!input){
                  return '';
                } else {
                  return genderHash[input];
                }
              };
          }
        }, visible:true, headerCellClass: 'blue', field: 'category',enableFiltering: true },
  
  { name:'Region', visible:true, headerCellClass: 'blue', field: 'regionName',enableFiltering: true },
  { name:'District',  visible:true,headerCellClass: 'blue',field: 'districtName' ,enableFiltering: true }, 
  { name:'Branch', visible:true, headerCellClass: 'blue', field: 'branchName',enableFiltering: true },
  



];



 $scope.gridOptions = {
  enableFiltering: true,
  enableRowSelection: false,
  enableGridMenu: true,
  // enableRowSelection: true,
  // enableSorting: true,
  // exporterCsvFilename: 'myFile.csv',
  // exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),

  enableSorting: true,
  exporterCsvFilename: 'attendance.csv',
  exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
  selectionRowHeaderWidth: 35,
  rowHeight: 35,
  paginationPageSizes: [5,10,20],
  paginationPageSize: 20,
  columnDefs: $scope.columns
  };
$scope.gridOptions.enableRowSelection = false;
$scope.gridOptions.multiSelect = false;

// $scope.gridOptions.enableFiltering = $scope.gridOptions.enableFiltering;


// $scope.gridOptions.columnDefs[4].filter.cellFilter = function(){

//   console.log("actual filter can be written here,..")
// }
$scope.gridOptions.onRegisterApi = function(gridApi){
      $scope.gridApi = gridApi;
      $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
      $scope.gridApi.core.refresh();

      $interval(function () {
        // $scope.showPie = true;
        $rootScope.totalItemsPresent.valueNum = $scope.gridApi.grid.options.totalItems;
    }, 500);
     
gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {  
   });
    }; 

$scope.dateValue = new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate();

$timeout(function () {
         $rootScope.isLoading = false;
         $rootScope.signedIn = true;
         $scope.getData();
         $scope.assignDatatoGrid();
         $scope.$apply();
        
    }, 15000);



$scope.gotoMarkAttendance = function(){
  $location.path("/ssmarkattendance");
}
$scope.getData = function(){
  var activityRef = $scope.selectedNameOfActivity;
  var dateRef = $scope.attendanceForThisData;
  var ref = firebase.database().ref("satsangiUsers-attendance").child(dateRef).child(activityRef);
  $scope.messages =  $firebaseArray(ref);
  $scope.messages.$loaded();
  }

$scope.assignDatatoGrid = function(){
  $scope.gridOptions.data = $scope.messages;
}
  $scope.getData();
  $scope.assignDatatoGrid();

 


    }]);


});


define(["./module"], function (controllers) {
  "use strict";
  controllers.controller("MCsummaryDataCtrl", [
    "$firebaseObject",
    "$q",
    "$location",
    "$firebaseArray",
    "$filter",
    "uiGridExporterService",
    "uiGridExporterConstants",
    "AuthService",
    "$rootScope",
    "activitiesService",
    "$scope",
    "$http",
    "$log",
    "$timeout",
    "uiGridConstants",
    "$templateCache",
    "$interval",
    "chatMessages",
    function (
      $firebaseObject,
      $q,
      $location,
      $firebaseArray,
      $filter,
      uiGridExporterService,
      uiGridExporterConstants,
      AuthService,
      $rootScope,
      activitiesService,
      $scope,
      $http,
      $log,
      $timeout,
      $uiGridConstants,
      $templateCache,
      $interval,
      chatMessages
    ) {

      let timerCount=30;
      $scope.showData=false;
      setInterval(()=>{
        timerCount--;
        $scope.timerCount=timerCount
        // $scope.$apply()
      },1000);

      $scope.namesOfActivity = [];
      $scope.selectedMonth="";
      $scope.monthName=""
      $scope.monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"]
      $scope.changeMonthName=function(){
        // console.log($scope.monthName)
        // $scope.getActivitySummary($scope.selectedNameOfActivity);
        $scope.showData=true;
        // $scope.$apply();
      }
      $scope.fetchActivitiesData = async function () {
        $scope.namesOfActivity = await activitiesService;
        $scope.$apply();
      };

      $scope.fetchActivitiesData();
      
      $scope.todaysDate = new Date();

      $scope.generateCacheuIDName = function () {
        var ref = firebase.database().ref("satsangiUsers");
        ref.once("value").then(function (snapshot) {
          if (snapshot.val() != null) {
            snapshot.forEach(function (childSnapshot) {
              localStorage.setItem(
                childSnapshot.val().uid,
                childSnapshot.val().nameSatsangi
              );
              // writeNewSummaryPost("",childSnapshot.val().uid,0,0,"");
            });
          }
        });
      };

      $scope.generateCacheuIDName();
      $scope.messagesData = [];

      $scope.columns1 = [
        {
          name: "Name",
          visible: true,
          headerCellClass: "blue",
          field: "nameSatsangi",
          enableFiltering: true,
        },
        {
          name: "UID",
          visible: true,
          headerCellClass: "blue",
          field: "uid",
          enableFiltering: true,
        },

        {
          name: $scope.selectedNameOfActivity,
          visible: true,
          headerCellClass: "blue",
          field: "countVallueE-Satsang",
          enableFiltering: true,
        },
        {
          name: "datesPresent",
          visible: true,
          headerCellClass: "blue",
          field: "datesPresent",
          enableFiltering: true,
        },
        // { name:'Attendance count',  visible:true,headerCellClass: 'blue',field: 'countVallue' ,enableFiltering: true },
      ];

      $scope.gridOptions1 = {
        enableFiltering: true,
        enableGridMenu: true,
        enableRowSelection: true,
        enableSorting: true,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        paginationPageSizes: [5, 10, 20, 100],
        paginationPageSize: 100,
        columnDefs: $scope.columns1,
        exporterCsvFilename: $scope.selectedNameOfActivity + ".csv",
        exporterCsvLinkElement: angular.element(
          document.querySelectorAll(".custom-csv-link-location")
        ),
      };

      $scope.gridOptions1.multiSelect = false;
      $scope.getData1 = function () {
        $scope.messages1 = [];
        var ref = firebase.database().ref("attendanceSummary");
        $scope.messages1 = $firebaseArray(ref);
        $scope.messages1.$loaded();
      };

      $scope.assignDatatoGrid1 = function () {
        $scope.gridOptions1.data = $scope.messages1;
      };

      $scope.getDataO = function () {
        var ref = firebase.database().ref("attendanceSummary");
        $scope.messagesData = $firebaseArray(ref);
        $scope.messagesData.$loaded();
        console.log($scope.messagesData);
      };

      setTimeout(function () {
        $scope.getData1();
        $scope.assignDatatoGrid1();
      }, 5000);

      function writeNewSummaryPost(
        datesPresent,
        activity,
        uid,
        countVallue,
        countDSE,
        dateFor
      ) {
        var postData = {
          nameSatsangi: localStorage.getItem(uid),
          "activityE-Satsang": activity,
          uid: uid,
          "countVallueE-Satsang": countVallue,
          countValueDSE: countDSE,
          dateFor: dateFor,
          datesPresent: datesPresent.join(", "),
        };
        var newPostKey = firebase.database().ref().push().key;
        var updates = {};
        updates["/attendanceSummary/" + uid] = postData;
        return firebase.database().ref().update(updates);
      }

      $scope.getDBReference = function () {
        return firebase.database().ref("satsangiUsers-attendance");
      };

      $scope.liveLog="";

      $scope.frBrnchCode1 = $scope.getDBReference();
      $scope.getAllSummary = function (activity, uid) {
        $scope.dateKeysForESatsang1 = [];
        $scope.arrayDay = [];
        $scope.dateKeysForDailySatsangEvening = [];
        $scope.frBrnchCode1
          .child(activity)
          .child(uid)
          .on("value", function (snapshot) {
            if (snapshot.val() != null) {
              snapshot.forEach(function (childSnapshot) {
                console.log(
                  childSnapshot.key + "-" + JSON.stringify(childSnapshot.val())
                );
                $scope.dateKey = childSnapshot.key;
                const month = $scope.dateKey.substring(
                  3,
                  $scope.dateKey.lastIndexOf("-")
                );
                const year = $scope.dateKey.substring(
                  $scope.dateKey.lastIndexOf("-") + 1,
                  $scope.dateKey.length
                );

                if ($scope.selectedNameOfActivity === activity) {
                  // console.log($scope.monthName)
                  $scope.liveLog=childSnapshot.key;
                  $scope.$apply();
                  if (year == "2023" && month == $scope.monthName) {
                  $scope.arrayDay.push(childSnapshot.key);
                  $scope.dateKeysForESatsang1.push(childSnapshot.key);
                  }
                }
              });
            }

            $scope.activity = activity;
            $scope.uid = uid;
            $scope.countVallue = $scope.dateKeysForESatsang1.length;
            $scope.countValueDSE = $scope.dateKeysForDailySatsangEvening.length;
            $scope.dateFor = $scope.dateKey;
            $scope.datesPresent = $scope.arrayDay;
            writeNewSummaryPost(
              $scope.datesPresent,
              $scope.activity,
              $scope.uid,
              $scope.countVallue,
              $scope.countValueDSE,
              $scope.dateFor
            );
          });
      };

      $scope.getActivitySummary = function (activity) {
        $scope.frBrnchCode1.child(activity).on("value", function (snapshot) {
          if (snapshot.val() != null) {
            snapshot.forEach(function (childSnapshot) {
              $scope.getAllSummary(activity, childSnapshot.key);
            });
          }
        });
      };

      $scope.selectedNameOfActivity = "";
      $scope.changeActivity = function () {
        // console.log($scope.selectedNameOfActivity);
        // $scope.getActivitySummary($scope.selectedNameOfActivity);
      };

      $scope.exportExcelForBrSelData = function (branchCode) {
        var wb = XLSX.utils.table_to_book(document.getElementById("summary"));
        XLSX.writeFile(wb, "exportSummary.xlsx");
      };

      $scope.refreshGrid=function(){
        firebase.database().ref("attendanceSummary").remove();
        setTimeout(()=>{
          $scope.getActivitySummary($scope.selectedNameOfActivity);

        },2000)
      }
    },
  ]);
});

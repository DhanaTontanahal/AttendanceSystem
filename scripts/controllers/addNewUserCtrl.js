define(['./module'], function (controllers) {
  'use strict';
  controllers.controller('addNewUserCtrl', ['$filter', 'AuthService', '$rootScope', '$scope', '$http', '$log', '$timeout',
    'uiGridConstants', '$templateCache',
    '$interval', 'chatMessages',
    function ($filter, AuthService, $rootScope, $scope, $http, $log, $timeout, $uiGridConstants, $templateCache, $interval, chatMessages) {


      $scope.importedSatsangisData={value:[]};
      $scope.importedSatsangisDataSize={value:0};

      $scope.finalCheckOfImportDataSizeAndDisplay = function(){

        alert("Satsangis Data imported successfully.");
        $scope.isNewUserAdded = true;
       firebase.database().ref('satsangiUsers').on("value", function(snapshot) {
          console.log("There are "+snapshot.numChildren()+" messages");
          $scope.importedSatsangisDataSize.value = snapshot.numChildren();
        })
      }
      $scope.processImportedSatsangisData = function(){
        const importeedData = $scope.importedSatsangisData.value;
        for(var i = 0 ; i < importeedData.length ; i++)
        {
          // console.log(importeedData[i]);
          let o1 = importeedData[i];
          let o2 = {
            branchCode:importeedData[i]["uid"],
            dateValue:new Date(),
            deps:"update dependencies",
            biometricId:"update biometric",
            regionName: "Update region",
            branchName:"Update branch",
            districtName:"Update district",
            newUID: importeedData[i]["uid"],
            dollarId: importeedData[i]["uid"]

          };
          var obj = Object.assign({}, o1, o2);
          let processRecord = obj

          console.log(processRecord);

          firebase.database().ref('satsangiUsers/' + processRecord.uid).set(processRecord);
        


        }
        $scope.finalCheckOfImportDataSizeAndDisplay();
      }
      $scope.uploadSatsangisData = function () {

        var x = document.getElementById("myFile");
        var txt = "";
        if ('files' in x) {
          if (x.files.length == 0) {
            txt = "Select one or more files.";
          } else {
            for (var i = 0; i < x.files.length; i++) {
              txt += "<br><strong>" + (i + 1) + ". file</strong><br>";
              var file = x.files[i];
              if (file) {

                var reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = function (evt) {
                  var data = evt.target.result;

                  var workbook = XLSX.read(data, {
                    type: 'binary'
                  });
            
                  workbook.SheetNames.forEach(function(sheetName) {
                    // Here is your object
                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    console.log("XL_row_object",XL_row_object);

                    $scope.importedSatsangisData.value = XL_row_object;
                    // var json_object = JSON.stringify(XL_row_object);
                    // console.log(json_object);
            
                  })

                  $scope.processImportedSatsangisData();

                  // var splitData = data.split(',');
                  // splitData.map(function (d, i) {
                  //    console.log(d.trim());
                  // })


                }


              }

              if ('name' in file) {
                txt += "name: " + file.name + "<br>";
              }
              if ('size' in file) {
                txt += "size: " + file.size + " bytes <br>";
              }
            }
          }
        }
        else {
          if (x.value == "") {
            txt += "Select one or more files.";
          } else {
            txt += "The files property is not supported by your browser!";
            txt += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead. 
          }
        }
        document.getElementById("uploadedFile").innerHTML = txt;


      }



      var stime;
      var etime;
      $scope.biometricId = "";
      var template_1 = "";
      var template_2 = "";

      $scope.scanBioMetricsAndMatch = function (biometricIdToMatch) {
        console.log("checking....for...." + biometricIdToMatch)
        $scope.satsangiUsers = firebase.database().ref('satsangiUsers');
        $scope.satsangiUsers.on('value', function (snapshot) {
          $scope.alreadyPresent = false;
          if (snapshot.val() != null) {
            snapshot.forEach(function (childSnapshot) {
              var childData = childSnapshot.val();
              // console.log("before if.......", childData.nameSatsangi);
              if (childData.biometricId !== undefined || typeof childData.biometricId !== "undefined") {
                console.log(childData.nameSatsangi , "inside if====**", childData.biometricId);
                template_1 = childData.biometricId;
                template_2 = biometricIdToMatch;
                $scope.matchScore(childData);
              }



            });

          }

        });

        return $scope.alreadyPresent;
      }




      $scope.succCapture = function (result) {
        etime = new Date();
        var duration = Math.abs(stime - etime);
        var secs = duration / 1000.0;
        // showResult('rpanel', result);
        if (result.ErrorCode == 0) {
          /* 	Display BMP data in image tag
                BMP data is in base 64 format 
          */
          if (result != null && result.BMPBase64.length > 0) {
            document.getElementById("fpimage").src = "data:image/bmp;base64," + result.BMPBase64;
          }
          template_1 = result.TemplateBase64;
          template_2 = result.TemplateBase64;
          document.getElementById('result1').innerHTML = 'Time Taken ' + secs + ' Seconds';
        }
        else {
          alert("Error Scanning Fingerprint ErrorCode = " + result.ErrorCode);
        }
      }


      $scope.failureFunc = function (error) {
      }


      $scope.fpCapture = function () {

        console.log("capturing the finger print...")
        var uri = "https://localhost:8000/SGIFPCapture";
        var params = "licstr=";
        stime = new Date();
        $.ajax(
          {
            url: uri,
            type: "POST",
            cache: false,
            data: params,
            dataType: "json",
            success: function (result) {
              console.log("the captured result is", result);



              $scope.succCapture(result);
              // $scope.matchScore();
              $scope.biometricId = result.TemplateBase64;


              var bioToMatch = $scope.biometricId;
              $scope.scanBioMetricsAndMatch(bioToMatch);




            },
            error: function (xhr, status, error) { $scope.failFunc(error); }
          });
      }



      $scope.succMatch = function (result, data) {

        if (result.ErrorCode == 0 && result.MatchingScore > 125) {
          console.log(data.nameSatsangi, "matched percentage is", result);
          $scope.thisOneRecodg = data.nameSatsangi;

          //marking attendance for the above user.
          $scope.$apply();
        }



      }


      $scope.failFunc = function(){
        console.log("Some error occurred");
        return;
      }

      $scope.thisOneRecodg ="";
      $scope.matchScore = function (data) {

        console.log("Matching the score now.....for the satsangi name as ",data.nameSatsangi)
        
        if (template_1 == "" || template_2 == "") {
          alert("Please scan two fingers to verify!!");
          return;
        }
        var uri = "https://localhost:8000/SGIMatchScore";
        var params = "template1=" + encodeURIComponent(template_1);
        params += "&template2=" + encodeURIComponent(template_2);
        params += "licstr=";
        params += "&templateFormat=" + "ISO";
        $.ajax(
          {
            url: uri,
            type: "POST",
            cache: false,
            data: params,
            dataType: "json",
            success: function (result) { $scope.succMatch(result, data); },
            error: function (xhr, status, error) { $scope.failFunc(error); }
          });
      }




      $timeout(function () {
        $scope.currentLevelUser = AuthService.resolveUser();
        $rootScope.loggedInAs = $scope.currentLevelUser.email;

        if ($scope.currentLevelUser.email === "level1@ams.com" || $scope.currentLevelUser.email === "satsangi@ams.com") {
          $rootScope.levelOneUserLoggedIn = true;
        }
        else if ($scope.currentLevelUser.email === "robinsdei@gmail.com" || $scope.currentLevelUser.email === "admin@ams.com" || $scope.currentLevelUser.email === "mukesh.dei90@gmail.com" || $scope.currentLevelUser.email === "level2@ams.com" || $scope.currentLevelUser.email === "hrsa03gurgaon@gmail.com") {
          $rootScope.levelTwoUserLoggedIn = true;
        }
        else if ($scope.currentLevelUser.email === "ggauravkapoor81@gmail.com" || $scope.currentLevelUser.email === "ritukhanna77@gmail.com" || $scope.currentLevelUser.email === "kavya.rawat108@gmail.com" || $scope.currentLevelUser.email === "lpsharma9@yahoo.co.in" || $scope.currentLevelUser.email === "seth.shubhangi28@gmail.com" || $scope.currentLevelUser.email === "level3@ams.com" || $scope.currentLevelUser.email === "bshubhanka@gmail.com" || $scope.currentLevelUser.email === "ankitadei@gmail.com") {
          $rootScope.levelThreeUserLoggedIn = true;
        }



      }, 2000);

      $scope.fdt = $filter('date')(new Date(), 'dd-MMMM-yyyy');
      $scope.attendanceForThisData = $filter('date')($scope.fdt, 'dd-MM-yyyy');

      // $scope.dateValue = new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate();
      $scope.dateValue = $scope.attendanceForThisData;
      $scope.message = {

      }


      $scope.message.dateValue = $scope.dateValue;
      $scope.message.deps = "";
      function writeUserData(userId, name, branchCode, dateAdded, deps) {
        firebase.database().ref('satsangiUsers/' + userId).set(
          {
          uid: userId,
          nameSatsangi: name,
          branchCode: branchCode,//a: append to data from exel - test comments
          dateValue: dateAdded,//a
          deps: deps,//a
          biometricId: $scope.biometricId,//a

        regionName: "Update region",//a
        branchName:"Update branch",//a
        districtName:"Update district",//a
        newUID: userId,//a
        dollarId: userId,//a
        gender: "Update gender",
        dobYear: 1980,
        category: "Update category",
        suscheme: "Update Santsuscheme",
        
        // biometricId:"update biometric" 


        }
        );

        


        


      }

      $rootScope.isLoading = true;
      $rootScope.isNewUserAdded = false;

      $scope.columns = [
        { name: 'branchCode', field: 'branchCode', enableFiltering: false },
        { name: 'nameSatsangi', field: 'nameSatsangi' },
        { name: 'uid', field: 'uid' },
        { name: 'Is Present?', cellTemplate: 'mapPresent.html', enableFiltering: false }

      ];
      $scope.gridOptions = {
        enableFiltering: true,
        enableRowSelection: true,
        enableSorting: true,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        paginationPageSizes: [5, 10, 20],
        paginationPageSize: 20,
        columnDefs: $scope.columns
      };

      $scope.gridOptions.multiSelect = true;

      $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {

          $scope.id = row.entity.$id;
          var id = $scope.id;
          $scope.addAttendance(id, row.isSelected);


        });


        gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
        });
      };



      $scope.messages = chatMessages;

      $scope.addMessage = function () {

        if ($scope.message.nameSatsangi === "" || $scope.message.branchCode === "" || $scope.message.uid === "" || $scope.message.activityName === "" || $scope.message.dateValue === "") {
          alert("Please enter the required values");
          return;
        }
        // console.log("1"+$scope.message.uid);
        // $scope.checkIfTheuserisAlreadyPresent($scope.message.uid);
        // console.log("3"+$scope.checkIfTheuserisAlreadyPresent($scope.message.uid));
        if ($scope.checkIfTheuserisAlreadyPresent($scope.message.uid, $scope.message.branchCode)) {
          console.log("user alreadyadded...");
          return;
        }
        else {
          writeUserData($scope.message.uid, $scope.message.nameSatsangi, $scope.message.branchCode, $scope.message.dateValue, $scope.message.deps);
          $rootScope.isNewUserAdded = true;
          $scope.alreadyPresent = false;
          var hideNewUserSuccessNotification = function () {
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
        $scope.message.activityName = "Weekly-E-Satsang";


      };

      $scope.getData = function () {
        $scope.messages.$loaded();

      }


      $scope.assignDatatoGrid = function () {
        $scope.gridOptions.data = $scope.messages;
      }
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

          var user = firebase.auth().currentUser;
          if (user != null) {
            // console.log("signedin...");
            $scope.getData();
            $scope.assignDatatoGrid();
          }

        }
        else {
          return null;
        }
      });

      $scope.checkIfTheuserisAlreadyPresent = function (uid, branchCode) {
        // console.log("checking....for...."+uid)
        $scope.satsangiUsers = firebase.database().ref('satsangiUsers');

        // $scope.satsangiUsersAttendance= firebase.database().ref('satsangiUsers-attendance/'+ datePresent);
        $scope.satsangiUsers.on('value', function (snapshot) {
          $scope.alreadyPresent = false;
          if (snapshot.val() != null) {
            snapshot.forEach(function (childSnapshot) {

              var childData = childSnapshot.val();
              console.log(childData.biometricId);
              // console.log((childData.branchCode === branchCode));
              if (childSnapshot.key === uid || childData.branchCode === branchCode) {
                // console.log("User already added for this date");
                $scope.alreadyPresent = true;
                return $scope.alreadyPresent;
              }
              else {
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
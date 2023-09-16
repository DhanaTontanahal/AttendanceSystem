define(['./module'], function (controllers) {
  'use strict';
  controllers.controller('adminGridCtrl', ['uiGridConstants', 'activitiesService', '$firebaseObject', '$q', '$location', '$firebaseArray', '$filter', 'uiGridExporterService', 'uiGridExporterConstants', 'AuthService', '$rootScope', '$scope', '$http', '$log', '$timeout',
    'uiGridConstants', '$templateCache',
    '$interval', 'chatMessages',
    function (uiGridConstants, activitiesService, $firebaseObject, $q, $location, $firebaseArray, $filter, uiGridExporterService, uiGridExporterConstants, AuthService, $rootScope, $scope, $http, $log, $timeout, $uiGridConstants, $templateCache, $interval, chatMessages) {



      $scope.SUSchemeCategories = ["NA", "phase_1", "phase_2" , "Primary_1" , "Primary_2"];

      $scope.suSchemePhaseType = { value: "" };

      $scope.handleSuSchemeSelection = function () {

        $scope.suSchemePhaseType.value = $scope.suSchemePhaseType.value;

      }
      $scope.regionName = "";
      $scope.districtName = "";
      $scope.branchName = "";

      $scope.applyToAllDistrictBranchRegion = function () {

        $scope.satsangiUsers = firebase.database().ref('satsangiUsers/');
        $scope.satsangiUsers.on('value', function (snapshot) {
          if (snapshot.val() != null) {
            snapshot.forEach(function (childSnapshot) {
              var childData = childSnapshot.val();

              // console.log(childSnapshot);
              console.log("original data>", childSnapshot.val());
              if (childData.regionName !== undefined || childData.newUID !== undefined) {
                var postData = {
                  uid: childData.uid,
                  nameSatsangi: childData.nameSatsangi,
                  newUID: childData.newUID !== undefined ? childData.newUID : "-",
                  branchCode: childData.branchCode,
                  dollarId: childData.dollarId !== undefined ? childData.dollarId : "-",

                  gender: childData.gender !== undefined ? childData.gender : "",
                  dobYear: childData.dobYear !== undefined ? childData.dobYear : "",
                  category: childData.category !== undefined ? childData.category : "",

                  regionName: $scope.regionName,
                  districtName: $scope.districtName,
                  branchName: $scope.branchName
                };

                // console.log(postData);
                var updates = {};
                updates['/satsangiUsers/' + childData.uid] = postData;
                firebase.database().ref().update(updates);
              }



              // console.log(childSnapshot);
              // console.log(childSnapshot.val());
            });
          }
          // $rootScope.isUserUpdated = true;
          // $timeout(hideNewActivitySuccessNotification, 3000);
          // $scope.editUpdateUserBoxShow = false;
        });



      }
      $scope.editOrUpdateTheUserGenders = ["Male", "Female"];
      $rootScope.isUserUpdated = false;

      $scope.editOrUpdateTheUserDOBYears = [];
      let year = 1900;
      for (var index = 0; index <= 200; index++) {
        year = year + 1;
        $scope.editOrUpdateTheUserDOBYears.push(year);
      }

      $scope.editOrUpdateTheUserCategorySelected = ["Initiated", "Jigyasu", "Children below 18" , "Other"];
      // $scope.namesOfActivity =[];

      // $scope.selectedNameOfActivity = "Select";

      //  $scope.activitiesFromServer= activitiesService;

      // $scope.getActivitiesData = function()
      //   {
      //     $scope.activitiesFromServer.$loaded();
      //   }
      // $scope.getActivitiesData();

      // setTimeout(function(){
      //     for(var i = 0 ; i < $scope.activitiesFromServer.length ; i++){
      //             console.log($scope.activitiesFromServer[i].activityName)
      //             // $scope.namesOfActivity = ["Stamp", "LTS","Star Track","Trainings","Scheduled meetings", "Survey" , "Townhall" , "Events","Select"];
      //            $scope.namesOfActivity.push($scope.activitiesFromServer[i].activityName);

      //           $scope.$apply();
      //           }
      //   },5000);


      $scope.showCountDialog = function () {
        // ngDialog.open({ template: 'templateId',scope: $scope });
      }



      $scope.rowIsSelected = false;
      $scope.rowSelectedEntity = {};
      $scope.counter = 0;
      $rootScope.totalItemsStrength = { valueNum: 0 };
      $scope.decrementCounter = 0;
      $scope.disableDecrementAttendanceFlag = { value: true };

      $scope.markDepsAbsent = function (row) {
        $scope.showTodaysCountPresent = false;
        if (row.childAtts - 1 < 0) {
          return;
        }
        // console.log(row.childAtts-1);
        $scope.decrementCounter = row.childAtts - 1;
        writeNewPost(row.childAtts - 1, row.linked, row.indexForRS, row.index, row.$id, $scope.attendanceForThisData, $scope.selectedNameOfActivity, row.branchCode, row.nameSatsangi);
        addNewUIDForTodaysDateByBranchCode(row.childAtts - 1, row.linked, row.nameSatsangi, row.indexForRS, row.index, row.$id, $scope.attendanceForThisData, $scope.selectedNameOfActivity, row.branchCode);
        $scope.decrementCounter = 0;
        // $scope.$apply();
      }

      $scope.markPlusPresents = function (row) {
        $scope.showTodaysCountPresent = false;
        // console.log(row.childAtts);
        // return;
        if (row.childAtts == undefined) {
          console.log(row.childAtts);
          $scope.counter = 0;
          $scope.counter = $scope.counter + 1;
        }
        else {
          $scope.counter = row.childAtts + 1;
        }

        // console.log(JSON.stringify(row));

        // console.log($scope.counter);
        writeNewPost($scope.counter, row.linked, row.indexForRS, row.index, row.$id, $scope.attendanceForThisData, $scope.selectedNameOfActivity, row.branchCode, row.nameSatsangi);
        addNewUIDForTodaysDateByBranchCode($scope.counter, row.linked, row.nameSatsangi, row.indexForRS, row.index, row.$id, $scope.attendanceForThisData, $scope.selectedNameOfActivity, row.branchCode);
        // alert("hi"+row);

        // $scope.$apply();

      };

      $scope.addNwRc = function (linked, name, branchCode) {

        $('<tr class="anim highlight"><td><b>' + branchCode + '</b></td><td>' + name + '</td><td><b>' + linked + '</b></td></tr>')
          .hide()
          .prependTo('table tbody')
          .fadeIn("slow")
          .addClass('normal');

        $scope.reset();
      }


      $scope.showPrivilageError = false;
      $scope.toggleMainGrid = true;
      $scope.toggleAttGrid = false;
      $scope.toggleVirtualGrid = true;
      $scope.toggleToolButton = false;
      $scope.toggleExceptionDiv = false;


      $scope.exception = { text: "" };

      $scope.addException = function () {
        var exceptionPost = {
          exception: $scope.exception.text
        }
        firebase.database().ref('exceptions/' + new Date()).set(exceptionPost);
        $scope.exception.text = "";
      };

      $scope.showHideExceptionDiv = function () {
        $scope.toggleExceptionDiv = !$scope.toggleExceptionDiv;
      }

      $scope.showHideToggleGridButtons = function () {
        $scope.toggleToolButton = !$scope.toggleToolButton;
      }

      $scope.reset = function () {
        $scope.searchAttendanceGrid = "0";
        $scope.searchAttendanceGridName = "";
      }

      $scope.autoCompleteArrray = [];
      $scope.autoCompleteArrayNames = [];
      $scope.autoCompleteLinkedArray = [];

      var ref = firebase.database().ref("satsangiUsers");
      ref.once("value")
        .then(function (snapshot) {
          if (snapshot.val() != null) {
            snapshot.forEach(function (childSnapshot) {
              var childData = childSnapshot.val();
              var originalName = childSnapshot.val().nameSatsangi.trim();

              var trimmedName = originalName.substring(originalName.indexOf(" ") + 1, originalName.length).trim();

              // console.log(trimmedName);
              var strToPush = childSnapshot.val().branchCode + "--" + childSnapshot.val().nameSatsangi;
              var strNamesFirstToPush = childSnapshot.val().nameSatsangi + "--" + childSnapshot.val().branchCode;
              var strNamesFirstToPushTrimmed = trimmedName + "--" + childSnapshot.val().branchCode;
              var strLinked = childSnapshot.val().branchCode + "--" + childSnapshot.val().deps;
              $scope.autoCompleteLinkedArray.push(strLinked);
              // console.log(strLinked);
              localStorage.setItem(childSnapshot.val().branchCode, childSnapshot.val().branchCode);
              localStorage.setItem(childSnapshot.val().nameSatsangi, childSnapshot.val().branchCode);
              localStorage.setItem(trimmedName, originalName);
              $scope.autoCompleteArrray.push(strToPush);
              // $scope.autoCompleteArrayNames.push(strNamesFirstToPush);
              $scope.autoCompleteArrayNames.push(strNamesFirstToPushTrimmed);
              // console.log($scope.autoCompleteArrayNames)
            });
          }

        });

      function autocomplete(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function (e) {
          var a, b, i, val = this.value;
          /*close any already open lists of autocompleted values*/
          closeAllLists();
          if (!val) { return false; }
          currentFocus = -1;
          /*create a DIV element that will contain the items (values):*/
          a = document.createElement("DIV");
          a.setAttribute("id", this.id + "autocomplete-list");
          a.setAttribute("class", "autocomplete-items");
          /*append the DIV element as a child of the autocomplete container:*/
          this.parentNode.appendChild(a);
          /*for each item in the array...*/
          for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
              /*create a DIV element for each matching element:*/
              b = document.createElement("DIV");
              /*make the matching letters bold:*/
              b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
              b.innerHTML += arr[i].substr(val.length);
              /*insert a input field that will hold the current array item's value:*/
              b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
              /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function (e) {

                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                // console.log(inp.value)
                // console.log($scope.getTheExtractedBranchCode(inp.value));

                var getOriginalName = localStorage.getItem($scope.getTheExtractedBranchCode(inp.value));
                // console.log("getOriginalName"+getOriginalName)
                // var actualExtract= $scope.getTheExtractedBranchCode(getOriginalName);
                // console.log("hhhhhhhhhh"+actualExtract)
                // $scope.searchAttendanceGrid = actualExtract;
                $scope.searchAttendanceGrid = getOriginalName;
                closeAllLists();
              });
              a.appendChild(b);
            }
          }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function (e) {
          var x = document.getElementById(this.id + "autocomplete-list");
          if (x) x = x.getElementsByTagName("div");
          if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
          } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
          } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            //e.preventDefault();
            if (currentFocus > -1) {
              /*and simulate a click on the "active" item:*/
              if (x) x[currentFocus].click();
              // console.log("entrance"+$scope.searchAttendanceGridName)
              // console.log("entrance"+localStorage.getItem($scope.searchAttendanceGridName))

            }
          }
        });
        function addActive(x) {
          /*a function to classify an item as "active":*/
          if (!x) return false;
          /*start by removing the "active" class on all items:*/
          removeActive(x);
          if (currentFocus >= x.length) currentFocus = 0;
          if (currentFocus < 0) currentFocus = (x.length - 1);
          /*add class "autocomplete-active":*/
          x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
          /*a function to remove the "active" class from all autocomplete items:*/
          for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
          }
        }
        function closeAllLists(elmnt) {
          /*close all autocomplete lists in the document,
          except the one passed as an argument:*/
          var x = document.getElementsByClassName("autocomplete-items");
          for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
              x[i].parentNode.removeChild(x[i]);
            }
          }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
          closeAllLists(e.target);
        });
      }
      //--
      var dataAutoComplete = $scope.autoCompleteArrray;
      var dataAutoCompleteNamesFrst = $scope.autoCompleteArrayNames;
      var linkedAutoComplete = $scope.autoCompleteLinkedArray;

      autocomplete(document.getElementById("searchTextBox"), dataAutoComplete);
      autocomplete(document.getElementById("searchTextBoxFirstNames"), dataAutoCompleteNamesFrst);
      autocomplete(document.getElementById("searchLinkedId"), linkedAutoComplete);

      $scope.showHideMainGrid = function () {
        $scope.toggleMainGrid = !$scope.toggleMainGrid;
      }

      $scope.showHideVirtualGrid = function () {
        $scope.toggleVirtualGrid = !$scope.toggleVirtualGrid;
      }

      $scope.showHideAttGrid = function () {
        $scope.toggleAttGrid = !$scope.toggleAttGrid;
      }


      $scope.userAttendanceLabel = {
        attendanceStatus: "PRESENT"
      };

      $timeout(function () {
        $scope.currentLevelUser = AuthService.resolveUser();
        $rootScope.loggedInAs = $scope.currentLevelUser.email;

        if ($scope.currentLevelUser.email === "level1@ams.com" || $scope.currentLevelUser.email === "satsangi@ams.com") {
          $rootScope.levelOneUserLoggedIn = true;
        }
        else if ($scope.currentLevelUser.email === "level2@gmail.com" || $scope.currentLevelUser.email === "admin@ams.com" || $scope.currentLevelUser.email === "mukesh.dei90@gmail.com" || $scope.currentLevelUser.email === "level2@ams.com" || $scope.currentLevelUser.email === "hrsa03gurgaon@gmail.com") {
          $rootScope.levelTwoUserLoggedIn = true;
        }
        else if ($scope.currentLevelUser.email === "ggauravkapoor81@gmail.com" || $scope.currentLevelUser.email === "ritukhanna77@gmail.com" || $scope.currentLevelUser.email === "kavya.rawat108@gmail.com" || $scope.currentLevelUser.email === "lpsharma9@yahoo.co.in" || $scope.currentLevelUser.email === "seth.shubhangi28@gmail.com" || $scope.currentLevelUser.email === "level3@ams.com" || $scope.currentLevelUser.email === "bshubhanka@gmail.com" || $scope.currentLevelUser.email === "ankitadei@gmail.com") {
          $rootScope.levelThreeUserLoggedIn = true;
        }
      }, 2000);


      $scope.searchfrbc = { value: "" }

      $scope.getDBReference = function () {
        $scope.frBrnchCode = firebase.database().ref('satsangiUsers-attendance');
        return $scope.frBrnchCode;
      }

      $scope.removeData = function (data, toLoadPopUpsTimeFunc) {
        if (toLoadPopUpsTimeFunc) {

          $scope.frBrnchCode.child(data.datePresent).child(data.activityName).child(data.branchCode).remove();
          $scope.frBrnchCode.child(data.activityName).child(data.branchCode).child(data.datePresent).remove();
          $timeout(function () {
            $scope.loadDetailsPerBrCd(data.activityName, data.branchCode);
            $scope.getAttendance();
          }, 150);
          return;

        }
        else {
          var activityS = $scope.selectedNameOfActivity;
          var dateS = $scope.attendanceForThisData;
          $scope.frBrnchCode.child(dateS).child(activityS).child(data.branchCode).remove();
          $scope.frBrnchCode.child(activityS).child(data.branchCode).child(dateS).remove();
        }
      }

      $scope.deleteData = function () {
        $scope.showTodaysCountPresent = false;
        // $scope.$apply();
        // console.log("branchCode1..... :"+$scope.immediateBranchCode)
        var branchCode = localStorage.getItem(localStorage.getItem($scope.searchAttendanceGrid));
        // console.log("branchCode... :"+branchCode)
        var activityS = $scope.selectedNameOfActivity;
        var dateS = $scope.attendanceForThisData;
        $scope.frBrnchCode.child(dateS).child(activityS).child(branchCode).remove();
        $scope.frBrnchCode.child(activityS).child(branchCode).child(dateS).remove();

        $scope.searchAttendanceGrid = "";
        $scope.searchAttendanceGridName = "";
        // $scope.getAttendance();

        // $('#virtualTable tbody').remove();
      }

      $scope.loadCountForToday = function () {

        $scope.countForTodayLoad = [];
        $scope.dateKeysCountNumber = [];
        $scope.frBrnchCode = $scope.getDBReference();
        $scope.frBrnchCode.child($scope.attendanceForThisData).child($scope.selectedNameOfActivity).on('value', function (snapshot) {
          if (snapshot.val() != null) {
            snapshot.forEach(function (childSnapshot) {
              $scope.childData = childSnapshot.val();
              $scope.countForTodayLoad.push(childSnapshot.val());
              $scope.dateKeysCountNumber.push(childSnapshot.key);

            });
          }
        });

      }

      $scope.loadDetailsPerActivityAndBrCd = function (activityName, branchCode) {
        $scope.eSatsangDatesPrsentNumber = [];
        $scope.dateKeysForBranchMorningSatsang = [];
        $scope.dateKeysForBranchEveningSatsang = [];
        $scope.dateKeysForBranchSpecialSatsang = [];
        $scope.dateKeysForMorningCleaning = [];
        $scope.dateKeysForEveningCleaning = [];
        $scope.dateKeysForWindUp = [];
        $scope.dateKeysForWeeklyCleaning = [];
        $scope.dateKeysForBasantArti = [];
        $scope.dateKeysForBasantBhandara = [];
        $scope.dateKeysForHoliArti = [];
        $scope.dateKeysForHoliBhandara = [];
        $scope.dateKeysForArti = [];
        $scope.dateKeysForBhandara = [];
        $scope.dateKeysForCopyUnit = [];
        $scope.dateKeysForBagUnit = [];
        $scope.dateKeysForNightDuty = [];
        $scope.dateKeysForESatsang = [];

        $scope.frBrnchCode = $scope.getDBReference();
        $scope.frBrnchCode.child(activityName).child(branchCode).on('value', function (snapshot) {
          if (snapshot.val() != null) {
            snapshot.forEach(function (childSnapshot) {
              $scope.childKey = childSnapshot.key;
              $scope.childData = childSnapshot.val();
              if (activityName === "E-Satsang") {
                $scope.dateKeysForESatsang.push(childSnapshot.key);
                $scope.ESatsangPresentsFrThisBrCode = $scope.dateKeysForESatsang.length;
              }
              if (activityName === "Branch Morning Satsang") {
                $scope.dateKeysForBranchMorningSatsang.push(childSnapshot.key);
                $scope.BranchMorningSatsangPresentsFrThisBrCode = $scope.dateKeysForBranchMorningSatsang.length;
              }
              if (activityName === "Branch Evening Satsang") {
                $scope.dateKeysForBranchEveningSatsang.push(childSnapshot.key);
                $scope.BranchEveningSatsangPresentsFrThisBrCode = $scope.dateKeysForBranchEveningSatsang.length;
              }

              if (activityName === "Branch Special Satsang") {
                $scope.dateKeysForBranchSpecialSatsang.push(childSnapshot.key);
                $scope.BranchSpecialSatsangPresentsFrThisBrCode = $scope.dateKeysForBranchSpecialSatsang.length;
              }
              if (activityName === "Morning Cleaning") {
                $scope.dateKeysForMorningCleaning.push(childSnapshot.key);
                $scope.MorningCleaningPresentsFrThisBrCode = $scope.dateKeysForMorningCleaning.length;
              }
              if (activityName === "Evening Cleaning") {
                $scope.dateKeysForEveningCleaning.push(childSnapshot.key);
                $scope.EveningCleaningPresentsFrThisBrCode = $scope.dateKeysForEveningCleaning.length;
              }
              if (activityName === "Windup") {
                $scope.dateKeysForWindUp.push(childSnapshot.key);
                $scope.WindupPresentsFrThisBrCode = $scope.dateKeysForWindUp.length;
              }

              if (activityName === "Weekly Cleaning") {
                $scope.dateKeysForWeeklyCleaning.push(childSnapshot.key);
                $scope.WeeklyCleaningPresentsFrThisBrCode = $scope.dateKeysForWeeklyCleaning.length;
              }
              if (activityName === "Basant Arti") {
                $scope.dateKeysForBasantArti.push(childSnapshot.key);
                $scope.BasantArtiPresentsFrThisBrCode = $scope.dateKeysForBasantArti.length;
              }
              if (activityName === "Basant Bhandara") {
                $scope.dateKeysForBasantBhandara.push(childSnapshot.key);
                $scope.BasantBhandaraEveningPresentsFrThisBrCode = $scope.dateKeysForBasantBhandara.length;
              }
              if (activityName === "Holi Arti") {
                $scope.dateKeysForHoliArti.push(childSnapshot.key);
                $scope.HoliArtiPresentsFrThisBrCode = $scope.dateKeysForHoliArti.length;
              }

              if (activityName === "Holi Bhandara") {
                $scope.dateKeysForHoliBhandara.push(childSnapshot.key);
                $scope.HoliBhandaraPresentsFrThisBrCode = $scope.dateKeysForHoliBhandara.length;
              }
              if (activityName === "Arti") {
                $scope.dateKeysForArti.push(childSnapshot.key);
                $scope.ArtiPresentsFrThisBrCode = $scope.dateKeysForArti.length;
              }

              if (activityName === "Bhandara") {
                $scope.dateKeysForBhandara.push(childSnapshot.key);
                $scope.BhandaraPresentsFrThisBrCode = $scope.dateKeysForBhandara.length;
              }
              if (activityName === "Copy Unit") {
                $scope.dateKeysForCopyUnit.push(childSnapshot.key);
                $scope.CopyUnitPresentsFrThisBrCode = $scope.dateKeysForCopyUnit.length;
              }

              if (activityName === "Bag Unit") {
                $scope.dateKeysForBagUnit.push(childSnapshot.key);
                $scope.BagUnitPresentsFrThisBrCode = $scope.dateKeysForBagUnit.length;
              }
              if (activityName === "Night Duty") {
                $scope.dateKeysForNightDuty.push(childSnapshot.key);
                $scope.NightDutyPresentsFrThisBrCode = $scope.dateKeysForNightDuty.length;
              }

            });
          }
          //-------else if
          else if (activityName === "E-Satsang") {
            $scope.ESatsangPresentsFrThisBrCode = 0;
          }
          else if (activityName === "Branch Morning Satsang") {
            $scope.BranchMorningSatsangPresentsFrThisBrCode = 0;
          }
          else if (activityName === "Branch Evening Satsang") {
            $scope.BranchEveningSatsangPresentsFrThisBrCode = 0;
          }

          else if (activityName === "Branch Special Satsang") {
            $scope.BranchSpecialSatsangPresentsFrThisBrCode = 0;
          }
          else if (activityName === "Morning Cleaning") {
            $scope.MorningCleaningPresentsFrThisBrCode = 0;
          }
          else if (activityName === "Evening Cleaning") {
            $scope.EveningCleaningPresentsFrThisBrCode = 0;
          }
          else if (activityName === "Windup") {
            $scope.WindupPresentsFrThisBrCode = 0;
          }

          else if (activityName === "Weekly Cleaning") {
            $scope.WeeklyCleaningPresentsFrThisBrCode = 0;
          }
          else if (activityName === "Basant Arti") {

            $scope.BasantArtiPresentsFrThisBrCode = 0;
          }
          else if (activityName === "Basant Bhandara") {
            $scope.BasantBhandaraEveningPresentsFrThisBrCode = 0;
          }
          else if (activityName === "Holi Arti") {
            $scope.HoliArtiPresentsFrThisBrCode = 0;
          }

          else if (activityName === "Holi Bhandara") {

            $scope.HoliBhandaraPresentsFrThisBrCode = 0;
          }
          else if (activityName === "Arti") {

            $scope.ArtiPresentsFrThisBrCode = 0;
          }

          else if (activityName === "Bhandara") {

            $scope.BhandaraPresentsFrThisBrCode = 0;
          }
          else if (activityName === "Copy Unit") {

            $scope.CopyUnitPresentsFrThisBrCode = 0;
          }

          else if (activityName === "Bag Unit") {

            $scope.BagUnitPresentsFrThisBrCode = 0;
          }
          else if (activityName === "Night Duty") {

            $scope.NightDutyPresentsFrThisBrCode = 0;
          }
          /*else if(activityName === "Branch Morning Satsang")
          {
            $scope.BranchMorningSatsangPresentsFrThisBrCode = 0;
          }
          else if(activityName === "Bhandara")
          {
            $scope.bhandaraPresentsFrThisBrCode = 0;
          }
          else if(activityName === "E-Satsang")
          {
            $scope.ESatsangPresentsFrThisBrCode = 0;
          }
          else if(activityName === "Branch Satsang")
          {
            $scope.BSatsangPresentsFrThisBrCode = 0;
          }
          else if(activityName === "Cleaning Sewa")
          {
            $scope.CleaningSewaPresentsFrThisBrCode = 0;
          }
          else if(activityName === "Mahila Association")
          {
            $scope.MahilaAssociationPresentsFrThisBrCode = 0;
          }
          else if(activityName === "Medical Camp")
          {
            $scope.MedicalCampPresentsFrThisBrCode = 0;
          }
          else if(activityName === "Daily Satsang Morning")
          {
            $scope.DailySatsangMorningPresentsFrThisBrCode = 0;
          }
          else if(activityName === "Daily Satsang Evening")
          {
            $scope.DailySatsangEveningPresentsFrThisBrCode = 0;
          }
          else if(activityName === "Night Duty")
          {
            $scope.NightDutyPresentsFrThisBrCode = 0;
          }
          else if(activityName === "Youth Path")
          {
            $scope.YouthPathPresentsFrThisBrCode = 0;
          }
          else if(activityName === "Helpdesk E-Satsang")
          {
            $scope.HelpdeskESatsangPresentsFrThisBrCode = 0;
          }
          else if(activityName === "Helpdesk-Aarti")
          {
            $scope.HelpdeskAartiPresentsFrThisBrCode = 0;
          }
          else if(activityName === "Helpdesk Bhandara")
          {
            $scope.HelpdeskBhandaraPresentsFrThisBrCode = 0;
          }*/
          else { }
        });

      }

      $scope.activityType = {
        zValue: "E-Satsang",
        oneValue: "Branch Morning Satsang",
        twoValue: "Branch Evening Satsang",
        threeValue: "Branch Special Satsang",
        fourValue: "Morning Cleaning",
        fiveValue: "Evening Cleaning",
        sixValue: "Windup",
        sevenValue: "Weekly Cleaning",
        eightValue: "Basant Arti",
        nineValue: "Basant Bhandara",
        tenValue: "Holi Arti",
        elevenValue: "Holi Bhandara",
        twelveValue: "Arti",
        thirteenValue: "Bhandara",
        fourteenValue: "Copy Unit",
        fifteenValue: "Bag Unit",
        sixteenValue: "Night Duty"
      }


      $scope.loadDetailsPerBrCd = function (activityName, branchCode) {
        $scope.currentSelectedActivityTypeForRightSideGrid = activityName;
        $scope.datesPresentArray = [];
        $scope.dateKeys = [];
        $scope.frBrnchCode = $scope.getDBReference();
        $scope.frBrnchCode.child(activityName).child(branchCode).orderByChild("sortDate").limitToLast($scope.limitToValue).on('value', function (snapshot) {
          if (snapshot.val() != null) {
            snapshot.forEach(function (childSnapshot) {
              $scope.childKey = childSnapshot.key;
              $scope.childData = childSnapshot.val();
              $scope.datesPresentArray.push(childSnapshot.val());
              $scope.dateKeys.push(childSnapshot.key);
            });
          }
        });
        $scope.loadDetailsPerActivityAndBrCd("E-Satsang", $scope.branchCodeSelected);
        $scope.loadDetailsPerActivityAndBrCd("Branch Morning Satsang", $scope.branchCodeSelected);
        $scope.loadDetailsPerActivityAndBrCd("Branch Evening Satsang", $scope.branchCodeSelected);
        $scope.loadDetailsPerActivityAndBrCd("Branch Special Satsang", $scope.branchCodeSelected);
        $scope.loadDetailsPerActivityAndBrCd("Morning Cleaning", $scope.branchCodeSelected);
        $scope.loadDetailsPerActivityAndBrCd("Evening Cleaning", $scope.branchCodeSelected);
        $scope.loadDetailsPerActivityAndBrCd("Windup", $scope.branchCodeSelected);
        $scope.loadDetailsPerActivityAndBrCd("Weekly Cleaning", $scope.branchCodeSelected);
        $scope.loadDetailsPerActivityAndBrCd("Basant Arti", $scope.branchCodeSelected);

        $scope.loadDetailsPerActivityAndBrCd("Basant Bhandara", $scope.branchCodeSelected);
        $scope.loadDetailsPerActivityAndBrCd("Holi Arti", $scope.branchCodeSelected);
        $scope.loadDetailsPerActivityAndBrCd("Holi Bhandara", $scope.branchCodeSelected);
        $scope.loadDetailsPerActivityAndBrCd("Arti", $scope.branchCodeSelected);

        $scope.loadDetailsPerActivityAndBrCd("Bhandara", $scope.branchCodeSelected);
        $scope.loadDetailsPerActivityAndBrCd("Copy Unit", $scope.branchCodeSelected);

        $scope.loadDetailsPerActivityAndBrCd("Bag Unit", $scope.branchCodeSelected);
        $scope.loadDetailsPerActivityAndBrCd("Night Duty", $scope.branchCodeSelected);


      }

      $scope.editUpdateUserBoxShow = false;
      $scope.editOrUpdate = function () {
        // alert($scope.editOrUpdateTheUseruid);
        // alert($scope.editOrUpdateTheUsernameSatsangi)
        // alert($scope.editOrUpdateTheUsernewUid)
        // console.log($scope.editOrUpdateTheUserDOBYear , $scope.editOrUpdateTheUserGender);
        console.log($scope.suSchemePhaseType.value);
        // return;
        var postData = {
          // 10.0.2
          regionName: $scope.editOrUpdateTheUserregionName != null ? $scope.editOrUpdateTheUserregionName : "Maharastra",
          branchName: $scope.editOrUpdateTheUserbranchName != null ? $scope.editOrUpdateTheUserbranchName : "Pune",
          districtName: $scope.editOrUpdateTheUserdistrictName != null ? $scope.editOrUpdateTheUserdistrictName : "Maharastra",

          uid: $scope.editOrUpdateTheUseruid,
          nameSatsangi: $scope.editOrUpdateTheUsernameSatsangi,
          newUID: $scope.editOrUpdateTheUsernewUid,
          branchCode: $scope.editOrUpdateTheUserbranchCode,
          dollarId: $scope.dollarUid,
          gender: $scope.editOrUpdateTheUserGender,
          dobYear: $scope.editOrUpdateTheUserDOBYear,
          category: $scope.editOrUpdateTheUserCategory,
          suscheme: $scope.suSchemePhaseType.value,
          biometricId:$scope.editOrUpdateTheUserbiometricId 
        };
        var newPostKey = firebase.database().ref().child('satsangiUsers-attendance').push().key;
        var updates = {};
        updates['/satsangiUsers/' + $scope.editOrUpdateTheUseruid] = postData;

        $rootScope.isUserUpdated = true;
        $timeout(hideNewActivitySuccessNotification, 3000);


        firebase.database().ref().update(updates);

        $scope.editUpdateUserBoxShow = false;


      }


      var hideNewActivitySuccessNotification = function () {
        $rootScope.isUserUpdated = false;
      }



      $scope.deleteSelectedSatsangiUser = function (dollarId) {
        firebase.database().ref("satsangiUsers").child(dollarId).remove();
      }

      $scope.editOrUpdateTheUser = function (row) {
        // alert(JSON.stringify(row))
        $scope.editUpdateUserBoxShow = true;
        $scope.editOrUpdateTheUsernameSatsangi = row.nameSatsangi;
        $scope.editOrUpdateTheUserbranchCode = row.branchCode;
        $scope.editOrUpdateTheUseruid = row.uid;
        $scope.editOrUpdateTheUsernewUid = row.newUID;
        $scope.dollarUid = row.$id;

        $scope.editOrUpdateTheUserregionName = row.regionName !== undefined ? row.regionName : "";
        $scope.editOrUpdateTheUserbranchName = row.branchName;
        $scope.editOrUpdateTheUserdistrictName = row.districtName;

        $scope.editOrUpdateTheUserCategory = row.category;
        $scope.editOrUpdateTheUserDOBYear = row.dobYear;
        $scope.editOrUpdateTheUserGender = row.gender;

        $scope.editOrUpdateTheUserbiometricId = row.biometricId;

      }

      $scope.openDetails = function (row, id, toCallLoadMethod) {
        $scope.datesPresentArray = [];
        $("#hider").fadeIn("slow");
        $('#popup_box').fadeIn("slow");
        if (toCallLoadMethod) {
          $scope.nameSatsangiSelected = row.nameSatsangi;
          $scope.branchCodeSelected = row.branchCode;
          $timeout(function () {
            $scope.loadDetailsPerBrCd($scope.selectedNameOfActivity, row.branchCode);
          }, 250);
        }
      }
      $scope.namesOfActivity = ["Special Cleaning", "Special Satsang", "E-Satsang", "Branch Satsang", "Bhandara", "Aarti", "Cleaning Sewa", "Mahila Association", "Medical Camp", "Daily Satsang Morning", "Daily Satsang Evening", "Night Duty", "Youth Path", "Helpdesk E-Satsang", "Helpdesk-Aarti", "Helpdesk Bhandara", "Select"];
      // $scope.namesOfActivity =["E-Satsang","Branch Morning Satsang","Branch Evening Satsang","Branch Special Satsang","Morning Cleaning","Evening Cleaning","Windup","Weekly Cleaning","Basant Arti","Basant Bhandara","Holi Arti","Holi Bhandara","Arti","Bhandara","Copy Unit","Bag Unit","Night Duty","Select"];
      $scope.filtersSels = ["Select", "Last 1 month", "Last 2 months", "Last 3 months", "Last 6 months"];
      $scope.selectedfilterSel = "Select";
      $scope.selectedNameOfActivity = "Select";
      // $rootScope.selectedNameOfActivityGlobal = "E-Satsang";
      $rootScope.selectedNameOfActivityGlobal = "Arti";
      $scope.fdt = $filter('date')(new Date(), 'dd-MMMM-yyyy');
      $scope.timeFromtheSelectedDate = new Date().getTime();
      $scope.tdt = $filter('date')(new Date(), 'dd-MMMM-yyyy');
      $scope.dtmax = new Date();
      $rootScope.isLoading = true;
      $rootScope.isUserMarkedPresent = false;
      $rootScope.isUserAlreadyMarkedPresent = false;
      $scope.attendanceForThisData = $filter('date')($scope.fdt, 'dd-MM-yyyy');
      $rootScope.attendanceForThisDataGlobal = $filter('date')($scope.fdt, 'dd-MM-yyyy');
      $scope.showTodaysCountPresent = false;
      $scope.limitToValue = 100;

      $scope.satsangiUsersAttendanceRef = firebase.database().ref('satsangiUsers-attendance/');
      $scope.satsangiUsersAttendanceRef.on('child_added', function (data) {
      });

      $scope.satsangiUsersAttendanceRef.on('child_changed', function (data) {
      });

      $scope.unCheckMarkedForThisDate = function () {
        $scope.satsangiUsers = firebase.database().ref('satsangiUsers/');
        $scope.satsangiUsers.on('value', function (snapshot) {
          if (snapshot.val() != null) {
            snapshot.forEach(function (childSnapshot) {
              $scope.uncheckFirst(childSnapshot.val());
            });
          }
        });
      }

      $scope.toSelectRecord = "";
      $scope.getGridDataObjectForSelection = function (bc) {

        var ref = firebase.database().ref("satsangiUsers");
        ref.once("value")
          .then(function (snapshot) {
            if (snapshot.val() != null) {
              snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                if (childData.branchCode === bc) {
                  $scope.GridchildData = childData;
                }
              });
              $scope.addAttendance($scope.GridchildData.uid, true, 'indexOfSelectedRec', 'indexForRS', $scope.GridchildData.branchCode, $scope.GridchildData.deps);
              // console.log("$scope.GridchildData"+$scope.GridchildData)
              // $scope.gridOptions1.data[0] = $scope.GridchildData;
            }
          });
      }


      $scope.checkForMarkedPresent = function (childData) {
        if (childData.uid != null && document.getElementById(childData.uid) != null) {
          document.getElementById(childData.uid).checked = true;
          if ($scope.gridApi != undefined) {

          }
        }
      }

      $scope.uncheckFirst = function (childData) {
        if (childData.uid != null && document.getElementById(childData.uid) != null) {
          document.getElementById(childData.uid).checked = false;
        }
      }
      $scope.checkAttendanceForTheInputOnDate = function (inputDate, selectedNameOfActivity) {
        var starCountRef = firebase.database().ref('satsangiUsers-attendance').child(inputDate).child(selectedNameOfActivity);
        starCountRef.on('value', function (snapshot) {
          if (snapshot.val() != null) {
            snapshot.forEach(function (childSnapshot) {
              var childData = childSnapshot.val();
              if (childData.uid != null) {
                $scope.checkForMarkedPresent(childData);
              }
            });
          }
          else {
            $scope.unCheckMarkedForThisDate(inputDate);
          }
        });
      }

      $scope.checkIfTheuserisAlreadyMarkedPresent = function (uid, dateFor) {

        if (dateFor === null) {
          $scope.satsangiUsersAttendance = firebase.database().ref('satsangiUsers-attendance/' + dateFor);
        }
        else {
          $scope.satsangiUsersAttendance = firebase.database().ref('satsangiUsers-attendance/');
        }

        $scope.satsangiUsersAttendance.on('value', function (snapshot) {
          if (snapshot.val() != null) {
            snapshot.forEach(function (childSnapshot) {
              var childData = childSnapshot.val();
              if (childSnapshot.key === uid) {
                return true;
              }
              else {
                return false;
              }

            });
          }
        });
      }


      function addCountForTodaysDate(datePresent, saveNow) {
        var ref = firebase.database().ref().child(datePresent);
        var obj = new $firebaseObject(ref);
        $scope.todaysCountValue;
        obj.$loaded().then(function () {
          if (obj.$value == null || obj.$value === null || obj.$value === "null") {
            $scope.todaysCountValue = 0;
          }
          else {
            $scope.todaysCountValue = obj.$value;
          }

          if (obj.$value == NaN) {
            obj.$value = 1;
            obj.$value = obj.$value;
          }
          if (saveNow) {
            obj.$value = $scope.todaysCountValue + 1;
            $scope.todaysCountValue = obj.$value;
            obj.$save();
          }
        });

      }

      addCountForTodaysDate($scope.attendanceForThisData, false);

      function addNewUIDForTodaysDate(indexForRS, index, uid, datePresent, activityName) {
        var postData = {
          indexForRS: indexForRS,
          index: index,
          uid: uid,
          activityName: activityName
        };
        var newPostKey = firebase.database().ref().child('satsangiUsers-attendance').push().key;
        var updates = {};
        updates['/satsangiUsers-attendance/' + datePresent + '/' + uid] = postData;

        if ($scope.checkIfTheuserisAlreadyMarkedPresent(uid, datePresent)) {
          return;
        }
        else {
          return firebase.database().ref().update(updates);
        }
      }

      function addNewUIDForTodaysDateByBranchCode(childAtts, deps, nameSatsangi, indexForRS, index, uid, datePresent, activityName, branchCode) {
        if (deps === undefined) {
          deps = "-";
        }
        var postData = {
          linked: deps,
          childAtts: childAtts,
          indexForRS: indexForRS,
          index: index,
          uid: uid,
          activityName: activityName,
          sortDate: $scope.timeFromtheSelectedDate * -1,
          branchCode: branchCode,
          nameSatsangi: nameSatsangi,
          datePresent: datePresent
        };

        var newPostKey = firebase.database().ref().child('satsangiUsers-attendance').push().key;
        var updates = {};
        updates['/satsangiUsers-attendance/' + datePresent + '/' + activityName + '/' + branchCode] = postData;

        // $scope.getData1();
        // $scope.assignDatatoGrid1();
        $scope.searchAttendanceGrid = "";

        if ($scope.checkIfTheuserisAlreadyMarkedPresent(uid, datePresent)) {
          return;
        }
        else {
          var resp = firebase.database().ref().update(updates);
          $scope.addNwRc(deps, nameSatsangi, branchCode);
          $scope.reset();
          $scope.rowIsSelected = false;
          $scope.rowSelectedEntity = {};
          console.log("clearing selected rows if any")
          $scope.gridApi.selection.clearSelectedRows();
          return resp;
        }
      }

      function writeNewPost(childAtts, deps, indexForRS, index, uid, datePresent, eventType, branchCode, nameSatsangi) {
        if (deps === undefined) {
          deps = "-";
        }
        var postData = {
          linked: deps,
          childAtts: childAtts,
          indexForRS: indexForRS,
          index: index,
          uid: uid,
          datePresent: datePresent,
          activityName: eventType,
          branchCode: branchCode,
          nameSatsangi: nameSatsangi,
          sortDate: $scope.timeFromtheSelectedDate * -1
        };
        var newPostKey = firebase.database().ref().child('satsangiUsers-attendance').push().key;
        var updates = {};
        updates['/satsangiUsers-attendance/' + eventType + '/' + branchCode + '/' + datePresent] = postData;
        if ($scope.checkIfTheuserisAlreadyMarkedPresent(uid, null)) {
          return;
        }
        else {
          return firebase.database().ref().update(updates);
        }
      }


      function addDatesForBranchCode(branchCode, uid) {

        var postData = {
          datePresent: $scope.attendanceForThisData,
          activity: $scope.selectedNameOfActivity,
          branchCode: branchCode,
          uid: uid

        };
        var newPostKey = firebase.database().ref().child('satsangiUsers-attendance').push().key;
        var updates = {};
        updates['/satsangiUsers-attendance/' + branchCode + '/' + $scope.attendanceForThisData] = postData;
        return firebase.database().ref().update(updates);
      }


      $scope.changeActivity = function () {
        // console.log( $scope.selectedNameOfActivity)
        $rootScope.selectedNameOfActivityGlobal = $scope.selectedNameOfActivity;
        $scope.getAttendance();
        $scope.showTodaysCountPresent = false;
        $scope.showTodaysCountForCopy();
        $scope.getData1();
        $scope.assignDatatoGrid1();
        // $scope.totalItems = $scope.gridApi1.grid.options.totalItems;
        // alert($scope.gridApi1.grid.rows.length)
        // var ttttCCCCC = document.evaluate('*[@id="grid1"]/div[2]/div[2]/div/span/text()[2]', document, null, XPathResult.ANY_TYPE, null).iterateNext().value;
        // alert(ttttCCCCC);
      }

      $scope.changeFilterSel = function () {
        if ($scope.selectedfilterSel === "Last 1 month") {
          $scope.limitToValue = 4;
        }
        else if ($scope.selectedfilterSel === "Last 2 months") {
          $scope.limitToValue = 8;
        }
        else if ($scope.selectedfilterSel === "Last 3 months") {
          $scope.limitToValue = 12;
        }
        else if ($scope.selectedfilterSel === "Last 6 months") {
          $scope.limitToValue = 24;
        }
        else {
          $scope.limitToValue = 100;
        }
        $scope.activitySummaryBybranchCode = [];
        $scope.namesOfActivity.map(function (activityName) {
          $scope.loadDetailsPerBrCd(activityName, $scope.branchCodeSelected);
          var summaryObj = { activityName: activityName, valueNumber: $scope.dateKeys.length };
          $scope.activitySummaryBybranchCode.push(summaryObj);

        })
      }
      Date.prototype.getNextWeekMonday = function () {
        var d = new Date(this.getTime());
        var diff = d.getDate() - d.getDay() + 1;
        if (d.getDay() == 0)
          diff -= 7;
        diff += 7; // ugly hack to get next monday instead of current one
        return new Date(d.setDate(diff));
      };

      Date.prototype.getNextWeekSunday = function () {
        var d = this.getNextWeekMonday();

        return new Date(d.setDate(d.getDate() + 6));
      };


      var date = new Date();
      $scope.nextWeekMonday = date.getNextWeekMonday().toString().substring(0, 10);
      $scope.nextWeekSunday = date.getNextWeekSunday().toString().substring(0, 10);

      $scope.openF = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedF = true;
      };
      $scope.openT = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedT = true;
      };

      $scope.dateOptions = {
        'year-format': 'yy',
        'show-weeks': false,
      };


      $scope.changeSelectF = function (dt) {
        $scope.showTodaysCountPresent = false;
        $scope.showTodaysCountForCopy();
        $scope.gridApi.selection.clearSelectedRows();
        $scope.attendanceForThisData = $filter('date')(dt, 'dd-MMMM-yyyy');
        $scope.attendanceForThisDataGlobal = $filter('date')(dt, 'dd-MMMM-yyyy');
        $scope.timeFromtheSelectedDate = dt.getTime();
        $scope.showTodaysCountPresent = false;
        $scope.showTodaysCountForCopy();

        $scope.getData1();
        $scope.assignDatatoGrid1();

        $scope.checkAttendanceForTheInputOnDate($scope.attendanceForThisData, $scope.selectedNameOfActivity);
        // $scope.totalItems = $scope.gridApi1.grid.options.totalItems;
        $scope.showCountDialog();
        // alert(totalItems)
      }


      $scope.changeSelectT = function (dt) {
        var busDateT = $filter('date')($scope.tdt, 'dd-MM-yyyy');
        $scope.nextWeekSunday = busDateT;
      }


      $scope.exportCsv = function () {
        var grid = $scope.gridApi.grid;
        var rowTypes = uiGridExporterConstants.ALL;
        var colTypes = uiGridExporterConstants.ALL;
        uiGridExporterService.csvExport(grid, rowTypes, colTypes);
      };

      function updateSatsangiUser(uid, datePresent, deps, branchCode, nameSatsangi) {

        // console.log("here:::"+aadhar)
        var postData = {
          uid: uid,
          nameSatsangi: nameSatsangi,
          branchCode: branchCode,
          dateValue: datePresent,
          deps: deps

        };

        var newPostKey = firebase.database().ref().child('satsangiUsers-attendance').push().key;
        var updates = {};
        updates['/satsangiUsers/' + uid] = postData;
        return firebase.database().ref().update(updates);

      }

      $scope.saveRow = function (rowEntity) {
        // console.log(rowEntity.doi,rowEntity.aadhar,rowEntity.dob,rowEntity.fatherName,rowEntity.motherName,rowEntity.motherDoi,rowEntity.fatherDoi+"saveRow.------>"+rowEntity.uid ,$scope.attendanceForThisData,rowEntity.deps,rowEntity.branchCode,rowEntity.nameSatsangi)

        // $scope.aadhar=rowEntity.aadhar == undefined ? '-' : rowEntity.aadhar;
        // $scope.doi=rowEntity.doi == undefined ? '-' : rowEntity.doi;
        // $scope.dob=rowEntity.dob == undefined ? '-' : rowEntity.dob;
        // $scope.fatherName=rowEntity.fatherName == undefined ? '-' : rowEntity.fatherName;
        // $scope.motherName=rowEntity.motherName == undefined ? '-' : rowEntity.motherName;
        // $scope.motherDoi=rowEntity.motherDoi == undefined ? '-' : rowEntity.motherDoi;
        // $scope.fatherDoi=rowEntity.fatherDoi == undefined ? '-' : rowEntity.fatherDoi;


        // console.log("final sub"+$scope.doi,$scope.aadhar,$scope.dob,$scope.fatherName,$scope.motherName,$scope.motherDoi,$scope.fatherDoi,rowEntity.uid ,$scope.attendanceForThisData,rowEntity.deps,rowEntity.branchCode,rowEntity.nameSatsangi)
        updateSatsangiUser(rowEntity.uid, $scope.attendanceForThisData, rowEntity.deps, rowEntity.branchCode, rowEntity.nameSatsangi);
      }

      $scope.exportPdf = function () {
        var grid = $scope.gridApi.grid;
        var rowTypes = uiGridExporterConstants.ALL;
        var colTypes = uiGridExporterConstants.ALL;
        uiGridExporterService.pdfExport(grid, rowTypes, colTypes);
      };


      $scope.columns = [
        {
          name: 'delete', enableCellEdit: false, width: 110, cellTemplate: '<div>' +
            '  <button  class="btn btn-danger" ng-click="grid.appScope.deleteSelectedSatsangiUser(row.entity.$id)" href=""><span class="glyphicon glyphicon-remove">&nbsp;Delete</span></button>' +
            '</div>', headerCellClass: 'blueOne', field: 'delete', enableFiltering: false, enableHiding: false
        },


        {
          name: 'edit', enableCellEdit: false, width: 110, cellTemplate: '<div>' +
            '  <button  class="btn btn-success" ng-click="grid.appScope.editOrUpdateTheUser(row.entity)" href=""><span class="glyphicon glyphicon-user">&nbsp;Update</span></button>' +
            '</div>', headerCellClass: 'blueOne', field: 'editUpdate', enableFiltering: false, enableHiding: false
        },
        {
          name: 'branchCode', enableCellEdit: false, width: 110, cellTemplate: '<div>' +
            '  <a id="" class="branchCodeLinkSty" ng-click="grid.appScope.openDetails(row.entity,row.entity.uid,true)" href="">{{row.entity.branchCode}}</a>' +
            '</div>', headerCellClass: 'blueOne', field: 'branchCode', enableFiltering: true, enableHiding: false
        },
        { name: 'SatsangiName', enableCellEdit: false, headerCellClass: 'blue', width:200 , field: 'nameSatsangi', enableFiltering: true, enableHiding: false },
        { name: 'Attendance', enableCellEdit: false, width: 75, headerCellClass: 'bluePlusWidth', field: 'markPresent', exporterPdfAlign: 'right', enableHiding: false, visible: true, cellTemplate: 'mapPresent.html', enableFiltering: false },

        { name: 'uid', enableCellEdit: false, field: 'uid', headerCellClass: 'blue', enableFiltering: false, enableHiding: false },

        // { name:'Category', field: 'deps',headerCellClass: 'blue',enableFiltering: true,enableHiding:false },

        {
          name: 'Category', filter: {
            term: 'Initiated',
            type: uiGridConstants.filter.SELECT,
            selectOptions: [{ value: 'Initiated', label: 'Initiated' }, { value: 'Jigyasu', label: 'Jigyasu' }, { value: 'Children below 18', label: 'Children below 18' }],
            cellFilter: function () {
              var genderHash = {
                'Initiated': 'Initiated',
                'Jigyasu': 'Jigyasu',
                'Children below 18': 'Children below 18'
              };

              return function (input) {
                if (!input) {
                  return '';
                } else {
                  return genderHash[input];
                }
              };
            }
          }, field: 'category', headerCellClass: 'blue', enableFiltering: true, enableHiding: false
        },

        { name: 'newUID', enableCellEdit: false, field: 'newUID', headerCellClass: 'blue', enableFiltering: false, enableHiding: false },

        {
          name: 'Gender', filter: {
            flags: { caseSensitive: true },
            term: 'Male',
            flags: { caseSensitive: true },
            type: uiGridConstants.filter.SELECT,
            selectOptions: [{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }],
            cellFilter: function () {
              var genderHash = {
                'Male': 'Male',
                'Female': 'Female'
              };

              return function (input) {
                if (!input) {
                  return '';
                } else {
                  return genderHash[input];
                }
              };
            }
          }, field: 'gender', headerCellClass: 'blue', enableFiltering: true, enableHiding: false
        },


        { name: 'DOBYear', enableCellEdit: false, field: 'dobYear', headerCellClass: 'blue', enableFiltering: false, enableHiding: false },

        { name: 'Region', enableCellEdit: false, field: 'regionName', headerCellClass: 'blue', enableFiltering: false, enableHiding: false },

        { name: 'District', field: 'districtName', headerCellClass: 'blue', enableFiltering: true, enableHiding: false },


        { name: 'Branch', enableCellEdit: false, field: 'branchName', headerCellClass: 'blue', enableFiltering: false, enableHiding: false },


        { name: 'Scheme', enableCellEdit: false, field: 'suscheme', headerCellClass: 'blue', enableFiltering: true, enableHiding: false },



        // { name:'Date of Initiation', enableCellEdit: true,field: 'doi',headerCellClass: 'blue',enableFiltering: false,enableHiding:false },

        // { name:'aadhar', enableCellEdit: true,field: 'aadhar',headerCellClass: 'blue',enableFiltering: true,enableHiding:false },

        // { name:'dob', enableCellEdit: true,field: 'dob',headerCellClass: 'blue',enableFiltering: false,enableHiding:false },


        // { name:'fatherName', enableCellEdit: true,field: 'fatherName',headerCellClass: 'blue',enableFiltering: false,enableHiding:false },

        // { name:'motherName', enableCellEdit: true,field: 'motherName',headerCellClass: 'blue',enableFiltering: false,enableHiding:false },

        // { name:'fatherDoi', enableCellEdit: true,field: 'fatherDoi',headerCellClass: 'blue',enableFiltering: false,enableHiding:false },

        // { name:'motherDoi', enableCellEdit: true,field: 'motherDoi',headerCellClass: 'blue',enableFiltering: false,enableHiding:false },


      ];

      $scope.columns1 = [
        { name: 'branchCode', visible: true, headerCellClass: 'blue', field: 'branchCode', enableFiltering: true },
        { name: 'Satsangi name', visible: true, headerCellClass: 'blue', width:200, field: 'nameSatsangi', enableFiltering: true }
        /* { name:'Linked', field: 'linked',headerCellClass: 'blue',enableFiltering: true,enableHiding:false }*/
        /*{ name: '(+)  or  (-)', headerCellClass: 'blue',cellTemplate: 'mapAddress.html' ,enableFiltering: false },
        { name: 'Dependants', headerCellClass: 'blue',field: 'childAtts',enableFiltering: false  }*/
        /*
        { name:'uid',headerCellClass: 'blue',field: 'uid' },
        { name:'datePresent',headerCellClass: 'blue',field: 'datePresent' },
         { name:'activityName',headerCellClass: 'blue',field: 'activityName' }
        { name:'Present', headerCellClass: 'blue',enableFiltering: false , cellTemplate:'<div>{{" Present"}}</div>' }*/
      ];

      $scope.gridOptions1 = {
        enableFiltering: true,
        enableGridMenu: true,
        enableRowSelection: true,
        enableSorting: false,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        paginationPageSizes: [5, 10, 20],
        paginationPageSize: 20,
        columnDefs: $scope.columns1
      };

      $scope.gridOptions1.multiSelect = false;

      $scope.clearFiltersTDS = function() {
        // $scope.gridApi1.grid.clearAllFilters();
        $scope.gridApi.grid.clearAllFilters();
    };


      $scope.getData1 = function () {

        $scope.messages1 = [];
        var activityRef = $scope.selectedNameOfActivity;
        var dateRef = $scope.attendanceForThisData;
        var ref = firebase.database().ref("satsangiUsers-attendance").child(dateRef).child(activityRef).orderByChild("sortDate");
        $scope.messages1 = $firebaseArray(ref);
        $scope.messages1.$loaded();
        _.sortBy($scope.messages1, 'sortDate');


        /*var ref = firebase.database().ref("satsangiUsers-attendance").child(dateRef).child(activityRef).orderByChild("sortDate").on('value', function(snapshot) 
        {
        if(snapshot.val() != null)
        {
         snapshot.forEach(function(childSnapshot)
          {
            $scope.childData = childSnapshot.val();
          // if (_.findWhere($scope.messages1, $scope.childData) == null) {
            $scope.messages1.push($scope.childData);
            
          // }
          });
          // _.sortBy($scope.messages1,'sortDate');
        }
       });*/
      }

      $scope.assignDatatoGrid1 = function () {
        $scope.gridOptions1.data = $scope.messages1;
      }
      // $scope.getData1();
      // $scope.assignDatatoGrid1();



      $scope.gridOptions = {
        enableFiltering: true,
        enableGridMenu: true,
        enableRowSelection: true,
        enableSorting: true,
        exporterCsvFilename: 'myFile.csv',
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        paginationPageSizes: [5, 10, 20],
        paginationPageSize: 20,
        columnDefs: $scope.columns
      };

      $scope.gridOptions.multiSelect = false;


      $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        console.log($scope.gridApi.grid.options.totalItems);


        $interval(function () {
          $rootScope.totalItemsStrength.valueNum = $scope.gridApi.grid.options.totalItems;
          $scope.clearFiltersTDS();
        }, 3000);

        // alert(totalItems);
        $scope.gridApi.edit.on.beginCellEdit($scope, function (rowEntity, colDef) {
          if ($rootScope.levelTwoUserLoggedIn) {
            $scope.gridApi.enableCellEdit = false;
            $scope.showPrivilageError = true;
            $timeout(function () {
              $scope.showPrivilageError = false;
            }, 450);
            var promise = $q.defer();
            promise.resolve();
            return;
          }
        });

        $scope.gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
          if ($rootScope.levelTwoUserLoggedIn) {
            // console.log("...........level2"+rowEntity.aadhar)
            $scope.saveRow(rowEntity)
            var promise = $q.defer();
            $scope.gridApi.rowEdit.setSavePromise(rowEntity, promise.promise);
            promise.resolve();

          }
          else {
            $scope.showPrivilageError = true;
            $timeout(function () {
              $scope.showPrivilageError = false;
            }, 490);
            var promise = $q.defer();
            promise.resolve();
          }

        })


        $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
          $scope.getAttendance();
          $scope.showTodaysCountPresent = false;
          $scope.showTodaysCountForCopy();
          $timeout(function () {
            document.getElementById("checkAttendanceButtonId").click();
          }, 260);


        });



        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          $scope.rowIsSelected = true;
          $scope.rowSelectedEntity = row.entity;
          // console.log("row "+JSON.stringify(row.entity))
          console.log(0, $scope.rowSelectedEntity.deps, 'indexForRS', 'index', $scope.rowSelectedEntity.uid, $scope.attendanceForThisData, $scope.selectedNameOfActivity, $scope.rowSelectedEntity.branchCode, $scope.rowSelectedEntity.nameSatsangi)
          writeNewPost(0, $scope.rowSelectedEntity.deps, 'indexForRS', 'index', $scope.rowSelectedEntity.uid, $scope.attendanceForThisData, $scope.selectedNameOfActivity, $scope.rowSelectedEntity.branchCode, $scope.rowSelectedEntity.nameSatsangi);
          addNewUIDForTodaysDateByBranchCode(0, $scope.rowSelectedEntity.deps, $scope.rowSelectedEntity.nameSatsangi, 'indexForRS', 'index', $scope.rowSelectedEntity.uid, $scope.attendanceForThisData, $scope.selectedNameOfActivity, $scope.rowSelectedEntity.branchCode);
          /*if(row.isSelected)
            {
              if(document.getElementById(row.entity.uid).checked)
              {
                $scope.removeData(row.entity,false);
                $timeout(function () {
                  $scope.gridApi.selection.clearSelectedRows();
                  $scope.showTodaysCountPresent = false;
                  $scope.showTodaysCountForCopy();
  
                  $scope.getAttendance();
                 }, 50);
                
                return;
              }
              
            }
            else
            {
            }*/

        });
      };


      $scope.showmarkAttendanceButton = false;

      $scope.markAbsent = function (data) {
      };
      $scope.hittingEnter = function () {
        $scope.filteredRows = $scope.gridApi.core.getVisibleRows($scope.gridApi.grid);
        $scope.gridApi.selection.selectRow($scope.filteredRows[0].entity);

        $scope.clearFilters();
        $scope.getAttendance();
      }

      $scope.getTheExtractedBranchCode = function (iP) {
        console.log("iP   ->" + iP)
        var pos = iP.indexOf("--");
        var strsub = iP.substring(0, pos);
        var frmLclStrg = localStorage.getItem(strsub);

        $scope.immediateBranchCode = localStorage.getItem(frmLclStrg);
        // console.log("bc...   ->"+$scope.immediateBranchCode);

        return frmLclStrg;
      }

      $scope.clearFilters = function () {
        $scope.gridApi.grid.clearAllFilters();
      };

      var gridDiv = document.getElementById("searchTextBox");
      var byNameIp = document.getElementById("searchTextBoxFirstNames");
      byNameIp.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
          $scope.refreshData($scope.getTheExtractedBranchCode($scope.searchAttendanceGridName));
          $scope.searchAttendanceGridName = "";
        }
      });
      gridDiv.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
          console.log($scope.searchAttendanceGrid)
          $scope.refreshData($scope.getTheExtractedBranchCode($scope.searchAttendanceGrid));
          $scope.searchAttendanceGrid = "";
        }
      });

      $scope.showErrorForActivitySelectionBeingNul = false;
      $scope.dateValue = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();

      $scope.addAttendance = function (id, isSelected, index, indexForRS, branchCode, deps) {
        $scope.showTodaysCountPresent = false;
        $scope.$apply();

        if ($scope.selectedNameOfActivity === "Select") {
          $scope.gridApi.selection.clearSelectedRows();
          $scope.showErrorForActivitySelectionBeingNul = true;
          $timeout(function () {
            $scope.showErrorForActivitySelectionBeingNul = false;
            $scope.$apply();
          }, 429);
          return;
        }

        if (isSelected) {
          $scope.showErrorForActivitySelectionBeingNul = false;
          var record = $scope.GridchildData;
          writeNewPost(0, deps, indexForRS, index, id, $scope.attendanceForThisData, $scope.selectedNameOfActivity, record.branchCode, record.nameSatsangi);
          addNewUIDForTodaysDateByBranchCode(0, deps, record.nameSatsangi, indexForRS, index, id, $scope.attendanceForThisData, $scope.selectedNameOfActivity, record.branchCode);
          $scope.showTodaysCountPresent = false;
          // $scope.showTodaysCountForCopy();
          $timeout(function () {
            $scope.gridApi.selection.clearSelectedRows();
          }, 100);


        }
        else {
        }
      }

      $timeout(function () {
        $rootScope.isLoading = false;
        $rootScope.signedIn = true;
        $scope.getData();
        $scope.assignDatatoGrid();
        $scope.$apply();
        // console.log("filtering changes initialized..");
        //this feature is available only after the grid gets populated with data
        $scope.gridApi.core.on.filterChanged($scope, function () {


          var columns = $scope.gridApi.grid.columns;
          // console.log(columns)
          $rootScope.columnTitle1 = columns[7].filter.term;
          $rootScope.columnTitle2 = columns[9].filter.term;
          // console.log($rootScope.columnTitle2)
          // $rootScope.columnTitle = $rootScope.columnTitle1 !== null? $rootScope.columnTitle1 : "" + $rootScope.columnTitle2 !== null ? $rootScope.columnTitle2 : "";

          // console.log($scope.columnTitle,"tontanahal...");

          // $interval(function () {
          // setTimeout(function(){
          // $rootScope.totalItemsStrength.valueNum = $scope.gridApi.grid.options.totalItems;
          // },2000);
          // }, 5000);

          $scope.filteredRows = $scope.gridApi.core.getVisibleRows($scope.gridApi.grid);
          if ($scope.filteredRows.length === 1) {
            $scope.getAttendance();
          }

          var grid = this.grid;
          $scope.showmarkAttendanceButton = true;
          $scope.checkAttendanceForTheInputOnDate($scope.attendanceForThisData, $scope.selectedNameOfActivity);

          $scope.showTodaysCountPresent = false;
          $scope.showTodaysCountForCopy();


          var divForEventHitEnter = document.getElementById("gridDiv");
          divForEventHitEnter.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
              $scope.hittingEnter();

              $timeout(function () {
                $scope.getAttendance();
              }, 480);
            }
          });
        });

        $scope.gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
          $scope.columnChanged = { name: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
        });

      }, 1000);


      $scope.message = {
        nameSatsangi: "",
        branchCode: "",
        uid: "",
        activityName: "",
        dateValue: "",
        attendance: []

      }


      $scope.messages = chatMessages;
      $scope.getData = function () {
        $scope.messages.$loaded();
      }

      $scope.allBranchCodeList = [];
      $scope.loadBranchCodesOnly = function () {
        firebase.database().ref('satsangiUsers').on('value', function (snapshot) {
          if (snapshot.val() != null) {
            snapshot.forEach(function (childSnapshot) {
              $scope.childData = childSnapshot.val();
              $scope.allBranchCodeList.push($scope.childData.branchCode);
            });
          }
        });
      }

      $scope.assignDatatoGrid = function () {
        $scope.gridOptions.data = $scope.messages;
        $scope.checkAttendanceForTheInputOnDate($scope.attendanceForThisData, $scope.selectedNameOfActivity);
      }

      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          var user = firebase.auth().currentUser;
          if (user != null) {
            $scope.getData();
            $scope.assignDatatoGrid();
          }

        }
        else {
          return null;
        }
      });

      $scope.gotoExportExcel = function () {
        $location.path("/ssexportexcel");
      }
      $scope.gotoTV = function () {
        $location.path("/temporaryVisitors");
      }
      $scope.openCentral = function () {
        window.open("https://amsrss-a0102.firebaseapp.com");
      }




      $scope.getAttendance = function () {

        $scope.unCheckMarkedForThisDate();
        $scope.checkAttendanceForTheInputOnDate($scope.attendanceForThisData, $scope.selectedNameOfActivity);
        $scope.showTodaysCountPresent = true;
        // $scope.showTodaysCountForCopy();
      }
      $scope.getData();
      $scope.assignDatatoGrid();
      $scope.checkAttendanceForTheInputOnDate($scope.attendanceForThisData, $scope.selectedNameOfActivity);

      $scope.refreshData = function (bc) {

        if ($scope.rowIsSelected) {
          // console.log(0,$scope.rowSelectedEntity.deps,'indexForRS','index',$scope.rowSelectedEntity.id,$scope.attendanceForThisData,$scope.selectedNameOfActivity,$scope.rowSelectedEntity.branchCode,$scope.rowSelectedEntity.nameSatsangi)
          // console.log(0,$scope.rowSelectedEntity.deps,$scope.rowSelectedEntity.nameSatsangi,'indexForRS','index',$scope.rowSelectedEntity.id,$scope.attendanceForThisData,$scope.selectedNameOfActivity,$scope.rowSelectedEntity.branchCode);
          // $scope.addAttendance($scope.rowSelectedEntity.uid,true,'indexOfSelectedRec','indexForRS',$scope.rowSelectedEntity.branchCode,$scope.rowSelectedEntity.deps);
          writeNewPost(0, $scope.rowSelectedEntity.deps, 'indexForRS', 'index', $scope.rowSelectedEntity.uid, $scope.attendanceForThisData, $scope.selectedNameOfActivity, $scope.rowSelectedEntity.branchCode, $scope.rowSelectedEntity.nameSatsangi);
          addNewUIDForTodaysDateByBranchCode(0, $scope.rowSelectedEntity.deps, $scope.rowSelectedEntity.nameSatsangi, 'indexForRS', 'index', $scope.rowSelectedEntity.uid, $scope.attendanceForThisData, $scope.selectedNameOfActivity, $scope.rowSelectedEntity.branchCode);

          return;
        }

        // console.log($scope.searchAttendanceGridName+"button clicked..."+$scope.searchAttendanceGrid)
        // console.log(localStorage.getItem($scope.searchAttendanceGrid))
        // console.log(localStorage.getItem(bc)) 
        // console.log($scope.searchAttendanceGridName)

        // console.log(localStorage.getItem($scope.searchAttendanceGridName))

        if (localStorage.getItem(bc) != null || localStorage.getItem(bc) != undefined) {
          // console.log("1")
          var branchCode = localStorage.getItem(bc);
        }
        else if (localStorage.getItem($scope.searchAttendanceGrid) != null) {
          // console.log("2")
          var branchCode = localStorage.getItem(localStorage.getItem($scope.searchAttendanceGrid));
        }
        // console.log(branchCode)
        if ($scope.searchAttendanceGridName != undefined || $scope.searchAttendanceGrid != undefined) {
          // $scope.getGridDataObjectForSelection(bc);
          $scope.getGridDataObjectForSelection(branchCode);
        }
        else {
          $scope.getData();
          $scope.assignDatatoGrid();
          $scope.getAttendance();
          // $scope.$apply();
        }

      };


      $scope.getRowIndex = function (row, grid) {
        var rowIndex = -1;
        for (var i = 0; i < grid.renderContainers.body.visibleRowCache.length; i++) {
          if (row.uid === grid.renderContainers.body.visibleRowCache[i].uid) {
            rowIndex = i;
            break;
          }
        }
        return rowIndex;
      }

      $timeout(function () {
        $scope.getAttendance();
      }, 5000);



      $(document).ready(function () {

        $("#hider").hide();
        $("#popup_box").hide();

        //on click show the hider div and the message
        $("#showpopup").click(function () {
          $("#hider").fadeIn("slow");
          $('#popup_box').fadeIn("slow");
        });
        //on click hide the message and the
        $("#buttonClose").click(function () {

          $("#hider").fadeOut("slow");
          $('#popup_box').fadeOut("slow");
        });

      });

      $scope.showTodaysCountForCopy = function () {
        $scope.showTodaysCountPresent = true;
        $scope.loadCountForToday();
        $scope.getAttendance();
        $scope.showCountDialog();
      }

      /*$scope.getDBReference().child("E-Satsang").child("1004").orderByChild("sortDate").on("child_added", function(snapshot) {
        console.log(snapshot.key);
      });
      */

      function getLast3Months() {

        var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        var today = new Date();
        var last3Months = []

        for (i = 0; i < 3; i++) {
          last3Months.push(monthNames[(today.getMonth() - i)] + '-' + today.getFullYear());
        }
        return last3Months;
      }

    }]);
});
define(['./module'], function (controllers) {
  'use strict';
  controllers.controller('markattendanceCtrl', ['uiGridConstants', 'activitiesService', '$firebaseObject', '$q', '$location', '$firebaseArray', '$filter', 'uiGridExporterService', 'uiGridExporterConstants', 'AuthService', '$rootScope', '$scope', '$http', '$log', '$timeout',
    'uiGridConstants', '$templateCache',
    '$interval', 'chatMessages',
    function (uiGridConstants, activitiesService, $firebaseObject, $q, $location, $firebaseArray, $filter, uiGridExporterService, uiGridExporterConstants, AuthService, $rootScope, $scope, $http, $log, $timeout, $uiGridConstants, $templateCache, $interval, chatMessages) {

      //Make the DIV element draggagle:
dragElement(document.getElementById("dragggableSummary"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}




      $scope.dataCleanup = function(){
        // //console.log("cleaning data..")
        firebase.database().ref('satsangiUsers-attendance').remove();
      }

      //-------------------------------BIOMETRIC


      $scope.showBioMetricSpace = false;
      $scope.showBioMetri = function(){
        $scope.showBioMetricSpace = !$scope.showBioMetricSpace;
      }

      var stime;
      var etime;
      $scope.biometricId = "";
      var template_1 = "";
      var template_2 = "";

      $scope.scanBioMetricsAndMatch = function (biometricIdToMatch) {
        // //console.log("checking....for...." + biometricIdToMatch)
        $scope.satsangiUsers = firebase.database().ref('satsangiUsers');
        $scope.satsangiUsers.on('value', function (snapshot) {
          $scope.alreadyPresent = false;
          if (snapshot.val() != null) {
            snapshot.forEach(function (childSnapshot) {
              var childData = childSnapshot.val();
              // //console.log("before if.......", childData.nameSatsangi);
              if (childData.biometricId !== undefined || typeof childData.biometricId !== "undefined") {
                // //console.log(childData.nameSatsangi, "inside if====**", childData.biometricId);
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

        //console.log("capturing the finger print...")
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
              // //console.log("the captured result is", result);



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
          //console.log(data.nameSatsangi, "matched percentage is", result);
          $scope.thisOneRecodg = data.nameSatsangi;
          var userScaned = data;
          //marking attendance for the above user.
          // //console.log("BIOMETRIC SCANNED USER IS ", userScaned);
          writeNewPost(0, "", 'permanant', 'index', userScaned.uid, $scope.attendanceForThisData, $scope.selectedNameOfActivity, userScaned.uid, userScaned.nameSatsangi, userScaned.gender, userScaned.category, userScaned.dobYear, 2020 - userScaned.dobYear, userScaned.branchName, userScaned.districtName, userScaned.regionName, userScaned.suscheme);
          addNewUIDForTodaysDateByBranchCode(0, "", userScaned.nameSatsangi, 'permanant', 'index', userScaned.uid, $scope.attendanceForThisData, $scope.selectedNameOfActivity, userScaned.branchCode, userScaned.gender, userScaned.category, userScaned.dobYear, 2020 - userScaned.dobYear, userScaned.branchName, userScaned.districtName, userScaned.regionName, userScaned.suscheme);




          $scope.$apply();
        }



      }


      $scope.failFunc = function () {
        // //console.log("Some error occurred");
        return;
      }

      $scope.thisOneRecodg = "";
      $scope.matchScore = function (data) {

        // //console.log("Matching the score now.....for the satsangi name as ", data.nameSatsangi)

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

      //-----------------------------------------BIOMETRIC
      $scope.showMarkAttAsAbsMsg = { value: false, message: "" };

      $scope.markAbsBtnHover = function () {
        $scope.showMarkAttAsAbsMsg.value = true;
        $scope.showMarkAttAsAbsMsg.message = "NOTE: To Mark Attendace as Absent: Place the Uid from Grid first Text box , Then click Mark Absent Button";

        setTimeout(function () {
          $scope.showMarkAttAsAbsMsg.value = false;
          $scope.showMarkAttAsAbsMsg.message = "";

        }, 10000);
      }


      $scope.showMarkAttOfflineMsg = { value: false, message: "" };

      $scope.markAttOfflineMsg = function () {
        $scope.showMarkAttOfflineMsg.value = true;
        $scope.showMarkAttOfflineMsg.message = "NOTE: To Mark Attendace Offline: Enter the UIDs in notepad and upload the File, Download/Check Sample File for reference format. ";

        setTimeout(function () {
          $scope.showMarkAttOfflineMsg.value = false;
          $scope.showMarkAttOfflineMsg.message = "";

        }, 10000);
      }

      $scope.showMarkAttAsPresMsg = { value: false, message: "" };

      $scope.markPresBtnHover = function () {
        $scope.showMarkAttAsPresMsg.value = true;
        $scope.showMarkAttAsPresMsg.message = "NOTE: To Mark Attendace : Refresh the page and start typing the names , Select the names, Hit Enter button or as an alternate CLick Present Button to mark attendance";

        setTimeout(function () {
          $scope.showMarkAttAsPresMsg.value = false;
          $scope.showMarkAttAsPresMsg.message = "";

        }, 10000);
      }


      $scope.contactNum = "";

      $scope.showUploadFile = false;
      //---Temporary visitor 10.1.0  8th Feb 2020
      $scope.showTvEntry = { value: false };
      $scope.tv = { Name: "", BranchName: "Other", UID: "", Gender: "Male", DOB: "1989", Cat: "Initiated", su: "NA", Region: "Other", District: "Other", Branch: Math.floor((Math.random() * 10000) + 1) };

      $scope.SUSchemeCategories = ["NA", "phase_1", "phase_2"];
      $scope.editOrUpdateTheUserGenders = ["Male", "Female","Other"];
      $scope.editOrUpdateTheUserCategorySelected = ["Initiated", "Jigyasu", "Children below 18", "Other"];
      $scope.editOrUpdateTheUserDOBYears = [];
      let year = 1950;
      for (var index = 0; index <= 200; index++) {
        year = year + 1;
        $scope.editOrUpdateTheUserDOBYears.push(year);
      }
      $scope.suSchemePhaseType = { value: "" };
      $scope.handleSuSchemeSelection = function () {
        $scope.suSchemePhaseType.value = $scope.suSchemePhaseType.value;
      }

      $scope.markAttTv = function () {
        $scope.showTvEntry.value = !$scope.showTvEntry.value;
      }

      // $scope.monitorNameChange = function () {
      //   $scope.tv.UID = $scope.tv.Name.replace(/\s/g, "") + $scope.tv.Branch.replace(/\s/g, "");
      // };

      $scope.sendSMS = function () {


        var sendTo = $scope.contactNum;
        var messagetoSend = $scope.countInitiatedMale;



        // var url = "http://5.9.0.178:8000/Sendsms?user=DHANA&password=123456&sender=NTRYNS&dest="+sendTo+"&apid=9198&text="+messagetoSend+"&dcs=0";

        $scope.logurl = "http://5.9.0.178:8000/Sendsms?user=DHANA&password=123456&sender=NTRYNS&dest=" + sendTo + "&apid=9198&text=" + messagetoSend + "&dcs=0";
        // $http({
        //     method: 'POST',
        //     url: url,
        //     headers: {
        //         'Access-Control-Allow-Origin': '*'
        //     },

        // })

        alert("Opening new tab Please close it after the task is completed , Hit Enter button or else automatically The SMS will be sent successfully.")
        window.open($scope.logurl);

        // alert("The SMS sent successfully.")
      }


      // $scope.monitorBranchChange = function () {
      //   $scope.tv.UID = $scope.tv.Name.replace(/\s/g, "") + $scope.tv.Branch.replace(/\s/g, "");
      // };

      $scope.resetTvDefaults = function () {
        $scope.tv = { Name: "", BranchName: "Other", Branch: Math.floor((Math.random() * 10000) + 1), UID: "", Gender: "Male", DOB: "1989", Cat: "Initiated", su: "NA", Region: "Other", District: "Other" };

        $scope.markAttTv();
      }
      $scope.markTvPresent = function () {
        // //console.log($scope.tv);
        $scope.tv.UID = $scope.tv.Name + $scope.tv.Branch;

        if ($scope.tv.Name === "" || $scope.tv.Name == undefined || $scope.tv.Name == null ||
          $scope.tv.UID === "" || $scope.tv.UID == undefined || $scope.tv.UID == null ||
          $scope.tv.Branch === "" || $scope.tv.Branch == undefined || $scope.tv.Branch == null
        ) {
          alert("Name / S.NO / UID can't be empty . Please enter the Name / S.NO / UID details .");
          return;
        }
        // $scope.tv = { Name: "", Branch: "Other", UID: "", Gender: "Male", DOB: "1989", Cat: "Initiated", su: "NA", Region: "Other", District: "Other", Branch: "Other" };

        writeNewPost(0, "", 'temporary', 'index', $scope.tv.UID, $scope.attendanceForThisData, $scope.selectedNameOfActivity, $scope.tv.UID, $scope.tv.Name, $scope.tv.Gender, $scope.tv.Cat, $scope.tv.dobYear, 2020 - $scope.tv.DOB, $scope.tv.Branch, $scope.tv.District, $scope.tv.Region, $scope.tv.su);
        addNewUIDForTodaysDateByBranchCode(0, "", $scope.tv.Name, 'temporary', 'index', $scope.tv.UID, $scope.attendanceForThisData, $scope.selectedNameOfActivity, $scope.tv.Branch, $scope.tv.Gender, $scope.tv.Cat, $scope.tv.DOB, 2020 - $scope.tv.DOB, $scope.tv.Branch, $scope.tv.District, $scope.tv.Region, $scope.tv.su);

        alert("Temporary visitor atttendace marked successfully.")
        $scope.resetTvDefaults();

        $scope.generateRefreshSummary();
      }
      $scope.uploadAttendance = function () {
        $scope.showUploadFile = !$scope.showUploadFile;

      }

      $scope.saveAttendanceOfflineToDB = function () {

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
                  var splitData = data.split(',');
                  splitData.map(function (d, i) {
                    const userScaned = JSON.parse(localStorage.getItem('uid' + d.trim()));

                    //console.log("userScaned", userScaned)
                    writeNewPost(0, "", 'permanant', 'index', userScaned.uid, $scope.attendanceForThisData, $scope.selectedNameOfActivity, userScaned.uid, userScaned.nameSatsangi, userScaned.gender, userScaned.category, userScaned.dobYear, 2020 - userScaned.dobYear, userScaned.branchName, userScaned.districtName, userScaned.regionName, userScaned.suscheme);
                    addNewUIDForTodaysDateByBranchCode(0, "", userScaned.nameSatsangi, 'permanant', 'index', userScaned.uid, $scope.attendanceForThisData, $scope.selectedNameOfActivity, userScaned.branchCode, userScaned.gender, userScaned.category, userScaned.dobYear, 2020 - userScaned.dobYear, userScaned.branchName, userScaned.districtName, userScaned.regionName, userScaned.suscheme);


                    // writeNewPost(0, userScaned.deps, 'permanant', 'index', userScaned.uid, $scope.attendanceForThisData, $scope.selectedNameOfActivity, userScaned.branchCode, userScaned.nameSatsangi);
                    // addNewUIDForTodaysDateByBranchCode(0, userScaned.deps, userScaned.nameSatsangi, 'permanant', 'index', userScaned.uid, $scope.attendanceForThisData, $scope.selectedNameOfActivity, userScaned.branchCode);

                    //console.log(userScaned, "splitData", splitData);

                  })


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
      $scope.showUploadFileFunction = function () {

      }


      $scope.namesOfActivity = [];

      $scope.selectedNameOfActivity = "Select";

      // $scope.activitiesFromServer = activitiesService;

      // $scope.getActivitiesData = function () {
      //   $scope.activitiesFromServer.$loaded();
      // }
      // $scope.getActivitiesData();

      setTimeout(function () {
        for (var i = 0; i < $scope.activitiesFromServer.length; i++) {
          //console.log($scope.activitiesFromServer[i].activityName)
          // $scope.namesOfActivity = ["Stamp", "LTS","Star Track","Trainings","Scheduled meetings", "Survey" , "Townhall" , "Events","Select"];
          // $scope.namesOfActivity.push($scope.activitiesFromServer[i].activityName);

          $scope.$apply();
        }
      }, 5000);


      barCodeInput.addEventListener("keydown", function (e) {
        // childAtts,deps,nameSatsangi,permanant,index,uid,datePresent,activityName,branchCode,gender, category,dobyear, age, branchName , districtName , regionName

        // write new params childAtts,deps,permanant,index,uid,datePresent,eventType,branchCode,nameSatsangi,gender, category,dobyear, age , branchName , districtName , regionName
        if (e.keyCode == 13) {
          // //console.log("barCode"+$scope.barCode)
          // //console.log(JSON.parse(localStorage.getItem('uid'+$scope.barCode)))
          const userScaned = JSON.parse(localStorage.getItem('uid' + $scope.barCode));
          if(userScaned.deps == null || userScaned.deps == undefined)
          {
            userScaned.deps ="";
          }
          //console.log("=====RADHASOAMI-18-DECEMBER-2019-CHANGES DEPLOYED; changes for scheme of sant sus on jan 9th jan 10th 2020");
          writeNewPost(0, userScaned.deps, 'permanant', 'index', userScaned.uid, $scope.attendanceForThisData, $scope.selectedNameOfActivity, userScaned.branchCode, userScaned.nameSatsangi, userScaned.gender, userScaned.category, userScaned.dobYear, 2020 - userScaned.dobYear, userScaned.branchName, userScaned.districtName, userScaned.regionName, userScaned.suscheme);
          addNewUIDForTodaysDateByBranchCode(0, userScaned.deps, userScaned.nameSatsangi, 'permanant', 'index', userScaned.uid, $scope.attendanceForThisData, $scope.selectedNameOfActivity, userScaned.branchCode, userScaned.gender, userScaned.category, userScaned.dobYear, 2020 - userScaned.dobYear, userScaned.branchName, userScaned.districtName, userScaned.regionName, userScaned.suscheme);
          $scope.barCode = "";
        }
      });

      $scope.showCountDialog = function () {
        // ngDialog.open({ template: 'templateId',scope: $scope });
      }

      $scope.rowIsSelected = false;
      $scope.rowSelectedEntity = {};
      $scope.counter = 0;
      $scope.totalItemsMarkAtt = { valueNumMarkAtt: 0 };
      $scope.decrementCounter = 0;
      $scope.disableDecrementAttendanceFlag = { value: true };

      $scope.markDepsAbsent = function (row) {
        $scope.showTodaysCountPresent = false;
        if (row.childAtts - 1 < 0) {
          return;
        }
        // //console.log("SOLE==================================================================================", row);
        $scope.decrementCounter = row.childAtts - 1;
        writeNewPost(row.childAtts - 1, row.linked, row.indexForRS, row.index, row.$id, $scope.attendanceForThisData, $scope.selectedNameOfActivity, row.branchCode, row.nameSatsangi);
        addNewUIDForTodaysDateByBranchCode(row.childAtts - 1, row.linked, row.nameSatsangi, row.indexForRS, row.index, row.$id, $scope.attendanceForThisData, $scope.selectedNameOfActivity, row.branchCode);
        $scope.decrementCounter = 0;
        // $scope.$apply();

        $scope.generateRefreshSummary();
      }

      $scope.markPlusPresents = function (row) {
        $scope.showTodaysCountPresent = false;
        // //console.log(row.childAtts);
        // return;
        if (row.childAtts == undefined) {
          //console.log(row.childAtts);
          $scope.counter = 0;
          $scope.counter = $scope.counter + 1;
        }
        else {
          $scope.counter = row.childAtts + 1;
        }

        // //console.log(JSON.stringify(row));

        // //console.log($scope.counter);
        writeNewPost($scope.counter, row.linked, row.indexForRS, row.index, row.$id, $scope.attendanceForThisData, $scope.selectedNameOfActivity, row.branchCode, row.nameSatsangi);
        addNewUIDForTodaysDateByBranchCode($scope.counter, row.linked, row.nameSatsangi, row.indexForRS, row.index, row.$id, $scope.attendanceForThisData, $scope.selectedNameOfActivity, row.branchCode);
        // alert("hi"+row);

        // $scope.$apply();

        $scope.generateRefreshSummary()

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
      $scope.toggleMainGrid = false;
      $scope.toggleAttGrid = true;
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
        $scope.searchAttendanceGrid = "";
        $scope.searchAttendanceGridName = "";
      }

      $scope.autoCompleteArrray = [];
      $scope.autoCompleteArrayNames = [];
      $scope.autoCompleteLinkedArray = [];

      // $scope.getTheAutoCompleteData = function()
      // {
  
     

     
        var ref = firebase.database().ref("satsangiUsers");
        ref.once("value")
          .then(function (snapshot) {
            if (snapshot.val() != null) {
              snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                var originalName = childSnapshot.val().nameSatsangi.trim();
  
                var trimmedName = originalName.substring(originalName.indexOf(" ") + 1, originalName.length).trim();
  
              
        
                // //console.log(trimmedName);
                // var strToPush = childSnapshot.val().branchCode + "--" + childSnapshot.val().nameSatsangi + "&nbsp;&nbsp;<button  id=\"markPresentOnline\" class=\"btn btn-primary\" >Click to mark Present</button>";
                var strToPush = childSnapshot.val().branchCode + "--" + childSnapshot.val().nameSatsangi;
                var strNamesFirstToPush = childSnapshot.val().nameSatsangi + "--" + childSnapshot.val().branchCode;
                var strNamesFirstToPushTrimmed = trimmedName + "--" + childSnapshot.val().branchCode;
                var strLinked = childSnapshot.val().branchCode + "--" + childSnapshot.val().deps;
                $scope.autoCompleteLinkedArray.push(strLinked);
                // //console.log(strLinked);
                localStorage.setItem(childSnapshot.val().branchCode, childSnapshot.val().branchCode);
                localStorage.setItem(childSnapshot.val().nameSatsangi, childSnapshot.val().branchCode);
                // //console.log('uid================================>' + '' + childSnapshot.val().uid, childSnapshot.val())
                localStorage.setItem('uid' + childSnapshot.val().uid, JSON.stringify(childSnapshot.val()));
                //console.log(JSON.parse(localStorage.getItem('uid' + childSnapshot.val().uid)))
  
                localStorage.setItem(trimmedName, originalName);
                $scope.autoCompleteArrray.push(strToPush);
                // $scope.autoCompleteArrayNames.push(strNamesFirstToPush);
                $scope.autoCompleteArrayNames.push(strNamesFirstToPushTrimmed);
                // //console.log($scope.autoCompleteArrayNames)
              });

             

            }
  
          });


      // }
    

      setTimeout(function(){
        $scope.getTheAutoCompleteData();
        console.log("fetching the autocomplete data")
      },2000)

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
            //console.log(arr[i])
            /*check if the item starts with the same letters as the text field value:*/
            // if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            if (arr[i].toUpperCase().includes(val.toUpperCase())) {

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
                // //console.log(inp.value)
                // //console.log($scope.getTheExtractedBranchCode(inp.value));

                var getOriginalName = localStorage.getItem($scope.getTheExtractedBranchCode(inp.value));
                // //console.log("getOriginalName"+getOriginalName)
                // var actualExtract= $scope.getTheExtractedBranchCode(getOriginalName);
                // //console.log("hhhhhhhhhh"+actualExtract)
                // $scope.searchAttendanceGrid = actualExtract;
                //console.log(getOriginalName + "-------------------------------------------------------------------------->")
                $scope.searchAttendanceGrid = getOriginalName;
                $scope.searchAttendanceGridName = $scope.searchAttendanceGrid;
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
              // //console.log("entrance"+$scope.searchAttendanceGridName)
              // //console.log("entrance"+localStorage.getItem($scope.searchAttendanceGridName))

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
          console.log("Here maddy...")
          var x = document.getElementsByClassName("autocomplete-items");
          for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
              x[i].parentNode.removeChild(x[i]);
            }
          }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
          // console.log("primary Here maddy...")
         

          closeAllLists(e.target);
        });

        document.addEventListener("contextmenu", function (e) {
          // console.log("primary Here maddy right click...")
         

          closeAllLists(e.target);
        });

      }
      //--
      var dataAutoComplete = $scope.autoCompleteArrray;
      var dataAutoCompleteNamesFrst = $scope.autoCompleteArrayNames;
      var linkedAutoComplete = $scope.autoCompleteLinkedArray;

      autocomplete(document.getElementById("searchTextBox"), dataAutoComplete);
      autocomplete(document.getElementById("searchTextBoxFirstNames"), dataAutoCompleteNamesFrst);
      autocomplete(document.getElementById("searchTextBoxFirstNames"), dataAutoComplete);
      autocomplete(document.getElementById("barcodeInptTxtBx"), dataAutoComplete);
  
    

      // autocomplete(document.getElementById("searchLinkedId"), linkedAutoComplete);

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
        // //console.log("branchCode1..... :"+$scope.immediateBranchCode)
        var branchCode = localStorage.getItem(localStorage.getItem($scope.searchAttendanceGrid));

        // branchCode = branchCode || $scope.searchAttendanceGrid;

        if (branchCode === null) {
          branchCode = $scope.searchAttendanceGrid;
        }
        // //console.log("branchCode now...>>> :" + branchCode)
        var activityS = $scope.selectedNameOfActivity;
        var dateS = $scope.attendanceForThisData;
        $scope.frBrnchCode = firebase.database().ref('satsangiUsers-attendance');
        $scope.frBrnchCode.child(dateS).child(activityS).child(branchCode).remove();
        $scope.frBrnchCode.child(activityS).child(branchCode).child(dateS).remove();

        $scope.searchAttendanceGrid = "";
        $scope.searchAttendanceGridName = "";
        // $scope.getAttendance();

        // $('#virtualTable tbody').remove();

        $scope.generateRefreshSummary();
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
                $scope.dateKeysForBhandara.push(childSnapshot.key);
                $scope.BranchSpecialSatsangPresentsFrThisBrCode = $scope.dateKeysForBhandara.length;
              }
              if (activityName === "Morning Cleaning") {
                $scope.dateKeysForAarti.push(childSnapshot.key);
                $scope.MorningCleaningPresentsFrThisBrCode = $scope.dateKeysForAarti.length;
              }
              if (activityName === "Evening Cleaning") {
                $scope.dateKeysForCleaningSewa.push(childSnapshot.key);
                $scope.EveningCleaningPresentsFrThisBrCode = $scope.dateKeysForCleaningSewa.length;
              }
              if (activityName === "Windup") {
                $scope.dateKeysForMahilaAssociation.push(childSnapshot.key);
                $scope.WindupPresentsFrThisBrCode = $scope.dateKeysForMahilaAssociation.length;
              }

              if (activityName === "Weekly Cleaning") {
                $scope.dateKeysForMedicalCamp.push(childSnapshot.key);
                $scope.WeeklyCleaningPresentsFrThisBrCode = $scope.dateKeysForMedicalCamp.length;
              }
              if (activityName === "Basant Arti") {
                $scope.dateKeysForDailySatsangMorning.push(childSnapshot.key);
                $scope.BasantArtiPresentsFrThisBrCode = $scope.dateKeysForDailySatsangMorning.length;
              }
              if (activityName === "Basant Bhandara") {
                $scope.dateKeysForDailySatsangEvening.push(childSnapshot.key);
                $scope.BasantBhandaraEveningPresentsFrThisBrCode = $scope.dateKeysForDailySatsangEvening.length;
              }
              if (activityName === "Holi Arti") {
                $scope.dateKeysForNightDuty.push(childSnapshot.key);
                $scope.HoliArtiPresentsFrThisBrCode = $scope.dateKeysForNightDuty.length;
              }

              if (activityName === "Holi Bhandara") {
                $scope.dateKeysForYouthPath.push(childSnapshot.key);
                $scope.HoliBhandaraPresentsFrThisBrCode = $scope.dateKeysForYouthPath.length;
              }
              if (activityName === "Arti") {
                $scope.dateKeysForHelpdeskESatsang.push(childSnapshot.key);
                $scope.ArtiPresentsFrThisBrCode = $scope.dateKeysForHelpdeskESatsang.length;
              }

              if (activityName === "Bhandara") {
                $scope.dateKeysForHelpdeskBhandara.push(childSnapshot.key);
                $scope.BhandaraPresentsFrThisBrCode = $scope.dateKeysForHelpdeskBhandara.length;
              }
              if (activityName === "Copy Unit") {
                $scope.dateKeysForHelpdeskAarti.push(childSnapshot.key);
                $scope.CopyUnitPresentsFrThisBrCode = $scope.dateKeysForHelpdeskAarti.length;
              }

              if (activityName === "Bag Unit") {
                $scope.dateKeysForHelpdeskBhandara.push(childSnapshot.key);
                $scope.BagUnitPresentsFrThisBrCode = $scope.dateKeysForHelpdeskBhandara.length;
              }
              if (activityName === "Night Duty") {
                $scope.dateKeysForHelpdeskAarti.push(childSnapshot.key);
                $scope.NightDutyPresentsFrThisBrCode = $scope.dateKeysForHelpdeskAarti.length;
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

      $scope.openDetails = function (row, id, toCallLoadMethod) {
        $scope.datesPresentArray = [];
        // $("#hider").fadeIn("slow");
        // $('#popup_box').fadeIn("slow");
        if (toCallLoadMethod) {
          $scope.nameSatsangiSelected = row.nameSatsangi;
          $scope.branchCodeSelected = row.branchCode;
          $timeout(function () {
            $scope.loadDetailsPerBrCd($scope.selectedNameOfActivity, row.branchCode);
          }, 250);
        }
      }

      $scope.fetchActivitiesData  = async function(){
        
        $scope.namesOfActivity= await activitiesService;
          // const eventListFromFirebase = await firebase.database().ref('/activities/').once('value').then((snapshot) => {
          //   return snapshot.val()
          // })
          // $scope.namesOfActivity= Object.keys(eventListFromFirebase)
      }
      
      $scope.fetchActivitiesData();
      // $scope.namesOfActivity = ["E-Satsang", "Branch Satsang", "Bhandara","Aarti","Cleaning Sewa","Mahila Association","Medical Camp","Daily Satsang Morning","Daily Satsang Evening","Night Duty","Youth Path","Helpdesk E-Satsang","Helpdesk-Aarti","Helpdesk Bhandara" , "Select"];
      // $scope.namesOfActivity = ["Morning Video E-Satsang" , "Evening Video E-Satsang","Morning Audio E-Satsang" , "Evening Audio E-Satsang", "Special Cleaning", "Special Satsang", "E-Satsang", "Branch Morning Satsang", "Branch Evening Satsang", "Branch Special Satsang", "Morning Cleaning", "Evening Cleaning", "Windup", "Weekly Cleaning", "Basant Arti", "Basant Bhandara", "Holi Arti", "Holi Bhandara", "Arti", "Bhandara", "Copy Unit", "Bag Unit", "Night Duty", "Select"];
      $scope.filtersSels = ["Select", "Last 1 month", "Last 2 months", "Last 3 months", "Last 6 months"];
      $scope.selectedfilterSel = "Select";
      // $scope.selectedNameOfActivity = "Select";
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
                  //console.log("$scope.GridchildData control flow check..>>>>", $scope.GridchildData);
                }
              });
              $scope.addAttendance($scope.GridchildData.uid, true, 'indexOfSelectedRec', 'permanant', $scope.GridchildData.branchCode, $scope.GridchildData.deps, $scope.GridchildData.gender, $scope.GridchildData.category, $scope.GridchildData.dobYear, 2020 - $scope.GridchildData.dobYear, $scope.GridchildData.branchName, $scope.GridchildData.districtName, $scope.GridchildData.regionName, $scope.GridchildData.suscheme);
              // //console.log("$scope.GridchildData"+$scope.GridchildData)
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

      function addNewUIDForTodaysDateByBranchCode(childAtts, deps, nameSatsangi, indexForRS, index, uid, datePresent, activityName, branchCode, gender, category, dobyear, age, branchName, districtName, regionName, scheme) {
        //console.log("control flow execution here also ", scheme, branchName, districtName, regionName, "addNewUIDForTodaysDateByBranchCode, gender, category,dobyear, age", gender, category, dobyear, age)
        if (deps === undefined) {
          deps = "-";
        }
        var postData = {
          // gender:gender, 
          // category:category,
          // dobyear:dobyear, 
          // age:age,
          timestamp:new Date(),
          suscheme: scheme,
          gender: gender !== undefined ? gender : "update gender",
          category: category !== undefined ? category : "updated if initiated/jigyasu/other",
          dobyear: dobyear !== undefined ? dobyear : "update dobyear",
          age: age !== undefined ? age : "update dobyear",

          // branchName:branchName ,
          // districtName:districtName ,
          // regionName:regionName,

          branchName: branchName !== undefined ? branchName : "Pune",
          districtName: districtName !== undefined ? districtName : "MP",
          regionName: regionName !== undefined ? regionName : "MP",

          linked: deps,
          childAtts: childAtts,
          indexForRS: indexForRS,
          index: index,
          uid: uid,
          activityName: activityName,
          // sortDate: $scope.timeFromtheSelectedDate * -1,
          sortDate:new Date().getTime()*-1,
          branchCode: branchCode,
          nameSatsangi: nameSatsangi,
          datePresent: datePresent,

          // sortDate:new Date().getTime()*-1,


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
          // //console.log(updates,"here absolute")
          var resp = firebase.database().ref().update(updates);
          // $scope.addNwRc(deps, nameSatsangi, branchCode);
          $scope.reset();
          $scope.rowIsSelected = false;
          $scope.rowSelectedEntity = {};
          //console.log("clearing selected rows if any")
          $scope.gridApi.selection.clearSelectedRows();
          $scope.barCode = "";
          return resp;
        }
      }

      function writeNewPost(childAtts, deps, indexForRS, index, uid, datePresent, eventType, branchCode, nameSatsangi, gender, category, dobyear, age, branchName, districtName, regionName, scheme) {
        //console.log(scheme, "control flow triggered here ... at debugging jan 2020 9th writeNewPost", gender, category, dobyear, age, branchName, districtName, regionName);
        if (deps === undefined) {
          deps = "-";
        }
        var postData = {
          // suscheme:scheme,
          timestamp:new Date(),
          suscheme: scheme !== undefined ? scheme : "na",
          gender: gender !== undefined ? gender : "update gender",
          category: category !== undefined ? category : "updated if initiated/jigyasu/other",
          dobyear: dobyear !== undefined ? dobyear : "update dobyear",
          age: age !== undefined ? age : "update dobyear",
          branchName: branchName !== undefined ? branchName : "Pune",
          districtName: districtName !== undefined ? districtName : "MP",
          regionName: regionName !== undefined ? regionName : "MP",
          linked: deps,
          childAtts: childAtts,
          indexForRS: indexForRS,
          index: index,
          uid: uid,
          datePresent: datePresent,
          activityName: eventType,
          branchCode: branchCode,
          nameSatsangi: nameSatsangi,
          // sortDate: $scope.timeFromtheSelectedDate * -1,
          sortDate:new Date().getTime()*-1
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

        $scope.generateRefreshSummary()

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
        // //console.log( $scope.selectedNameOfActivity)
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
        $scope.generateRefreshSummary();
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

        // $scope.generateRefreshSummary();
        $scope.generateRefreshSummary();

      }


      $scope.changeSelectT = function (dt) {
        var busDateT = $filter('date')($scope.tdt, 'dd-MM-yyyy');
        $scope.nextWeekSunday = busDateT;
        $scope.generateRefreshSummary();

      }


      $scope.exportCsv = function () {
        var grid = $scope.gridApi.grid;
        var rowTypes = uiGridExporterConstants.ALL;
        var colTypes = uiGridExporterConstants.ALL;
        uiGridExporterService.csvExport(grid, rowTypes, colTypes);
      };

      function updateSatsangiUser(uid, datePresent, deps, branchCode, nameSatsangi) {
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
        //console.log("saveRow.................." + rowEntity.uid, $scope.attendanceForThisData, rowEntity.deps, rowEntity.branchCode, rowEntity.nameSatsangi)
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
          name: 'branchCode', enableCellEdit: false, width: 110, cellTemplate: '<div>' +
            '  <a id="" class="branchCodeLinkSty" ng-click="grid.appScope.openDetails(row.entity,row.entity.uid,true)" href="">{{row.entity.branchCode}}</a>' +
            '</div>', headerCellClass: 'blueOne', field: 'branchCode', enableFiltering: true, enableHiding: false
        },
        { name: 'SatsangiName', enableCellEdit: true, headerCellClass: 'blue', field: 'nameSatsangi', enableFiltering: true, enableHiding: false },
        { name: 'uid', enableCellEdit: true, field: 'uid', headerCellClass: 'blue', enableFiltering: false, enableHiding: false },
        /* { name:'Linked', field: 'deps',headerCellClass: 'blue',enableFiltering: true,enableHiding:false },*/
        // { name: 'Attendance', enableCellEdit: false,width:75 ,headerCellClass: 'bluePlusWidth', field:'markPresent', exporterPdfAlign: 'right',enableHiding:false ,visible:true,cellTemplate: 'mapPresent.html',enableFiltering: false  }
      ];

      $scope.columns1 = [
        { name: 'Name', visible: true, width: 200, headerCellClass: 'blue', field: 'nameSatsangi', enableFiltering: true },
        { name: 'UID', visible: true, headerCellClass: 'blue', field: 'branchCode', enableFiltering: true },
       
        {
          name: 'Gender', filter: {
            term: 'Male',
            // show:false,
            // hide:true,
            // hidden:true,
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
          }, headerCellClass: 'blue', field: 'gender', enableFiltering: true
        },
        // { name: 'DOB Year', visible: true, headerCellClass: 'blue', field: 'dobyear', enableFiltering: true },
        // {
        //   name: 'Age', filters: [
        //     {
        //       condition: uiGridConstants.filter.GREATER_THAN,
        //       placeholder: 'greater than'
        //     },
        //     {
        //       condition: uiGridConstants.filter.LESS_THAN,
        //       placeholder: 'less than'
        //     }
        //   ], visible: true, headerCellClass: 'blue', field: 'age', enableFiltering: true
        // },
        {
          name: 'Category', filter: {
            term: 'Initiated',
            // visible:false,
            type: uiGridConstants.filter.SELECT,
            selectOptions: [{ value: 'Initiated', label: 'Initiated' }, { value: 'Jigyasu', label: 'Jigyasu' }, { value: 'Children below 18', label: 'Children below 18' }, { value: 'Other', label: 'Other' }],
            cellFilter: function () {
              var genderHash = {
                'Initiated': 'Initiated',
                'Jigyasu': 'Jigyasu',
                'Children below 18': 'Children below 18',
                'Other': 'Other'
              };

              return function (input) {
                if (!input) {
                  return '';
                } else {
                  return genderHash[input];
                }
              };
            }
          },  headerCellClass: 'blue', field: 'category', enableFiltering: true
        },

        // { name: 'Region', visible: true, headerCellClass: 'blue', field: 'regionName', enableFiltering: true },


        // { name: 'District', visible: true, headerCellClass: 'blue', field: 'districtName', enableFiltering: true },
        // {
        //   name: 'Branch', filter: {
        //     term: 'Branch',
        //     type: uiGridConstants.filter.SELECT,
        //     selectOptions: [{ value: 'Pune', label: 'Pune' }, { value: 'Other', label: 'Other' }],
        //     cellFilter: function () {
        //       var genderHash = {
        //         'Pune': 'Pune',
        //         'Other': 'Other'
        //       };

        //       return function (input) {
        //         if (!input) {
        //           return '';
        //         } else {
        //           return genderHash[input];
        //         }
        //       };
        //     }
        //   },



        //   visible: true, headerCellClass: 'blue', field: 'branchName', enableFiltering: true
        // },

        // { name: 'Scheme', visible: true, headerCellClass: 'blue', field: 'suscheme', enableFiltering: true },


        // { name:'Gender',  visible:true,headerCellClass: 'blue',field: 'gender' ,enableFiltering: true }, 


        /* { name:'Linked', field: 'linked',headerCellClass: 'blue',enableFiltering: true,enableHiding:false }*/
        /*{ name: '(+)  or  (-)', headerCellClass: 'blue',cellTemplate: 'mapAddress.html' ,enableFiltering: false },
        { name: 'Dependants', headerCellClass: 'blue',field: 'childAtts',enableFiltering: false  }*/
        /*
        { name:'uid',headerCellClass: 'blue',field: 'uid' },
        { name:'datePresent',headerCellClass: 'blue',field: 'datePresent' },
         { name:'activityName',headerCellClass: 'blue',field: 'activityName' }
        { name:'Present', headerCellClass: 'blue',enableFiltering: false , cellTemplate:'<div>{{" Present"}}</div>' }*/

        // { name: 'Type', visible: true, headerCellClass: 'blue', field: 'indexForRS', enableFiltering: true },


      ];

      $scope.gridOptions1 = {
        enableFiltering: true,
        enableGridMenu: false,
        enableRowSelection: true,
        enableSorting: false,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        paginationPageSizes: [5, 10, 20],
        paginationPageSize: 5,
        columnDefs: $scope.columns1
      };

      $scope.gridOptions1.multiSelect = false;
      // $scope.gridOptions1.clearAllFilters();
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
      // document.getElementById("generatedSummary").style.display = "none";

      $scope.showGenSum = true;

      $scope.generateRefreshSummary = function () {
        var showGenSum = true;
        setTimeout(function(){
          $scope.generateSummary(showGenSum);
        },1000);
        
      }

      $scope.generateSummary = function (showGenSum) {
        
        // //console.log($scope.gridOptions1.data);
        $scope.showGenSum = showGenSum;
        if(!showGenSum)
        {
          document.getElementById("dragggableSummaryheader").style.display = "none";
        }
        else
        {
          document.getElementById("dragggableSummaryheader").style.display = "block";
        }

        // document.getElementById("generatedSummary").style.display = "block";
        $scope.indexInitiatedFemale = 0;
        $scope.countInitiatedMale = 0;
        $scope.countJigyasuMale = 0;
        $scope.countJigyasuFemale = 0;

        $scope.countChildrenbelow18Male = 0;
        $scope.countChildrenbelow18Female = 0;

        $scope.countSUSchemePhase1 = 0;
        $scope.countSUSchemePhase2 = 0;

        $scope.countOtherMale = 0;
        $scope.countOtherFemale = 0;
        $scope.countOtherAll = 0;


        $scope.countSUSchemePhase1Male = 0;
        $scope.countSUSchemePhase2Male = 0;
        $scope.countSUSchemePhase1Female = 0;
        $scope.countSUSchemePhase2Female = 0;

        $scope.totalInitiated = 0;
        $scope.totalJigyasu = 0;
        $scope.totalChildrenn = 0;


        //row1
        $scope.initiatedThisBrnchGents = 0;
        $scope.initiatedThisBrnchLadies = 0;
        $scope.initiatedOtherBrnchGents = 0;
        $scope.initiatedOtherBrnchLadies = 0;

        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category === "Initiated" && data.gender === "Male" && data.branchName == "Pune") {
            $scope.initiatedThisBrnchGents++
          }
        });

        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category === "Initiated" && data.gender === "Female" && data.branchName == "Pune") {
            $scope.initiatedThisBrnchLadies++
          }
        });

      
        $scope.gridOptions1.data.map(function (data, index) {
          //console.log("bolo"+JSON.stringify(data));
          if (data.category === "Initiated" && data.gender === "Male" && data.branchName !== "Pune") {
            //console.log("lolo",data.branch)
            $scope.initiatedOtherBrnchGents++
          }
        });

        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category === "Initiated" && data.gender === "Female" && data.branchName !== "Pune") {
            $scope.initiatedOtherBrnchLadies++
          }
        });




        //row2
        $scope.jigThisBrnchGents = 0;
        $scope.jigThisBrnchLadies = 0;

        $scope.jigOtherBrnchGents = 0;
        $scope.jigOtherBrnchLadies = 0;



        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category == "Jigyasu" && data.gender == "Male" && data.branchName == "Pune") {
            $scope.jigThisBrnchGents++
          }
        });

        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category == "Jigyasu" && data.gender == "Female" && data.branchName == "Pune") {
            $scope.jigThisBrnchLadies++
          }
        });


        
        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category == "Jigyasu" && data.gender == "Male" && data.branchName !== "Pune") {
            $scope.jigOtherBrnchGents++
          }
        });

        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category == "Jigyasu" && data.gender == "Female" && data.branchName !== "Pune") {
            $scope.jigOtherBrnchLadies++
          }
        });


                //row3
                $scope.OtherthanInitJigThisBrnchGents = 0;
                $scope.OtherthanInitJigThisBrnchLadies = 0;
                $scope.OtherthanInitJigOtherBrnchGents = 0;
                $scope.OtherthanInitJigOtherBrnchLadies = 0;


        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category !== "Children below 18" && data.category !== "Children below 15" && data.category !== "Jigyasu" && data.category !== "Initiated" && data.gender === "Male" && data.branchName === "Pune") {
            $scope.OtherthanInitJigThisBrnchGents++
          }
        });

        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category !== "Children below 18" && data.category !== "Children below 15" &&  data.category !== "Jigyasu" && data.category !== "Initiated" && data.gender === "Female" && data.branchName === "Pune") {
            $scope.OtherthanInitJigThisBrnchLadies++
          }
        });

      
        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category !== "Children below 18" && data.category !== "Children below 15" &&  data.category !== "Jigyasu" && data.category !== "Initiated" && data.gender === "Male" && data.branchName !== "Pune") {
            $scope.OtherthanInitJigOtherBrnchGents++
          }
        });

        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category !== "Children below 18" && data.category !== "Children below 15" &&  data.category !== "Jigyasu" && data.category !== "Initiated" && data.gender === "Female" && data.branchName !== "Pune") {
            $scope.OtherthanInitJigOtherBrnchLadies++
          }
        });



        //row4
        $scope.ChildrnLesDnFtnThisBrnchGents = 0;
        $scope.ChildrnLesDnFtnThisBrnchLadies = 0;
        $scope.ChildrnLesDnFtnOtherBrnchGents = 0;
        $scope.ChildrnLesDnFtnOtherBrnchLadies = 0;

        $scope.gridOptions1.data.map(function (data, index) {
          if ((data.category === "Children below 18" || data.category === "Children below 15") && data.gender === "Male" && data.branchName == "Pune") {
            $scope.ChildrnLesDnFtnThisBrnchGents++
          }
        });


        $scope.gridOptions1.data.map(function (data, index) {
          if ((data.category === "Children below 18" || data.category === "Children below 15") && data.gender === "Female" && data.branchName == "Pune") {
            $scope.ChildrnLesDnFtnThisBrnchLadies++
          }
        });

        $scope.gridOptions1.data.map(function (data, index) {
          if ((data.category === "Children below 18" || data.category === "Children below 15") && data.gender === "Male" && data.branchName !== "Pune") {
            $scope.ChildrnLesDnFtnThisBrnchGents++
          }
        });


        $scope.gridOptions1.data.map(function (data, index) {
          if ((data.category === "Children below 18" || data.category === "Children below 15") && data.gender === "Female" && data.branchName !== "Pune") {
            $scope.ChildrnLesDnFtnThisBrnchLadies++
          }
        });


        //row5
        $scope.SntsuPh1ThisBrnchGents = 0;
        $scope.SntsuPh1ThisBrnchLadies = 0;
        $scope.SntsuPh1OtherBrnchGents = 0;
        $scope.SntsuPh1OtherBrnchLadies = 0;

        $scope.gridOptions1.data.map(function (data, index) {
         
          if (data.suscheme === "phase_1" && data.gender == "Male" && data.branchName == "Pune") {
            $scope.SntsuPh1ThisBrnchGents++
          }
        });

        $scope.gridOptions1.data.map(function (data, index) {
     
        
          if (data.suscheme === "phase_1" && data.gender == "Female" && data.branchName == "Pune") {
            $scope.SntsuPh1ThisBrnchLadies++
          }
        });

        $scope.gridOptions1.data.map(function (data, index) {
         
          if (data.suscheme === "phase_1" && data.gender == "Male" && data.branchName !== "Pune") {
            $scope.SntsuPh1OtherBrnchGents++
          }
        });

        $scope.gridOptions1.data.map(function (data, index) {
     
        
          if (data.suscheme === "phase_1" && data.gender == "Female" && data.branchName !== "Pune") {
            $scope.SntsuPh1OtherBrnchLadies++
          }
        });




        //row6
        $scope.SntsuPh2ThisBrnchGents = 0;
        $scope.SntsuPh2ThisBrnchLadies = 0;
        $scope.SntsuPh2OtherBrnchGents = 0;
        $scope.SntsuPh2OtherBrnchLadies = 0;


        // $scope.SntsuPh3ThisBrnchGents = 0;
        // $scope.SntsuPh3ThisBrnchLadies = 0;
        // $scope.SntsuPh3OtherBrnchGents = 0;
        // $scope.SntsuPh3OtherBrnchLadies = 0;

        //primary 1
        $scope.SntsuPrm1ThisBrnchGents = 0;
        $scope.SntsuPrm1ThisBrnchLadies = 0;
        $scope.SntsuPrm1OtherBrnchGents = 0;
        $scope.SntsuPrm1OtherBrnchLadies = 0;

        //primary 2
        $scope.SntsuPrm2ThisBrnchGents = 0;
        $scope.SntsuPrm2ThisBrnchLadies = 0;
        $scope.SntsuPrm2OtherBrnchGents = 0;
        $scope.SntsuPrm2OtherBrnchLadies = 0;

 
        $scope.gridOptions1.data.map(function (data, index) {
         
          if (data.suscheme === "phase_2" && data.gender == "Male" && data.branchName == "Pune") {
            $scope.SntsuPh2ThisBrnchGents++
          }

          // if (data.suscheme === "phase_3" && data.gender == "Male" && data.branchName == "Pune") {
          //   $scope.SntsuPh3ThisBrnchGents++
          // }

          if (data.suscheme === "Primary_1" && data.gender == "Male" && data.branchName == "Pune") {
            $scope.SntsuPrm1ThisBrnchGents++
          }

          if (data.suscheme === "Primary_2" && data.gender == "Male" && data.branchName == "Pune") {
            $scope.SntsuPrm2ThisBrnchGents++
          }
          
        });

        $scope.gridOptions1.data.map(function (data, index) {
     
        
          if (data.suscheme === "phase_2" && data.gender == "Female" && data.branchName == "Pune") {
            $scope.SntsuPh2ThisBrnchLadies++
          }

          // if (data.suscheme === "phase_3" && data.gender == "Female" && data.branchName == "Pune") {
          //   $scope.SntsuPh3ThisBrnchLadies++
          // }

          if (data.suscheme === "Primary_1" && data.gender == "Female" && data.branchName == "Pune") {
            $scope.SntsuPrm1ThisBrnchLadies++
          }

          if (data.suscheme === "Primary_2" && data.gender == "Female" && data.branchName == "Pune") {
            $scope.SntsuPrm2ThisBrnchLadies++
          }

        });

        $scope.gridOptions1.data.map(function (data, index) {
         
          if (data.suscheme === "phase_2" && data.gender == "Male" && data.branchName !== "Pune") {
            $scope.SntsuPh2OtherBrnchGents++
          }

          // if (data.suscheme === "phase_3" && data.gender == "Male" && data.branchName !== "Pune") {
          //   $scope.SntsuPh3OtherBrnchGents++
          // }

          if (data.suscheme === "Primary_1" && data.gender == "Male" && data.branchName !== "Pune") {
            $scope.SntsuPrm1OtherBrnchGents++
          }

          if (data.suscheme === "Primary_2" && data.gender == "Male" && data.branchName !== "Pune") {
            $scope.SntsuPrm2OtherBrnchGents++
          }

        });

        $scope.gridOptions1.data.map(function (data, index) {
     
        
          if (data.suscheme === "phase_2" && data.gender == "Female" && data.branchName !== "Pune") {
            $scope.SntsuPh2OtherBrnchLadies++
          }

          // if (data.suscheme === "phase_3" && data.gender == "Female" && data.branchName !== "Pune") {
          //   $scope.SntsuPh3OtherBrnchLadies++
          // }

          if (data.suscheme === "Primary_1" && data.gender == "Female" && data.branchName !== "Pune") {
            $scope.SntsuPrm1OtherBrnchLadies++
          }

          if (data.suscheme === "Primary_2" && data.gender == "Female" && data.branchName !== "Pune") {
            $scope.SntsuPrm2OtherBrnchLadies++
          }


        });





// $scope.$apply();
        $scope.totalHeadCountForTheDay = $scope.gridOptions1.data.length;

        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category === "Initiated" && data.gender === "Female") {
            $scope.indexInitiatedFemale++
          }
        });

        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category === "Initiated" && data.gender === "Male") {
            $scope.countInitiatedMale++
          }
        });


        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category === "Jigyasu" && data.gender === "Female") {
            $scope.countJigyasuFemale++
          }
        });

        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category === "Jigyasu" && data.gender === "Male") {
            $scope.countJigyasuMale++
          }
        });

        $scope.gridOptions1.data.map(function (data, index) {
          //changs dec 18 2019
          if ((data.category === "Children below 18" || data.category === "Children below 15") && data.gender === "Female") {
            $scope.countChildrenbelow18Female++
          }
        });

        //changes on Jan 9th - 2020
        $scope.gridOptions1.data.map(function (data, index) {
          //changs Jan 9th 2019
          //console.log($scope.gridOptions1.data)
          //console.log("=============suscheme--=============================>", data.suscheme)
          if (data.suscheme === "phase_1") {
            $scope.countSUSchemePhase1++
          }
        });


        //changes on Jan 9th - 2020
        $scope.gridOptions1.data.map(function (data, index) {
          //changs Jan 9th 2019
          if ((data.category === "Children below 18" || data.category === "Children below 15") && data["suscheme"] === "phase_2") {
            $scope.countSUSchemePhase2++
          }
        });


        $scope.gridOptions1.data.map(function (data, index) {
          //changs Jan 9th 2019
          //console.log($scope.gridOptions1.data)
          //console.log("=============suscheme--=============================>", data.suscheme)
          if (data.suscheme === "phase_1" && data.gender == "Male") {
            $scope.countSUSchemePhase1Male++
          }
        });

        $scope.gridOptions1.data.map(function (data, index) {
          //changs Jan 9th 2019
          //console.log($scope.gridOptions1.data)
          //console.log("=============suscheme--=============================>", data.suscheme)
          if (data.suscheme === "phase_1" && data.gender == "Female") {
            $scope.countSUSchemePhase1Female++
          }
        });


        $scope.gridOptions1.data.map(function (data, index) {
          //changs Jan 9th 2019
          if (data.gender == "Male" && data["suscheme"] === "phase_2") {
            $scope.countSUSchemePhase2Male++
          }
        });

        $scope.gridOptions1.data.map(function (data, index) {
          //changs Jan 9th 2019
          if (data.gender == "Female" && data["suscheme"] === "phase_2") {
            $scope.countSUSchemePhase2Female++
          }
        });


        $scope.gridOptions1.data.map(function (data, index) {
          // changes dec 18 2019
          if ((data.category === "Children below 18" || data.category === "Children below 15") && data.gender === "Male") {
            $scope.countChildrenbelow18Male++
          }
        });

        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category === "Initiated") {
            $scope.totalInitiated++
          }
        });

        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category === "Jigyasu") {
            $scope.totalJigyasu++
          }
        });


        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category === "Children below 18") {
            $scope.totalChildrenn++
          }
        });



        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category === "Other" && data.gender === "Male") {
            $scope.countOtherMale++
          }
        });


        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category === "Other" && data.gender === "Female") {
            $scope.countOtherFemale++
          }
        });


        $scope.gridOptions1.data.map(function (data, index) {
          if (data.category === "Other") {
            $scope.countOtherAll++
          }
        });





        // //console.log("Initiated Female->", $scope.indexInitiatedFemale);
        // //console.log("Initiated Male->", $scope.countInitiatedMale);

        // //console.log("Jigyasu Female->", $scope.countJigyasuFemale);
        // //console.log("Jigyasu Male->", $scope.countJigyasuMale);

        // //console.log("Children below 18 Female->", $scope.countChildrenbelow18Female);
        // //console.log("Children below 18 Male->", $scope.countChildrenbelow18Male);

        // //console.log("Total Jigyasu->", $scope.totalJigyasu);
        // //console.log("Total Children below 18->", $scope.totalChildrenn);
        // //console.log("Total Initiated->", $scope.totalInitiated);

        // for (var i = 0; i < 1000; i++) {
        //   if (document.getElementsByClassName('anim highlight normal')[i] !== undefined || document.getElementsByClassName('anim highlight normal')[i] !== null) {
        //     document.getElementsByClassName('anim highlight normal')[i].style.display = 'none';

        //   }


        // }
        // if(document.getElementsByClassName('anim highlight normal')[0] !== undefined || document.getElementsByClassName('anim highlight normal')[0] !== null)
        // {
        //   document.getElementsByClassName('anim highlight normal')[0].style.display = 'none';

        // }
        // if(document.getElementsByClassName('anim highlight normal')[1] !== undefined || document.getElementsByClassName('anim highlight normal')[1] !== null)
        // {

        //   document.getElementsByClassName('anim highlight normal')[1].style.display = 'none';
        // }


        //console.log("Total->" + $scope.gridOptions1.data.length);

      }

      $scope.clearFiltersTDS = function() {
        $scope.gridApi1.grid.clearAllFilters();
    };


      $scope.gridOptions1.onRegisterApi = function (gridApi) {
        $scope.gridApi1 = gridApi;
       
        setTimeout(function(){
          //console.log("clearFiltersTDS...");
          $scope.clearFiltersTDS();
        },1000);
        $scope.gridApi1.grid.clearAllFilters();


        $scope.gridApi1.core.on.filterChanged($scope, function () {
         
          var columns = $scope.gridApi1.grid.columns;
          // if(columns.length > 0 &&  columns[6].filter !== undefined)
          // {
          //   $rootScope.columnTitle1MarkAtt = columns[6].filter.term;
          //   $rootScope.columnTitle2MarkAtt = columns[3].filter.term;

          // }
   
        });


        $interval(function () {
          $scope.totalItemsMarkAtt.valueNumMarkAtt = $scope.gridApi1.grid.options.totalItems;
        }, 3000);
      };
     
      $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        $scope.gridApi.grid.clearAllFilters();
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
          if ($rootScope.levelOneUserLoggedIn) {
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
          //console.log("row " + JSON.stringify(row.entity))

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
        //console.log("iP   ->" + iP)
        var pos = iP.indexOf("--");
        var strsub = iP.substring(0, pos);
        var frmLclStrg = localStorage.getItem(strsub);

        $scope.immediateBranchCode = localStorage.getItem(frmLclStrg);
        //console.log("bc...   ->" + $scope.immediateBranchCode);

        return frmLclStrg;
      }

      $scope.clearFilters = function () {
        $scope.gridApi.grid.clearAllFilters();
      };

      var gridDiv = document.getElementById("searchTextBox");
      var byNameIp = document.getElementById("searchTextBoxFirstNames");
      var barcodeInptTxtBx = document.getElementById("barcodeInptTxtBx");
      
      byNameIp.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
          // //console.log("**************IS CONTROLSTARTING FROM HERE /N \n  let me know")
          $scope.refreshData($scope.getTheExtractedBranchCode($scope.searchAttendanceGridName));
          $scope.searchAttendanceGridName = "";
        }
      });
      gridDiv.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
          //console.log($scope.searchAttendanceGrid)
          $scope.refreshData($scope.getTheExtractedBranchCode($scope.searchAttendanceGrid));
          $scope.searchAttendanceGrid = "";
        }
      });
      barcodeInptTxtBx.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
          //console.log($scope.searchAttendanceGrid)
          $scope.refreshData($scope.getTheExtractedBranchCode($scope.searchAttendanceGrid));
          $scope.searchAttendanceGrid = "";
        }
      });

      

      $scope.showErrorForActivitySelectionBeingNul = false;
      $scope.dateValue = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();

      $scope.addAttendance = function (id, isSelected, index, indexForRS, branchCode, deps, gender, category, dobyear, age, branch, district, region, scheme) {
        //console.log(scheme, "addAttendance===============>", id, isSelected, index, indexForRS, branchCode, deps, gender, category, dobyear, age, branch, district, region);
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
          //console.log($scope.GridchildData, record, "actual marking attendance now....", record.scheme);
          writeNewPost(0, deps, indexForRS, index, id, $scope.attendanceForThisData, $scope.selectedNameOfActivity, record.branchCode, record.nameSatsangi, record.gender, record.category, record.dobYear, 2020 - record.dobYear, record.branchName, record.districtName, record.regionName, record.suscheme);

          addNewUIDForTodaysDateByBranchCode(0, deps, record.nameSatsangi, indexForRS, index, id, $scope.attendanceForThisData, $scope.selectedNameOfActivity, record.branchCode, record.gender, record.category, record.dobYear, 2020 - record.dobYear, record.branchName, record.districtName, record.regionName, record.suscheme);
          $scope.showTodaysCountPresent = false;
          // $scope.showTodaysCountForCopy();
          $timeout(function () {
            $scope.gridApi.selection.clearSelectedRows();
          }, 700);


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
        // //console.log("filtering changes initialized..");
        //this feature is available only after the grid gets populated with data
        $scope.gridApi.core.on.filterChanged($scope, function () {
          // //console.log("tontanahal...");
          // var columns = $scope.gridApi.grid.columns;
          //      // //console.log(columns)
          //     $rootScope.columnTitle1MarkAtt = columns[6].filter.term;
          //     $rootScope.columnTitle2MarkAtt = columns[3].filter.term;

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
        // console.log("next here...2020-202020202020202020202020-2020-CHANGES", $scope.rowSelectedEntity)
        if ($scope.rowIsSelected) {
          // console.log("202020202020202020202020***", $scope.rowSelectedEntity);
          // //console.log(0,$scope.rowSelectedEntity.deps,$scope.rowSelectedEntity.nameSatsangi,'indexForRS','index',$scope.rowSelectedEntity.id,$scope.attendanceForThisData,$scope.selectedNameOfActivity,$scope.rowSelectedEntity.branchCode);
          // $scope.addAttendance($scope.rowSelectedEntity.uid,true,'indexOfSelectedRec','indexForRS',$scope.rowSelectedEntity.branchCode,$scope.rowSelectedEntity.deps);
          writeNewPost(0, $scope.rowSelectedEntity.deps, 'permanant', 'index', $scope.rowSelectedEntity.uid, $scope.attendanceForThisData, $scope.selectedNameOfActivity, $scope.rowSelectedEntity.branchCode, $scope.rowSelectedEntity.nameSatsangi);
          addNewUIDForTodaysDateByBranchCode(0, $scope.rowSelectedEntity.deps, $scope.rowSelectedEntity.nameSatsangi, 'permanant', 'index', $scope.rowSelectedEntity.uid, $scope.attendanceForThisData, $scope.selectedNameOfActivity, $scope.rowSelectedEntity.branchCode);

          return;
        }

        $scope.generateRefreshSummary();
        // //console.log($scope.searchAttendanceGridName+"button clicked..."+$scope.searchAttendanceGrid)
        // //console.log(localStorage.getItem($scope.searchAttendanceGrid))
        // //console.log(localStorage.getItem(bc)) 
        // //console.log($scope.searchAttendanceGridName)

        // //console.log(localStorage.getItem($scope.searchAttendanceGridName))

        if (localStorage.getItem(bc) != null || localStorage.getItem(bc) != undefined) {
          //console.log("1", localStorage.getItem(bc))
          var branchCode = localStorage.getItem(bc);
        }
        else if (localStorage.getItem($scope.searchAttendanceGrid) != null) {
          //console.log("2")
          var branchCode = localStorage.getItem(localStorage.getItem($scope.searchAttendanceGrid));
        }
        // //console.log(branchCode)
        if ($scope.searchAttendanceGridName != undefined || $scope.searchAttendanceGrid != undefined) {
          $scope.getGridDataObjectForSelection(bc);
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



      // $(document).ready(function () {

      //      $("#hider").hide();
      //      $("#popup_box").hide();

      //      //on click show the hider div and the message
      //      $("#showpopup").click(function () {
      //          $("#hider").fadeIn("slow");
      //          $('#popup_box').fadeIn("slow");
      //      });
      //      //on click hide the message and the
      //      $("#buttonClose").click(function () {

      //          $("#hider").fadeOut("slow");
      //          $('#popup_box').fadeOut("slow");
      //      });

      //      });

      $scope.showTodaysCountForCopy = function () {
        $scope.showTodaysCountPresent = true;
        $scope.loadCountForToday();
        $scope.getAttendance();
        $scope.showCountDialog();
      }

      /*$scope.getDBReference().child("E-Satsang").child("1004").orderByChild("sortDate").on("child_added", function(snapshot) {
        //console.log(snapshot.key);
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



      $scope.closeTemp = function(){
        $scope.showTvEntry.value=!$scope.showTvEntry.value;
      }

    }]);
});
define(["./module"], function (controllers) {
  "use strict";
  controllers.controller("addNewActivityCtrl", [
    "$rootScope",
    "$timeout",
    "$scope",
    function ($rootScope, $timeout, $scope) {
      $rootScope.isNewUserAdded = false;
      $scope.storeSearch=""
      $scope.actvSearch=""
      
      function writeUserData(where, itmName, itmType) {
        if (where == "store") {
          firebase
            .database()
            .ref(where + "/" + itmName)
            .set({
              itemName: itmName,
              itemType: itmType,
            });
        } else {
          firebase
            .database()
            .ref(where + "/" + itmName)
            .set({
              activityName: itmName,
              activityType: itmType,
            });
        }
      }

      
      $scope.addActivity = function () {
        if (
          $scope.message.activityName === "" ||
          $scope.message.activityType === ""
        ) {
          alert("Please enter the required values");
          return;
        } else {
          writeUserData(
            "activities",
            $scope.message.activityName,
            $scope.message.activityType
          );
          $rootScope.isNewActivityAdded = true;
          $scope.alreadyPresent = false;
          var hideNewActivitySuccessNotification = function () {
            $rootScope.isNewActivityAdded = false;
          };
          $timeout(hideNewActivitySuccessNotification, 3000);
        }

        $scope.message.activityName = "";
        $scope.message.activityType = "";
      };

      $rootScope.isNewStoreItemAdded = false;

      $scope.refreshStoreItems = function () {
        setTimeout(() => $scope.getAllItems("store"), 200);
      };

      $scope.refreshActivitieItems = function () {
        setTimeout(() => $scope.getAllItems("activities"), 200);
      };

      $scope.allStoreItems = [];
      $scope.getAllItems = function (type) {
        firebase
          .database()
          .ref(type)
          .once("value", function (snapshot) {
            var data = snapshot.val();
            if (type == "store") {
              $scope.allStoreItems = Object.values(data);
            } else if (type == "activities") {
              $scope.allActivities = Object.values(data);
            }
            $scope.$apply();
          });
      };

      $scope.handleDelete = function (type, item) {
        console.log(type);
        console.log(item);
        let itemType = "";
        if (type == "store") {
          itemType = "itemName";
        } else if (type == "activities") {
          itemType = "activityName";
        }

        firebase.database().ref(type).child(item[itemType]).remove();
        $scope.refreshStoreItems();
        $scope.refreshActivitieItems();
      };

      $scope.addStoreItem = function () {
        if (
          $scope.satsangstore.itemName === "" ||
          $scope.satsangstore.itemType === ""
        ) {
          alert("Please enter the required values");
          return;
        } else {
          writeUserData(
            "store",
            $scope.satsangstore.itemName,
            $scope.satsangstore.itemType
          );
          $rootScope.isNewStoreItemAdded = true;
          $scope.alreadyPresent = false;
          var hideNewStItmSuccessNotification = function () {
            $rootScope.isNewStoreItemAdded = false;
          };
          $timeout(hideNewStItmSuccessNotification, 3000);
          $scope.refreshStoreItems();
        }

        $scope.satsangstore.itemName = "";
        $scope.satsangstore.itemType = "";
      };
    },
  ]);
});

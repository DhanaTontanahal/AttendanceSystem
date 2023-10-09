define(["./module"], function (controllers) {
  "use strict";
  controllers.controller("addNewStoreItemCtrl", [
    "$rootScope",
    "$timeout",
    "$scope",
    "$window",
    "$location",
    function ($rootScope, $timeout, $scope, $window, $location) {
      console.log(" addNewStoreItemCtrl..");

      $rootScope.isNewStoreItemAdded = false;

      function writeUserData(itemName, itemType) {
        firebase
          .database()
          .ref("store/" + itemName)
          .set({
            itemName: itemName,
            itemType: itemType,
          });
          $rootScope.isNewStoreItemAdded = true;
      }

      $scope.addStoreItem = function () {
        if (
          $scope.satsangstore.itemName === "" ||
          $scope.satsangstore.itemType === ""
        ) {
          alert("Please enter the required values");
          return;
        } else {
          writeUserData(
            $scope.satsangstore.itemName,
            $scope.satsangstore.itemType
          );
          $rootScope.isNewActivityAdded = true;
          $scope.alreadyPresent = false;
          var hideNewActivitySuccessNotification = function () {
            $rootScope.isNewActivityAdded = false;
          };
          $timeout(hideNewActivitySuccessNotification, 3000);
        }

        $scope.satsangstore.itemName = "";
        $scope.satsangstore.itemType = "";
      };
    },
  ]);
});

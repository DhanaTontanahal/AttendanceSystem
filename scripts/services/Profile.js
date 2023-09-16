define(['./module'], function (services) {
    'use strict';
    services.service('Profile', [function ($scope,$firebaseObject) {


    	console.log("Profile");
    	return function(username) {
      // create a reference to the database node where we will store our data
      var ref = firebase.database().ref("satsangies").push();
      var profileRef = ref.child(username);

      // return it as a synchronized object
      return $firebaseObject(profileRef);
    }

    }]);
});
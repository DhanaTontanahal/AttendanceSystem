define(['./module'], function (services) {
    'use strict';
    services.service('chatMessages',["$firebaseArray",
  function($firebaseArray){
			var ref = firebase.database().ref("satsangiUsers");
			return $firebaseArray(ref);

    }]);
});


define(['./module'], function (services) {
    'use strict';
    services.service('activitiesService',["$firebaseArray",
  function($firebaseArray){
			var ref = firebase.database().ref("activities");
			return $firebaseArray(ref);

    }]);
});


define(['./module'], function (services) {
  'use strict';
  services.service('activitiesService',["$firebaseArray",
async function(){
    // var ref = firebase.database().ref("activities");
          // return $firebaseArray(ref);
          const eventListFromFirebase = await firebase.database().ref('/activities/').once('value').then((snapshot) => {
              return snapshot.val()
            })
            return Object.keys(eventListFromFirebase);
  }]);
});


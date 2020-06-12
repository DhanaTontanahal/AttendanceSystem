define(['./module'], function (services) {
    'use strict';
    services.service('AttendanceMarked',["$firebaseArray",
  function($firebaseArray){

var ref = firebase.database().ref("satsangiUsers-attendance").child("22-July-2018").child("E-Satsang");
return $firebaseArray(ref);

    }]);
});


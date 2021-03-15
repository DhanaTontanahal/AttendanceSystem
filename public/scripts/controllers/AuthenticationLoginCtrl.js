define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('AuthenticationLoginCtrl',[ '$timeout', 'AuthService','$rootScope','$scope','$window', '$location', function ($timeout,AuthService,$rootScope,$scope,$window,$location) {



console.log("..Au"+AuthService.resolveUser());

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    // document.getElementById("user_div").style.display = "block";
    // document.getElementById("login_div").style.display = "none";

    var user = firebase.auth().currentUser;

    if(user != null){
      $rootScope.signedIn = true;
    	console.log("user is signed in...");
      var email_id = user.email;
      $location.path("/admingrid");
  	$scope.$apply();
  	$timeout(function () {
  		console.log("refreshing page....");
        window.location.reload();
    }, 3000);
      // document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;

    }

  } else {
  	console.log("user not signed in...");
  	
    $rootScope.signedIn = false;
    // No user is signed in.
    // document.getElementById("user_div").style.display = "none";
    // document.getElementById("login_div").style.display = "block";

  }
});

$scope.login = function(){
console.log("logging in..");
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  });

}


    }]);
});
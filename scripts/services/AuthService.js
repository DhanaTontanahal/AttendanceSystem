define(['./module'], function (services) {
    'use strict';
    services.service('AuthService', [function ($scope,$rootScope) {

return {

  isUserLoggedIn : function(){

    
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        
            var user = firebase.auth().currentUser;
              if(user != null){
                return JSON.stringify(user);
              }

              } 
              else {
               return null;
              }
      });
     },
  getuserLoggedIn: function (username,password) 
  {
            
  firebase.auth().signInWithEmailAndPassword(username, password).
 catch(function(error) 
  {
  
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log(errorMessage);
  
  });



},
resolveUser : function()
{


var user = firebase.auth().currentUser;

	if (user) 
	{

console.log("user  logged in--> in auth service resolve user.. if");
    
  	return user;
  	
  } else 
	{
    console.log("user not logged in--> in auth service resolve user.. else"+JSON.stringify(user));
    
	 return user;
	}

},

logOutUser: function () 
{
            
firebase.auth().signOut().then(function() 
{
  return true;
}, function(error) 
{
  return false;
});
}


};

}]);
});
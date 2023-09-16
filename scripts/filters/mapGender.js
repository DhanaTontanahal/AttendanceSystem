define(['./module'], function (filters) {
    'use strict';
    filters.filter('mapGender', function(){


  var genderHash = {
		    1: 'Male',
		    2: 'Female'
		  };

  return function(input) {
  	if (!input){
      return '';
    } else {
      return genderHash[input];
    }
  };

});
});



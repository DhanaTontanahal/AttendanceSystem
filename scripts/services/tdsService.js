define(['./module'], function (services) {
    'use strict';
    services.service('tdsService', [function ($scope) {

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
  
    }]);
});
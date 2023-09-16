
define(['./module'] , function (services) {

services.factory('sessionStorageService' , ['$scope', '$window' , '$rootScope' , '$http' , '$q'  , 'appConstants', function($scope ,$window, $rootScope,$http  , $q , appConstants) {

    var store = $window.sessionStorage;


    var add = function(key , value)
    {
    	var value = value.toJson(value);
    	store.setItem(key,value);

    };

    var get = function(key)
    {
    	var value = store.getItem(key);
    	if(value)
    	{
    		var value = value.fromJson(value);
    	}
    	return value;
    };

    var remove = function(key)
    {
    	store.reomoveItem(key);

    };

return
{
	add:add,
	get:get,
	remove:remove
}


}]);

});
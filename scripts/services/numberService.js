
define(['./module'] , function (services) {

services.factory('numberService' , ['$rootScope' , '$http' , '$q'  , 'appConstants', function($rootScope,$http  , $q , appConstants) {
console.log(appConstants.base_url);

var base_url = appConstants.base_url;


return {
        getServiceData: function () {
            $rootScope.loading = true;
            var req = {
                method: 'GET',
                url: base_url+'patients'
            };

            return $http(req).then(function (result) {
                // alert("data in service = " + JSON.stringify(result.data));
                return result.data;
            });
        },
    


        getPatientDataForId: function (patientId) {
            $rootScope.loading = true;
            var req = {
                method: 'GET',
                url: base_url+'patients'+'/'+patientId
            };

            return $http(req).then(function (result) {
                 // alert("data in service = " + JSON.stringify(result.data));
                return result.data;
            });
        },

upDateDataToServer: function (patientId , body) {
            $rootScope.loading = true;
            var req = {
                method: 'PUT',
                data : body ,
                url: base_url+'patients'+'/update/'+patientId
            };

            return $http(req).then(function (result) {
                 // alert("data in service = " + JSON.stringify(result.data));
                return result.data;
            });
        },


createDataToServer : function (body) {
            $rootScope.loading = true;
            var req = {
                method: 'POST',
                data : body ,
                url: base_url+'patients'+'/create'
            };

            return $http(req).then(function (result) {
                 // alert("data in service = " + JSON.stringify(result.data));
                return result.data;
            });
        },

getRandomNumber:function(){

function random(min, max, length) {    
    var numbers = [];
    
    function _random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    Array.apply(null, new Array(length)).reduce(function(previous) {
        var nextRandom;
        
        if(previous === min) {
            nextRandom = _random(min + 1, max);
        } else if(previous === max) {
            nextRandom = _random(min, max - 1);
        } else {
            if(_random(0, 1)) {
                nextRandom = _random(previous + 1, max);                
            } else {
                nextRandom = _random(min, previous - 1);            
            }
        }
        
        numbers.push(nextRandom);
        return nextRandom;
    }, _random(min, max));
    
    return numbers;
}
 // console.log(random(0, 100000, 10));
return random(0, 100000, 10)[0];

},
        getMaxIdFromNewPatient : function (body) {
            $rootScope.loading = true;
            var req = {
                method: 'GET',
                url: base_url+'patients'+'/getMaxId'
            };

            return $http(req).then(function (result) {
                 // alert("data in service = " + JSON.stringify(result.data));
                return result.data;
            });
        }








};



}]);

});
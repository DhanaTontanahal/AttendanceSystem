define(['angular','app'], function (app) {

	app.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions(
    // {
    //   //animation: false,
    //   //responsive: false
    // }
{ colors : ['#949FB1', '#4D5360'] }

    );
  }])

   // app.run(function(){



    
   // });


});
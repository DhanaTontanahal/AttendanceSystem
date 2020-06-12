require.config({

  // alias libraries paths


    paths: {
        'domReady': '../lib/requirejs-domready/domReady',
        'angular': '../lib/angular/angular',
        'angular-messages':'../lib/angular-messages/angular-messages',
        'firebase':'../lib/firebase/firebase',
        'angular-route':'../lib/angular-route/angular-route',
        'ui-grid':'../lib/angular-ui-grid/ui-grid',
        'angular-touch':'../lib/angular-touch/angular-touch',
        'angular-resource':'../lib/angular-resource/angular-resource',
        'jquery':'../lib/jquery/dist/jquery',

        'ui-bootstrap':'../lib/angular-ui-bootstrap/ui-bootstrap-tpls',

         'spin':'../lib/angular-spinner/spin',

        'angular-spinner':'../lib/angular-spinner/angular-spinner',
        'angular-animate':'../lib/angular-animate/angular-animate',
        'angular-toArrayFilter':'../lib/angular-toarrayfilter/toArrayFilter',

        // 'ng-dialog':'../lib/ng-dialog/js/ngDialog',
        'angular-print':'../lib/angular-print/angularPrint'///just give the location of the angular-print


    },

    // angular does not support AMD out of the box, put it in a shim
    shim: {
        'angular': {
            exports: 'angular'
        },

        'angular-messages': {

            exports : 'ngMessages',
            deps: ['angular']
        },

        'firebase': {
            exports: 'firebase'
        },
        'angular-route':
        {
            exports : 'ngRoute',
            deps: ['angular']
        },
        'ui-grid':
        {
        
            deps: ['angular']
        },
        'angular-touch':
        {
            exports : 'ngTouch',
            deps : ['angular']
        },
        'angular-resource':
        {
            exports : 'ngResource'
        

        },
        'ui-bootstrap':
        {
            deps : ['angular']
        },
        
         'angular-spinner':
         {
             deps : ['angular']
         },
         'angular-animate':
         {
            deps: ['angular']
         },
        /*'ng-dialog':
        {
            deps : ['angular']
        },*/
        'angular-print':
        {
            deps:['angular']   //shim the angular-print : give the dependencies..!! 
        },
        'angular-toArrayFilter':
        {
            deps:['angular'] 
        }
    },

    // kick start application
    deps: ['./bootstrap']
});
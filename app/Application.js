//JavaScript////////////////////////////////////////////////////////////////////
// 
// Copyright 2012 
// 
////////////////////////////////////////////////////////////////////////////////

/**
 * Application Bootstrapper
 * 
 * @langversion JavaScript
 * 
 * @author 
 * @since  
 */
Application = {

    //--------------------------------------
    //+ PUBLIC PROPERTIES / CONSTANTS
    //--------------------------------------

    //--------------------------------------
    //+ INHERITED / OVERRIDES
    //--------------------------------------

    initialize: function() {

        // Import views
        // var ApplicationRouter = require('routers/ApplicationRouter');
        // var LinesView = require('views/LinesView');
        // var Lines = require('collections/Lines');        
        // var DirectionsView = require('views/DirectionsView');
        // var Directions = require('collections/Directions');
        // var Stations = require('collections/Stations');
        // var Busses = require('collections/Busses');
        // var MapElements = require('models/MapElements');
        // var MapView = require('views/MapView');
        // var MainView = require('views/MainView');
        // var LegendView = require('views/LegendView');
        var Me = require('models/Me')
        var MeView = require('views/MeView')
        // linee.add([{nome: '170'},
        //            {nome: '766'},
        //            {nome: '23'}]);
        // linee.add([{nome: '43'}])

        // Initialize views
        // this.homeView = new HomeView();
        // this.applicationRouter = new ApplicationRouter();
        // router = this.applicationRouter
        
        var me = new Me()
        var meView = new MeView({model:me})

        if (typeof Object.freeze === 'function') Object.freeze(this);

        // me.fetch()
    }
}

module.exports = Application;

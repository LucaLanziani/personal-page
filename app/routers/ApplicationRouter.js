/**
 * Backbone Primary Router
 * 
 * @langversion JavaScript
 * 
 * @author 
 * @since  
 */

var Router = require('core/Router');
var application = require('Application');

var filter_collection = function (collection, to_filter){ 
    to_filter = to_filter || ""
    json_lines = to_filter.split('-')
    collection.each(function(model) {
        if (_.contains(json_lines, model.id)) {
            model.set({'checked': true}, {'silent': true});
        }
    })
    collection.trigger("change")
}

var interval;

ApplicationRouter = Router.extend({

    //--------------------------------------
        //+ Routes
        //--------------------------------------
        
        routes: {
            '': 'home',
            'getstations/:directions': 'loadOnlyStations',
            'getdirections/:lines': 'loadOnlyDirections',
            'lines': 'loadLines',
            'lines/': 'loadLines',
            'lines/:lines' : 'loadLines',
            'lines/:lines/' : 'loadLines',

            'lines/:lines/directions' : 'loadDirections',
            'lines/:lines/directions/' : 'loadDirections',
            'lines/:lines/directions/:directions' : 'loadDirections',
            'lines/:lines/directions/:directions/' : 'loadDirections',
            
            'lines/:lines/directions/:directions/stations' : 'loadMap'

        },

        //--------------------------------------
        //+ Route Handlers
        //--------------------------------------

        home: function() {
            application.lines.fetch({
                success: function(collection) {
                    collection.setUrl(false, "", Backbone.history.fragment)
                }
            });
        },

        loadLines: function(lines) {
            application.lines.fetch({
                success: function(collection){
                    filter_collection(collection,lines)
                }
            })
        },

        loadDirections: function(lines, directions) {

            application.lines.fetch({
                success:function (collection) {
                    filter_collection(collection, lines)
                    application.directions.fetch({
                        data: {"lines":lines},
                        success: function(collection) {
                            collection.setUrl(false, "", Backbone.history.fragment);
                            if (directions) {
                                filter_collection(collection, directions);
                            }
                        },
                        error: function () {
                            console.log("Fail")
                        }
                    })
                }
            })
        },

        loadMap: function(lines, directions) {
            application.lines.fetch({
                success:function (collection) {
                    filter_collection(collection, lines)
                    application.directions.fetch({
                        data: {"lines":lines},
                        success: function(collection) {
                            console.log(Backbone.history.fragment)
                            collection.setUrl(false, "", Backbone.history.fragment);
                            console.log(directions)
                            if (directions) {
                                filter_collection(collection, directions);
                            }
                            application.stations.fetch({
                                data:{"directions":directions},
                                success: function(collection) {
                                    application.main_view.showLegend(application.directions);
                                    collection.setUrl(false, "", Backbone.history.fragment);
                                }
                            })
                            application.busses.fetch({data: {"directions": directions}})
                            interval = setInterval( function() {
                                                 application.busses.fetch({data: {"directions": directions}})
                                                },
                                                2000);
                        },
                        error: function () {
                            console.log("Fail")
                        }
                    })
                }
            })
        },

        loadOnlyDirections: function(lines) {
            var fragment = ["lines", application.lines.parseSelected()]
            var fragment = fragment.join("/")
            application.directions.fetch({
                data: {"lines": lines},
                success: function (collection) {
                    collection.setUrl(false, "", fragment);
                }
            })
        },

        loadOnlyStations: function(directions) {
            application.stations.fetch({
                data: {"directions": directions},
                succes: function() {
                    application.main_view.showLegend(application.directions);
                },
            })

            clearInterval(interval);
            interval = setInterval( function() {
                    application.busses.fetch({data:{"directions": directions}})
                },
                2000);
        }
});

module.exports = ApplicationRouter;
(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"Application": function(exports, require, module) {
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
  
}});

window.require.define({"collections/Busses": function(exports, require, module) {
  var Collection = require('core/Collection');
  var Bus = require('models/Bus');

  var Busses = Collection.extend({
      
      model: Bus,
      
      url: '/busses',
      
      initialize: function() {
          this.prefix = '';
      },
      
      setUrl: function(trigger, tail, head) {
          if (head)
              this.prefix = head

          router.navigate(this.prefix + this.url, {trigger: trigger})
               
      }

  });

  module.exports = Busses;
}});

window.require.define({"collections/Directions": function(exports, require, module) {
  var Collection = require('core/Collection');
  var Direction = require('models/Direction');

  var Directions = Collection.extend({
      
      model: Direction,
      url: '/directions',
      
      initialize: function() {
          this.on("change", this.setSelectedOnUrl);
          this.prefix = '';
      },
      parseSelected : function() {
          var selected = this.filter(function(direction) {return direction.get("checked")});
          var directions = _.map(selected, function(direction) {return direction.get("id")})
          return directions.join("-")
      },
      
      setSelectedOnUrl: function() {
          this.setUrl(false)
      },

     setUrl: function(trigger, tail, head) {
          if (head)
              this.prefix = head

          var selected = this.parseSelected()

          if (selected.length > 0) {
              var url = [this.prefix + this.url, selected]
              if (tail) {
                  url.push(tail)
              }
              console.log("DIRECTIONS: " + url)
              router.navigate(url.join('/'), {trigger: trigger})    
          } else {
              router.navigate(this.prefix + this.url, {trigger: trigger})
          }   
      },

      goToStation: function() {
          var url = ["getstations", this.parseSelected()]
          router.navigate(url.join('/'), {trigger: true, replace:true})
          this.setUrl(false, "stations")
      }
  });

  module.exports = Directions;
}});

window.require.define({"collections/Lines": function(exports, require, module) {
  var Collection = require('core/Collection');
  var Line = require('models/Line');

  var Lines = Collection.extend({
      model: Line,
      url: '/lines',
      initialize: function() {
          this.on("change", this.setLines)
      },
      parseSelected: function() {
          var selected = this.filter(function(linea) {return linea.get("checked")});
          var lines = _.map(selected, function(linea) {return linea.get("number")})
          return lines.join("-")
      },
      setLines: function() {
          this.setUrl(false)

      },
      getSelected : function() {
          this.setUrl(true, "directions")
      },
      
      setUrl: function(trigger, tail, head) {
          
          if (!this.prefix) {
              this.prefix = head || ''
          }
          
          var selected = this.parseSelected()
          console.log(selected)

          if (selected.length > 0) {
              
              var url = [this.prefix + this.url, selected]
              
              if (tail) {
                  url.push(tail)
              }
              console.log(url)

              router.navigate(url.join('/'), {trigger: trigger})
                  
          } else {
              router.navigate(this.prefix + this.url, {trigger: trigger})
          }
          
      },

      goToDirections: function() {
          var url = ["getdirections", this.parseSelected()]
          console.log(url)
          router.navigate(url.join('/'), {trigger: true, replace:true})
          this.setUrl(false, "directions")
      }

  });

  module.exports = Lines;
}});

window.require.define({"collections/Stations": function(exports, require, module) {
  var Collection = require('core/Collection');
  var Station = require('models/Station');

  var Stations = Collection.extend({
      model: Station,
      url: '/stations',
      initialize: function() {
          this.prefix = '';
      },
      setUrl: function(trigger, tail, head) {
          if (head)
              this.prefix = head

          router.navigate(this.prefix + this.url, {trigger: trigger})
               
      }

  });

  module.exports = Stations;
}});

window.require.define({"config/ApplicationConfig": function(exports, require, module) {
  /**
   * Application Configuration
   * 
   * @langversion JavaScript
   * 
   * @author 
   * @since  
   */

  var ApplicationConfig = (function() {

  	/*
     	 * @private
  	 */
  	var _baseUrl = "/";

  	/*
     	 * Public interface
  	 */
  	return {
  		BASE_URL: _baseUrl
  	}

  }).call()

  module.exports = ApplicationConfig;
}});

window.require.define({"core/Collection": function(exports, require, module) {
  /**
   * Base Class for all Backbone Collections
   * 
   * @langversion JavaScript
   * 
   * @author 
   * @since  
   */

  Collection = Backbone.Collection.extend({

  	//--------------------------------------
  	//+ PUBLIC PROPERTIES / CONSTANTS
  	//--------------------------------------

  	//--------------------------------------
  	//+ INHERITED / OVERRIDES
  	//--------------------------------------
  	
  	//--------------------------------------
    	//+ PUBLIC METHODS / GETTERS / SETTERS
    	//--------------------------------------

    	//--------------------------------------
    	//+ EVENT HANDLERS
    	//--------------------------------------

    	//--------------------------------------
    	//+ PRIVATE AND PROTECTED METHODS
    	//--------------------------------------

  });

  module.exports = Collection;
}});

window.require.define({"core/Model": function(exports, require, module) {
  /**
   * Base Class for all Backbone Models
   * 
   * @langversion JavaScript
   * 
   * @author 
   * @since  
   */

  Model = Backbone.Model.extend({

  	//--------------------------------------
  	//+ PUBLIC PROPERTIES / CONSTANTS
  	//--------------------------------------

  	//--------------------------------------
  	//+ INHERITED / OVERRIDES
  	//--------------------------------------
  	
  	//--------------------------------------
    	//+ PUBLIC METHODS / GETTERS / SETTERS
    	//--------------------------------------

    	//--------------------------------------
    	//+ EVENT HANDLERS
    	//--------------------------------------

    	//--------------------------------------
    	//+ PRIVATE AND PROTECTED METHODS
    	//--------------------------------------
    
  });

  module.exports = Model;
  
}});

window.require.define({"core/Router": function(exports, require, module) {
  /**
   * Backbone Primary Router
   * 
   * @langversion JavaScript
   * 
   * @author 
   * @since  
   */

  Router = Backbone.Router.extend({

  	//--------------------------------------
      //+ INHERITED / OVERRIDES
      //--------------------------------------
      
  	routes: {},

      /**
       * Initializes the Base router
       * @param  {Object} options 
       * 
       */
      initialize: function( options ) {

      }
  });

  module.exports = Router;
}});

window.require.define({"core/View": function(exports, require, module) {
  /**
   * View Base Class
   * 
   * @langversion JavaScript
   * 
   * @author 
   * @since  
   */

  require('helpers/ViewHelper');

  View = Backbone.View.extend({

    //--------------------------------------
    //+ PUBLIC PROPERTIES / CONSTANTS
    //--------------------------------------

    /*
     * @private
     */
    template: function() {},
    /*
     * @private
     */
    getRenderData: function() {},

    //--------------------------------------
    //+ INHERITED / OVERRIDES
    //--------------------------------------
    
    /*
     * @private
     */
    initialize: function() {
      this.render = _.bind(this.render, this);
    },

    /*
     * @private
     */
    render: function() {
      this.$el.html( this.template( this.getRenderData() ) );
      this.afterRender();
      
      return this;
    },

    /*
     * @private
     */
    afterRender: function() {}

    //--------------------------------------
    //+ PUBLIC METHODS / GETTERS / SETTERS
    //--------------------------------------

    //--------------------------------------
    //+ EVENT HANDLERS
    //--------------------------------------

    //--------------------------------------
    //+ PRIVATE AND PROTECTED METHODS
    //--------------------------------------

  });

  module.exports = View;
  
}});

window.require.define({"events/ApplicationEvents": function(exports, require, module) {
  /**
   * Application Events
   * 
   * @langversion JavaScript
   * 
   * @author 
   * @since  
   */

  var ApplicationEvents = (function() {

  	/*
     	 * @private
  	 */
  	var _applicationInitialized = "onApplicationInitialized";

  	/*
     	 * Public interface
  	 */
  	return {
  		APPLICATION_INITIALIZED: _applicationInitialized
  	}
  	
  }).call();

  module.exports = ApplicationConfig;
}});

window.require.define({"helpers/ViewHelper": function(exports, require, module) {
  /**
   * Handlebars Template Helpers
   * 
   * @langversion JavaScript
   * 
   * @author 
   * @since  
   */


  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  /*
  * @return String
  */
  Handlebars.registerHelper( 'link', function( text, url ) {

    text = Handlebars.Utils.escapeExpression( text );
    url  = Handlebars.Utils.escapeExpression( url );

    var result = '<a href="' + url + '">' + text + '</a>';

    return new Handlebars.SafeString( result );
  });
  
}});

window.require.define({"initialize": function(exports, require, module) {
  
  /**
   * Application Initializer
   * 
   * @langversion JavaScript
   * 
   * @author 
   * @since  
   */

  application = require('Application');

  $(function() {

  	// Initialize Application
  	application.initialize();

  	// Start Backbone router
    	// Backbone.history.start();
  });
  
}});

window.require.define({"models/Me": function(exports, require, module) {
  var Model = require('core/Model');

  var Me = Model.extend({
      urlRoot: 'json/',
      id: 'me.json',
      parse: function(resp) {
        return resp;
      }
  })

  module.exports = Me
}});

window.require.define({"routers/ApplicationRouter": function(exports, require, module) {
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
}});

window.require.define({"utils/BackboneView": function(exports, require, module) {
  /**
   * View Description
   * 
   * @langversion JavaScript
   * 
   * @author 
   * @since  
   */

  var View     = require('core/View');
  var template = require('templates/HomeViewTemplate');

  BackboneView = View.extend({

  	//--------------------------------------
  	//+ PUBLIC PROPERTIES / CONSTANTS
  	//--------------------------------------

    	/*
     	 * @private
  	 */
  	id: 'view',
  	/*
     	 * @private
     	*/
  	template: template,

  	//--------------------------------------
    	//+ INHERITED / OVERRIDES
    	//--------------------------------------

  	/*
  	 * @private
  	 */
  	initialize: function() {
  		this.render = _.bind( this.render, this );
  	},

  	/*
  	 * @private
  	 */
  	render: function() {
  		this.$el.html( this.template( this.getRenderData() ) );

  		return this;
  	},

  	/*
  	 * @private
  	 */
  	getRenderData: function() {
  		return {
  			content: "View Content"
  		}
  	}

  	//--------------------------------------
  	//+ PUBLIC METHODS / GETTERS / SETTERS
  	//--------------------------------------

  	//--------------------------------------
  	//+ EVENT HANDLERS
  	//--------------------------------------

  	//--------------------------------------
  	//+ PRIVATE AND PROTECTED METHODS
  	//--------------------------------------

  });

  module.exports = BackboneView;
}});

window.require.define({"views/MeView": function(exports, require, module) {
  var View = require('core/View')
  var template = require('templates/MeTemplate')

  var MeView = View.extend({
      el: $('#MyDesc'),
      
      template: template,

      initialize: function() {
        _.bindAll(this, 'render')
        this.model.on('change', this.render)
      },
    
      render: function () {
        this.$el.empty();

        var attr = this.model.attributes
          , data = {
              desc:JSON.stringify(attr.desc, null, 4)
            }
          ;
      
        this.$el.html(this.template(data));
      }
  });

  module.exports = MeView
  
}});


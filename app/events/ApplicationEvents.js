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
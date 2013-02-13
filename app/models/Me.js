var Model = require('core/Model');

var Me = Model.extend({
    urlRoot: 'json/',
    id: 'me.json',
    parse: function(resp) {
      return resp;
    }
})

module.exports = Me
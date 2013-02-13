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
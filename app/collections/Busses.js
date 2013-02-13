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
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
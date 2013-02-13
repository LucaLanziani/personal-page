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
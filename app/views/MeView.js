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

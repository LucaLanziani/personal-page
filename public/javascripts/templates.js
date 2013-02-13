window.require.define({"templates/MeTemplate": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression;


    buffer += "<p class=\"text-info\" style=\"white-space: pre;\"> \n<strong>";
    foundHelper = helpers.desc;
    if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
    else { stack1 = depth0.desc; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
    buffer += escapeExpression(stack1) + "</strong>\n</p>\n";
    return buffer;});
}});


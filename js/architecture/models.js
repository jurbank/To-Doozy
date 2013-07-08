var App = { Models: {}, Collections: {}, Views: {} };

(function() {
  'use strict';

  window.template = function(id) {
    return _.template( $('#' + id).html() );
  };

  App.Models.Task = Backbone.Model.extend({
    validate: function(attrs) {
      if ( ! $.trim(attrs.title) ) {
        return 'A task requires a valid title.';
      }
    }
  });
})();
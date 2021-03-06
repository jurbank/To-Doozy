var App = App;

(function () {
  'use strict';

  App.Collections.Tasks = Backbone.Collection.extend({
    model: App.Models.Task,

    localStorage: new Store('todos-backbone'),

    comparator: function(model) {
      return model.get('priority');
    }
  });

  App.tasksCollection = new App.Collections.Tasks();

})();


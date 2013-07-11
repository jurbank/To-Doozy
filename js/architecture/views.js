/* global Backbone, jQuery, template */
var App = App;

(function ($) {
  'use strict';


  // ------------------------------------
  //
  //    ROOT TASK ELEMENT
  //
  // ------------------------------------


  App.Views.Tasks = Backbone.View.extend({
    tagName: 'ul',

    initialize: function() {
      this.collection.on('add', this.addOne, this);
      this.$el.sortable();
    },

    render: function() {
      this.collection.each(this.addOne, this);
      return this;
    },

    addOne: function(task) {
      var taskView = new App.Views.Task({ model: task });
      this.$el.append(taskView.render().el);
    }
  });


  // ------------------------------------
  //
  //    SINGLE TASK ELEMENT
  //
  // ------------------------------------


  App.Views.Task = Backbone.View.extend({
    tagName: 'li',

    template: template('taskTemplate'),

    initialize: function() {
      this.model.on('change', this.render, this);
      this.model.on('destroy', this.remove, this);
    },

    render: function() {
      var template = this.template( this.model.toJSON() );
      this.$el.html(template);
      this.$input = this.$('.edit');
      return this;
    },

    events: {
      'click': 'preventDefault',
      'dblclick': 'edit',
      'click .delete': 'destroy',
      'keypress .edit': 'updateOnEnter',
      'blur .edit': 'close'
    },

    edit: function() {
      this.$el.addClass('editing');

      // required for the close function to work properly
      this.$input.focus();
    },

    // prevent default and allow keyboard to edit
    preventDefault: function(e) {
      e.preventDefault();
      this.edit();
    },

    close: function () {
      var value = this.$input.val().trim();

      if (value) {
        this.model.save({ title: value });
      } else {
        this.destroy();
      }

      this.$el.removeClass('editing');
    },

    destroy: function() {
      this.model.destroy();
    },

    updateOnEnter: function (e) {
      if (e.which === 13) {
        this.close();
      }
    },

    remove: function() {
      this.$el.remove();
    }
  });


  // ------------------------------------
  //
  //    ADD TASK
  //
  // ------------------------------------


  App.Views.AddTask = Backbone.View.extend({
    el: '#addTask',

    events: {
      'submit': 'submit'
    },

    submit: function(e) {
      e.preventDefault();
      this.pushTask(e);
    },

    pushTask: function(e) {
      var newTaskTitle = $(e.currentTarget).find('input[type=text]').val();
      App.tasksCollection.add({ title: newTaskTitle });
    }
  });
})(jQuery);

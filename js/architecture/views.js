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

    events: {
      'updateSort': 'updateSort'
    },

    initialize: function() {
      var sortableIn = false;

      this.collection.on('add', this.addOne, this);
      this.$el.sortable({
        opacity: 0.95,

        stop: function(e, ui) {
          ui.item.trigger('over', ui.item.index());
          ui.item.trigger('sortPriority', ui.item.index());
        },

        receive: function(e, ui) {
          sortableIn = true;
        },

        over: function(e, ui) {
          sortableIn = true;
          ui.item.trigger('over', ui.item.index());
        },

        out: function(e, ui) {
          sortableIn = false;
          ui.item.trigger('out', ui.item.index());
        },

        beforeStop: function(e, ui) {
           if (sortableIn === false) {
              ui.item.trigger('destroyOnDrop', ui.item.index());
           }
        }
      });

      App.tasksCollection.fetch();
    },

    render: function() {
      this.$el.children().remove();
      this.collection.each(this.addOne, this);
      return this;
    },

    updateSort: function(e, model, position) {
      this.collection.remove(model);

      this.collection.each(function (model, index) {

          var priority = index;
          if (index >= position)
              priority += 1;
          model.set('priority', priority);
          model.save();
      });            

      model.set('priority', position);

      this.collection.add(model, {at: position});
      model.save();

      this.render();
    },    

    addOne: function(task) {
      var taskView = new App.Views.Task({ model: task });
      this.$el.append(taskView.render().el);
    },

    destroy: function() {
      this.model.destroy();
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
      this.$el.toggleClass( 'is-complete', this.model.get('completed') );
      return this;
    },

    events: {
      'sortPriority': 'sortPriority',
      'destroyOnDrop': 'destroy',
      'out': 'out',
      'over': 'over',
      'click': 'toggleComplete',
      'dblclick': 'edit',
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

      this.$el.toggleClass('is-complete');
    },

    toggleComplete: function() {
      this.model.toggle();
    },

    sortPriority: function(e, index) {
      this.$el.trigger('updateSort', [this.model, index]);
    },

    close: function () {
      var value = this.$input.val().trim();

      if (value) {
        this.model.save({ title: value });
      } else {
        this.model.destroy();
      }

      this.$el.removeClass('editing');
    },

    destroyOnDrop: function() {
      this.model.destroy();
    },

    out: function() {
      this.$el.attr('id', 'is-out');
    },

    over: function() {
      this.$el.attr('id', 'is-over');
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
      'submit': 'submit',
    },

    newAttributes: function() {
      return {
        title: "pop",
        complete: false
      };
    },

    submit: function(e) {
      e.preventDefault();

      this.pushTask(e);
    },

    pushTask: function(e) {
      var taskInput = $(e.currentTarget).find('input[type=text]');
      var newTaskTitle = taskInput.val();
      App.tasksCollection.create({ title: newTaskTitle });

      taskInput.val("");
    }
  });


  // ------------------------------------
  //
  //    TASK INPUT
  //
  // ------------------------------------


  App.Views.WatchInput = Backbone.View.extend({

    el: '#name',

    initialize: function() {
      this.render();
    },

    render: function() {
      $('#submit').addClass('disabled');
    },

    events: {
      'keyup': 'trackInput'
    },

    trackInput: function() {
      var taskInput = this.$el,
          inputVal = taskInput.val().trim(),
          $submit = $('#submit');

      if (! inputVal) {
        $submit.addClass('disabled');
        $submit.removeClass('enabled');

      } else {
        $submit.addClass('enabled');
        $submit.removeClass('disabled');
      }
    }
  });

})(jQuery);

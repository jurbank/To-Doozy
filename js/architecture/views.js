/* global Backbone, jQuery, template */
var App = App;

(function ($) {
  'use strict'


  // ------------------------------------
  //
  //    ROOT TASK ELEMENT
  //
  // ------------------------------------


  App.Views.Tasks = Backbone.View.extend({
    tagName: 'ul',

    initialize: function() {
      var sortableIn = false;

      this.collection.on('add', this.addOne, this);
      this.$el.sortable({
        opacity: 0.95,
        
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
           if (sortableIn == false) {

              // destroy model on drop
              ui.item.trigger('drop', ui.item.index());
           }
        }
      });

      App.tasksCollection.fetch();
    },

    destroy: function() {
      this.model.destroy();
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
      'drop': 'destroy',
      'out': 'out',
      'over': 'over',
      'click': 'preventDefault',
      'dblclick': 'edit',
      // 'click .delete': 'destroy',
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

      this.$el.toggleClass('strike');
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

    drop: function() {
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
      // 'blur #name': 'trackInput'
    },

    newAttributes: function() {
      return {
        title: "pop",
        complete: false
      };
    },    

    submit: function(e) {
      e.preventDefault();

      //do I need this?
      this.pushTask(e);

      // App.tasksCollection.create( this.newAttributes() );
      // $('input[type="text"]').val('');         
    },

    pushTask: function(e) {
      var taskInput = $(e.currentTarget).find('input[type=text]');
      var newTaskTitle = taskInput.val();
      // App.tasksCollection.add({ title: newTaskTitle });
      App.tasksCollection.create({ title: newTaskTitle });
      
      taskInput.val("")
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

    // grey on initial load
    render: function() {
      $('#submit').addClass('disabled')
    },

    events: {
      'keyup': 'trackInput'
    },

    trackInput: function() {
      var taskInput = this.$el,
          inputVal = taskInput.val().trim(),
          $submit = $('#submit');

      if (! inputVal) {
        $submit.addClass('disabled')
        $submit.removeClass('enabled')

      } else {
        $submit.addClass('enabled')
        $submit.removeClass('disabled')
      }
    }
  });

})(jQuery);

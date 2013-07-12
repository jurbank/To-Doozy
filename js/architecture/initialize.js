var App = App;

$(document).ready(function () {
  'use strict';

  var watchInputView = new App.Views.WatchInput();
  var addTaskView = new App.Views.AddTask();
  var tasksView = new App.Views.Tasks({ collection: App.tasksCollection });

  $('.tasks').html(tasksView.render().el);
});



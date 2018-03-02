const config = require("../config");
const hash = config.vars.hash;
const adminpasstoken = config.vars.adminpasstoken;
'use strict';

module.exports = function(app) {
  var todoList = require('../controllers/todoListController');
  var favorites = require('../controllers/favoritesController');
  var controls = require('../controllers/controlsController');

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  

  const authUsers = { //This is tiny array for logged sessions
    
  }

  app.route(`/${adminpasstoken}`).get(function (req, res) { 
    res.sendFile(__dirname + '/admin.html'); 
   });
  //get
  app.route(`/messages${hash}`).get(todoList.list_all_tasks).post(todoList.create_a_task).delete(todoList.delete_all_tasks);
  app.route(`/newest${hash}`).get(todoList.find_newest_task);
  app.route(`/count${hash}`).get(todoList.countMessagesInDb);
  app.route(`/delete${hash}`).get(todoList.delete_all_tasks);
  // app.route(`/delete${hash}`).get(todoList.delete_all_tasks(authUsers));
  
  // app.route(`/tasks${hash}/:taskId`).get(todoList.read_a_task).put(todoList.update_a_task).delete(todoList.delete_a_task);
  
  //insert
  app.route(`/all${hash}`).get(todoList.fetchAllMessagesToDb);
  app.route(`/latest${hash}`).get(todoList.fetchLatestMessagesToDb);

  //controls
  app.route(`/start${hash}`).post(controls.startInterval_fetchLatestMessagesToDb);
  app.route(`/stop${hash}`).get(controls.stopInterval_fetchLatestMessagesToDb);
  app.route(`/timer${hash}`).get(controls.getIntervalId);

  //render
  app.route(`/finishedByTasks${hash}`).get(todoList.getFinishedTaskMessagesForTimeline);
  app.route(`/finishedByStudents${hash}`).get(todoList.getFinishedTaskMessagesByStudents);
  app.route(`/authors${hash}`).get(todoList.countAuthorsInDb);
  app.route(`/learners${hash}`).get(todoList.getLearners);
  app.route(`/activity${hash}`).get(todoList.getMessagesCountByEachDay);
  app.route(`/byDay${hash}`).get(todoList.countMessagesByDay);
  app.route(`/perdate${hash}`).post(todoList.countMessagesPerDate);
  app.route(`/search${hash}`).post(todoList.globalSearch);
  app.route(`/searchUsername${hash}`).post(todoList.usernameSearch);
  app.route(`/peruser${hash}`).get(todoList.countMessagesPerUser);
  
  app.route(`/findbyId${hash}`).post(todoList.findMessageById);
  app.route(`/saveToFavorites${hash}`).post(todoList.saveMessageToFavorites);

  app.route(`/favListAll${hash}`).get(favorites.listAllFavoriteMessages);
  app.route(`/favDelAll${hash}`).get(favorites.deleteAllFavoriteMessages);
  app.route(`/favgetByCred${hash}`).post(favorites.getFavoritesByCredentials);
  app.route(`/favDelOneFromList${hash}`).post(favorites.deleteMessageFromFavorites);
  app.route(`/favCheckDone${hash}`).post(favorites.checkFavoriteMessageAsDone);
};

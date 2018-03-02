const api        = require('./gitter-api');
const fetch      = require("node-fetch");
const mongoose   = require('mongoose');
const Task       = require('../models/todoListModel');
mongoose.Promise = global.Promise;

const buildMessage = (message) => {
  return {
    messageId: message.id, 
    text: message.text, 
    html: message.html, 
    sent: message.sent, 
    userId: message.fromUser.id, 
    username: message.fromUser.username, 
    displayName: message.fromUser.displayName, 
    url: message.fromUser.url,
    avatarUrl: message.fromUser.avatarUrl, 
    avatarUrlSmall: message.fromUser.avatarUrlSmall, 
    avatarUrlMedium: message.fromUser.avatarUrlMedium, 
    v: message.fromUser.v, 
    gv: message.fromUser.gv, 
    readBy: message.readBy, 
    urls: message.urls,
    mentions: message.mentions,
  };
}

exports.buildFavoriteMessage = (message) => {
  return {
    checked: false,
    owner:           message.owner,
    messageId:       message.messageId, 
    text:            message.text, 
    html:            message.html, 
    sent:            message.sent, 
    userId:          message.userId, 
    username:        message.username, 
    displayName:     message.displayName, 
    url:             message.url,
    avatarUrl:       message.avatarUrl, 
    avatarUrlSmall:  message.avatarUrlSmall, 
    avatarUrlMedium: message.avatarUrlMedium, 
    v:               message.v, 
    gv:              message.gv, 
    readBy:          message.readBy, 
    urls:            message.urls,
    mentions:        message.mentions,
  };
}

const createTaskAndSaveToDb = (messageObj) => {
  let message = buildMessage(messageObj);
  new Task(message).save((err, message) => {
    (err) && console.log(err); 

  });
}

const findMessageById = (createTaskAndSaveToDb, messageObj, index, callback) => {
  Task.find({ messageId: messageObj.id }, (err, message) => { 
    (err) && console.log(err); 
    if(message.length === 0){
      // console.log( `${index} it is no message in db ${messageObj.id}`)
      createTaskAndSaveToDb(messageObj, callback);
    } else {
      // console.log(`${index} message already exist ${messageObj.id}`)
    }
   }).limit(1);
}

const getData = (response, callback) => {
  let messages = response;
  if(messages.length) {
    messages.forEach((messageObj, index) => {
      findMessageById(createTaskAndSaveToDb, messageObj, index, callback);
    });
  }
}


const request = (serverResult, callbackGetData, beforeOrAfter, id, doneCb) => {
  let numberOfMessages = 100;
  let url = api.getUrlToMessages(numberOfMessages, beforeOrAfter, id);
  fetch(url)
    .then(res => {
      res.json().then(response => {
        if(response.length == 0){ //corner case: if count of messages is XX00 aka 3500
          console.log(`response retrieve empty array - ${response}\r\n======================finished!========================`);
        }
        else { 
          var oldestMessageId = response[0].id; 
          Task.find({ messageId: oldestMessageId }, (err, message) => { 
            (err) && console.log(err); 

            // callbackGetData(response);  
            
            if(message.length === 1){ //if oldest message in response already in db
              callbackGetData(response); //save messages only if it is new and filter old by each "find"  
              returnJsonResult (serverResult, beforeOrAfter); 
            } else { //if NO message in db

              // callbackGetData(response);  
              //THIS IS IDENTICAL FOO AS callbackGetData BUT WITHOUT CHECK IF MESSAGE ALREADY IN DB
              response.forEach((messageObj, index) => {
                let message = buildMessage(messageObj);
                new Task(message).save((err, message) => {
                  (err) && console.log(err); 
                  console.log(message.id)

                  ///HOW HERE RETRIEVE END OF SAVING? FUCKKKKKKKKKKK!!!!!
                });
              });

              if(response.length == numberOfMessages) {
                request(serverResult, callbackGetData, beforeOrAfter, oldestMessageId, doneCb); // fetch again
              }
              else {  
                returnJsonResult (serverResult, beforeOrAfter);      
              }
            }
          }); 
        }
      });
    })
    .catch(error => {
      console.log(error);
  });
}

function returnJsonResult (serverResult, beforeOrAfter) {
  if(serverResult) {
    Task.count({}, function( err, count){
      (err) && serverResult.send(err); 
      serverResult.json({type: beforeOrAfter, count: count, status: 'finished!'});
    });
  }
  console.log("======================finished!========================");   
}

// const returnJson = (res) => {
//   Task.count({}, function( err, count){
//     (err) && res.send(err); 
//     res.json({type: 1, count: count, status: 'finished!'});
//   });
// } 

exports.latestMessagesToDb = (res) => {
  Task.find({}, function(err, message){
    (err) && console.log(err); 
    (err) && res.send(err); 
    request(res, getData, 'after', message.id, /*returnJson*/ );//parse newest messages from finded newest id
    
  }).sort({sent: -1}).limit(1);
}

exports.AllMessagesToDb = function(res) {
  request(res, getData, 'before', null);
};

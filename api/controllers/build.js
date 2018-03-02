const config     = require('../config');

function User(displayName, username, avatarUrl, lessons, url) {
  this.displayName = displayName;
  this.username = username;
  this.avatarUrl = avatarUrl;
  this.lessons = lessons || [];
  this.url = url;
};

exports.buildMessagesArr = function(data) {
  var messagesArr = [];
  for (var i = 0; i < data.length; i++) {
    var message = data[i];
    var regexlessonsName  = config.vars.lessonsRegex;
    var sent              = new Date(message["sent"]); // 2017-11-17T14:01:46.906Z
    // console.log(sent) 
    var dateSentFormatted = sent.getFullYear() +"."+ 
      ("0"+ (sent.getMonth() + 1)).slice(-2) +"."+ 
      ("0"+ sent.getDate()).slice(-2) +" "+ 
      ("0"+ sent.getHours()).slice(-2) +":"+ 
      ("0"+ sent.getMinutes()).slice(-2);
      // console.log(dateSentFormatted)
    var taskNameMatch     = message["text"].match(regexlessonsName);

    messagesArr[i] = {
        lesson:      (taskNameMatch == null) ? "Unrecognised task" : taskNameMatch,
        finished:    /finished/.test(message["text"]),
        avatarUrl:   message["avatarUrl"],
        displayName: message["displayName"],
        username:    message["username"], 
        gv:          message["gv"],
        v:           message["v"],
        text:        message["text"],
        html:        message["html"],
        sent:        dateSentFormatted,
        url:         message["url"]
    };
    // console.log(messagesArr[i].sent)
  }
  return messagesArr;
}

exports.filterFinishedMessages = function(messagesArr) {
  return finishedArr = messagesArr.filter((obj) => { 
    return obj.finished == true && obj.displayName != "zonzujiro"; 
  });
};

exports.extractActiveUsersFromFinishedArr = function(finishedArr) {
  var usersArr = [];
  for (var i = 0; i < finishedArr.length; i++) {
      var existUser = usersArr.find((user) => user.displayName === finishedArr[i].displayName);

      if(existUser != undefined) { 
        existUser.lessons = existUser.lessons.concat(finishedArr[i].lesson);
      } else {
        usersArr.push(new User(
          finishedArr[i].displayName, 
          finishedArr[i].username,
          finishedArr[i].avatarUrl,
          finishedArr[i].lesson
      ));
    }
  } 
  return usersArr;
}

exports.buildTimelineGraphArr = function(finishedArr, users) {
  var graphArr = [];
  for (var i = 0; i < finishedArr.length; i++) {
    var obj = finishedArr[i];
      var startTime = new Date(obj.sent);   
      var endTime = new Date(new Date(obj.sent).getTime() + (1 * 60 * 60 * 20000));
      var user = users.find((user) => { return user.displayName == obj.displayName });

      graphArr[i] = [`${obj.displayName} (${user.lessons.length})`, obj.lesson+"", startTime, endTime];    
  }
  return graphArr;
}


exports.buildActivityArrOfChattingByDay = function(messagesArr) {
  var activityArr = [];
  for (var i = 0; i < messagesArr.length; i++) {
    var sent = new Date(messagesArr[i].sent);
    var existDay = activityArr.find((day) => day[0].getDate() == sent.getDate() && day[0].getMonth() == sent.getMonth());
    (existDay != undefined) ? existDay[1]++ : activityArr.push( [sent, 1] );
  } 
  
  return activityArr.filter((day) => { return day[0].getMonth() != 8 }); //cut two first messages from september
}
const config = require('../config');

'use strict';
const global = {
  tokenString : "access_token=" + config.vars.gitterToken,
  roomUrlPrefix : "https://api.gitter.im/v1/rooms/"
};

const kottansRoom = {
  id : "59b0f29bd73408ce4f74b06f", //kottans
  // id : "5a7632bdd73408ce4f8b8fa3", //igor-kurkov-kottans
  avatar : "https://avatars-02.gitter.im/group/iv/3/57542d27c43b8c601977a0b6"
};

exports.getUrlToMessages = function(count, beforeOrAfter, id) {
  if(beforeOrAfter === 'before') {
    let oldestId = (id) ? "&beforeId="+id : ''; //last message before what we must parse another more earlier messages
    return `${global.roomUrlPrefix}${kottansRoom.id}/chatMessages?limit=${count}${oldestId}&${global.tokenString}`;  
  }
  if(beforeOrAfter === 'after') {
    let newestId = (id) ? "&afterId="+id : ''; //newest message after what we must parse another most newest messages 
    return `${global.roomUrlPrefix}${kottansRoom.id}/chatMessages?limit=${count}${newestId}&${global.tokenString}`;
  }
};  

exports.getOneMessageUrl = function(id) {
    return `${global.roomUrlPrefix}${kottansRoom.id}/chatMessages/${id}?${global.tokenString}`;
  };

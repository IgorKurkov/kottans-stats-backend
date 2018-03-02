const promises = [];

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

              if(response.length == numberOfMessages) {
                promises.push(Task.insertMany(response)) // insert promise into array and move further
                request(serverResult, callbackGetData, beforeOrAfter, oldestMessageId, doneCb); // fetch again
              }
              else {
                promises.push(Task.insertMany(response))
                Promise.all(promises).then(()=> returnJsonResult(serverResult, beforeOrAfter));      
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
  promises = []; // clear promises
  if(serverResult) {
    Task.count({}, function( err, count){
      (err) && serverResult.send(err); 
      serverResult.json({type: beforeOrAfter, count: count, status: 'finished!'});
    });
  }
  console.log("======================finished!========================");   
}
const requesting = require("./requesting");
const build      = require("./build");
const api        = require("./gitter-api");
const config     = require("../config");
const mongoose   = require("mongoose");
const Task       = mongoose.model("Tasks");

("use strict");

exports.list_all_tasks = function(req, res) {
  Task.find({}, function(err, task) {
    err && res.send(err);
    res.json(task);
  }).sort({ sent: -1 });
};

exports.delete_all_tasks = function(req, res) {
  Task.remove({}, function(err, task) {
    err && res.send(err);
    res.json({ message: "Task successfully deleted" });
  });
};

exports.create_a_task = function(req, res) {
  var new_task = new Task(req.body);
  new_task.save(function(err, task) {
    err && res.send(err);
    res.json(task);
  });
};

exports.read_a_task = function(req, res) {
  Task.findById(req.params.taskId, function(err, task) {
    if (err) res.send(err);
    res.json(task);
  });
};

exports.update_a_task = function(req, res) {
  Task.findOneAndUpdate(
    { _id: req.params.taskId },
    req.body,
    { new: true },
    function(err, task) {
      err && res.send(err);
      res.json(task);
    }
  );
};

exports.delete_a_task = function(req, res) {
  Task.remove({ _id: req.params.taskId }, function(err, task) {
    err && res.send(err);
    res.json({ message: "Task successfully deleted" });
  });
};
// exports.delete_all_tasks = function(authUsers) {
//   return function(req, res) {
//   const token = req.get('X-Auth')
//   // if (!authUsers[token]) {
//   //   res.statusCode = 401
//   //   res.json({status: 'fail'})
//   //   return
//   // }
//   Task.remove({}, function(err, task){
//     (err) && res.send(err);
//     res.json({ message: 'Task successfully deleted' });
//   });
// }
// }

exports.find_newest_task = function(req, res) {
  Task.find({}, function(err, task) {
    err && res.send(err);
    res.json(task);
  })
    .sort({ sent: -1 })
    .limit(1);
};

exports.getFinishedTaskMessagesForTimeline = function(req, res) {
  Task.find({ text: { $regex: config.vars.lessonsRegex } }, function(
    err,
    result
  ) {
    err && res.send(err);
    let messageArr = build.buildMessagesArr(result);
    let finishedArr = build.filterFinishedMessages(messageArr);
    let users = build.extractActiveUsersFromFinishedArr(finishedArr);
    res.json(
      // finishedArr
      build.buildTimelineGraphArr(finishedArr, users)
    );
  }).sort({ sent: -1 });
};

exports.getFinishedTaskMessagesByStudents = function(req, res) {
  Task.find({ text: { $regex: config.vars.lessonsRegex } }, function(
    err,
    result
  ) {
    err && res.send(err);
    let messageArr = build.buildMessagesArr(result);
    let finishedArr = build.filterFinishedMessages(messageArr);
    res.json(finishedArr);
  }).sort({ sent: -1 });
};

exports.getMessagesCountByEachDay = function(req, res) {
  Task.find({}, function(err, messages) {
    err && res.send(err);
    let sendArr = build.buildActivityArrOfChattingByDay(messages);

    res.json(sendArr);
  }).sort({ sent: -1 });
};

exports.getLearners = function(req, res) {
  Task.find({ text: { $regex: config.vars.lessonsRegex } }, function(
    err,
    result
  ) {
    err && res.send(err);
    let messageArr = build.buildMessagesArr(result);
    let finishedArr = build.filterFinishedMessages(messageArr);
    let users = build.extractActiveUsersFromFinishedArr(finishedArr);
    res.json(users);
  });
};

exports.countMessagesInDb = function(req, res) {
  Task.count({}, function(err, count) {
    err && res.send(err);
    res.json(count);
  });
};

exports.countAuthorsInDb = function(req, res) {
  Task.distinct("username", function(err, username) {
    err && res.send(err);
    res.json(username);
  });
};

//https://stackoverflow.com/a/43683832/9026103
exports.countMessagesByDay = function(req, res) {
  let millisecondsFromUTC = 2 * 3600 * 1000;
  Task.aggregate(
    [
      { $match: {} },
      // { $group: { _id: { $dateToString: { format: "%Y.%m.%d", date: "$sent", } }, count: { $sum: 1 } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y.%m.%d",
              //https://stackoverflow.com/a/41390006/9026103
              date: { $add: ["$sent", millisecondsFromUTC] }
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ],
    function(err, array) {
      err && res.send(err);
      res.json(array);
    }
  );
};

exports.countMessagesPerUser = function(req, res) {
  Task.aggregate(
    [
      { $match: {} },
      { $group: { _id: { name: "$username" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ],
    function(err, array) {
      err && res.send(err);
      array = array.sort(function(a, b) {
        if (a.count < b.count) return -1;
        if (a.count > b.count) return 1;
        return 0;
      });
      res.json(array.reverse());
    }
  );
};

exports.countMessagesPerDate = function(req, res) {
  // console.log(req.body.value)
  var date = new Date(req.body.value),
    today = date,
    yesterday = new Date(today.valueOf() + 1000 * 60 * 60 * 24);
  Task.find({ sent: { $gte: today, $lt: yesterday } }, function(err, array) {
    err && res.send(err);
    res.json(array);
  }).sort({ sent: 1 });
};

exports.globalSearch = function(req, res) {
  let query = req.body.value
    .trim()
    .split(" ")
    .map(el => {
      return {
        //https://stackoverflow.com/questions/20657951/multiple-regex-using-and-in-mongodb
        html: { $regex: new RegExp(el, "igm") }
      };
    });
  Task.find({ $and: query }, function(err, array) {
    err && res.send(err);
    res.json(array);
  }).sort({ sent: 1 });
};

exports.usernameSearch = function(req, res) {
  var re = new RegExp(req.body.value, "ig");
  Task.find({ username: { $regex: re } }, function(err, array) {
    err && res.send(err);
    res.json(array);
  }).sort({ sent: 1 });
};

//works fine
// exports.globalSearch = function(req, res) {
//   Task.find({$where:"JSON.stringify(this).indexOf('igor')!=-1"},
//   function ( err, array) {
//     (err) && res.send(err);
//     res.json(array);
//     });
//   }

exports.fetchAllMessagesToDb = function(req, res) {
  requesting.AllMessagesToDb(res);
};

exports.fetchLatestMessagesToDb = function(req, res) {
  requesting.latestMessagesToDb(res);
};

exports.findMessageById = function(req, res) {
  Task.findOne({ messageId: req.body.value.trim() }, function(err, message) {
    err && res.send(err);
    res.json(message);
  });
};

const Favorite = mongoose.model("Favorites");
//works
exports.saveMessageToFavorites = function(req, res) {
  let postValue = JSON.parse(req.body.value.trim());
  // console.log(postValue)
  Favorite.findOne(
    {
      $and: [{ messageId: postValue.messageId }, { owner: postValue.owner }]
    },
    (err, message) => {
      err && res.send(err);
      if (!message) {
        Task.findOne({ messageId: postValue.messageId }, (err, message) => {
          console.log(postValue);
          console.log("Added to favorites");
          message.owner = postValue.owner;
          let favoriteMessage = requesting.buildFavoriteMessage(message);
          new Favorite(favoriteMessage).save((err, mes) => {
            err && res.send(err);
            res.json(mes);
          });
        });
      } else {
        res.json("Already exist");
        console.log("Already exist");
      }
    }
  );
};

// //works
// exports.saveMessageToFavorites = function(req, res){
//   let postValue = JSON.parse(req.body.value.trim());
//   console.log(postValue)
//   Task.findOne({ messageId: postValue.messageId },
//     (err, message) => {
//       (err) && res.send(err);
//       message.owner = postValue.owner;
//       let favoriteMessage = requesting.buildFavoriteMessage(message)
//       new Favorite(favoriteMessage).save((err, mes) => {
//         (err) && res.send(err);
//         console.log(message)
//         res.json(mes);
//       });
//   });
// };

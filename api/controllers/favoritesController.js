const requesting = require('./requesting');
const build = require('./build');
const api        = require('./gitter-api');
const config     = require('../config');

const mongoose   = require('mongoose')
const Favorite   = mongoose.model('Favorites');

'use strict';

exports.listAllFavoriteMessages = function(req, res){
  Favorite.find({}, function(err, favoriteMessages) {
    (err) && res.send(err);
    res.json(favoriteMessages);
  }).sort({sent: -1});
};

exports.deleteAllFavoriteMessages = function(req, res) {
  Favorite.remove({}, function(err, favorites){
    (err) && res.send(err); 
    res.json({ message: 'Favorites successfully deleted' });
  });
}

exports.getFavoritesByCredentials = function(req, res) {
  Favorite.find({ owner: req.body.value }, (err, array) => {
    (err) && res.send(err); 
    res.json(array);
  });
};


exports.deleteMessageFromFavorites = function(req, res){
  let postValue = JSON.parse(req.body.value.trim());
  Favorite.remove({ $and: 
    [
      {  messageId: postValue.messageId  }, 
      {  owner: postValue.owner   }
    ]
  }, (err, message) => {
      (err) && res.send(err); 
      res.json(message);
      console.log('deleted', message);
  });
};

exports.checkFavoriteMessageAsDone = (req, res) => {
  let postValue = JSON.parse(req.body.value.trim());
  Favorite.findOneAndUpdate(
    { $and: 
      [
        {  messageId: postValue.messageId  }, 
        {  owner: postValue.owner   }
      ]
    },
    { $set: 
      { "checked": true, } 
    },
    {upsert: true},
    (err, message) => {
      (err) && res.send(err); 
      res.json(message);
    }
  );
}
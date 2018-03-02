const config     = require('../config');
const requesting = require('./requesting');

var intervalId = null;
exports.getIntervalId = function (req, res) {
  let timer = 0;
  if(intervalId && intervalId._idleTimeout >= 0) {
     timer = intervalId._idleTimeout; 
    } 
  res.json(timer);
}

const interval = (res, requestTimeout) => {
  intervalId = setInterval((res) => {
    requesting.latestMessagesToDb();
    console.log(`==== interval executed! ${new Date()} =====`)
  }, requestTimeout || config.vars.defaultIntervalTime);
}

exports.startInterval_fetchLatestMessagesToDb = function (req, res) {
  let timeout = req.body.timeout;
  interval(res, timeout);
  res.json({ started: timeout || config.vars.defaultIntervalTime });
  console.log(`============= interval started! ${timeout || config.vars.defaultIntervalTime} =============${new Date()}`)
}

exports.stopInterval_fetchLatestMessagesToDb = function (req, res) {
  clearInterval(intervalId);
  let output = intervalId ? intervalId._called : "It is no timer Id. ";
  res.json( {stopped: output } );
  console.log(`============== interval stopped! ${ output } =========== ${new Date()}`)
}

var express  = require("express"),

    app      = express(),
    http = require('http'), // 3. HTTP server
    port     = process.env.PORT || 3002,
    mongoose = require('mongoose'),
    Task     = require('./api/models/todoListModel'),
    Favorite = require('./api/models/favoriteModel'),
    bodyParser = require('body-parser');

    // console.log('============ENV:=========',process.env.MONGODB_URI, data.env.MONGODB_URI, env.MONGODB_URI, MONGODB_URI)

mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI || data.env.MONGODB_URI || 'mongodb://localhost/Tododb');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/Tododb');
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/todoListRoutes');
routes(app);

app.use((req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  if (req.method === 'Options') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
    return res.status(200).json({});
  }
});

// var app = require('./app'); // this is your express app
  app.set('port', port);
  var server = http.createServer(app);
  server.listen(port);

  // app.listen(port);
console.log('todo list RESTful API server started on: ' + port);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});
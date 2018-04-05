var http = require('http');
var express = require ('express');
var app = express();
var ent = require('ent');
var users = [];

app.get('/',function(request,response) {
  response.sendfile('index.html');
});

app.get('/script.js',function(request,response) {
  response.sendfile('script.js');
});

var server = http.createServer(app);

var io = require('socket.io')(server);

io.on('connection', function (socket) {
  var userName;
  var userId;
  socket.on('username entered', function (username) {
    socket.username = ent.encode(username);
    userName = username;
    users.push(socket.username);
    socket.userNumber = users.length;
    userId = users.length;
    io.emit('refreshUserList', users);
    welcomeMessageOthers = "Please welcome " + username + " !";
    welcomeMessageUser = "Welcome to Megachat " + username + " !";
    socket.broadcast.emit('messageFromServer', welcomeMessageOthers);
    socket.emit('messageFromServer', welcomeMessageUser);
  });
  socket.on('messageFromClient', function (data) {
    data = ent.encode(data);
    msg = socket.username + ' says : ' + data;
    io.emit('messageFromServer' , msg);
  });
  socket.on('disconnect', function (socket) {
    users.splice(userId-1,1);
    msg = userName + ' leaved the chat !';
    io.emit('messageFromServer' , msg);
    io.emit('refreshUserList', users);
  });
});

server.listen(9000, console.log("Server is listenning to http://localhost:9000/"));

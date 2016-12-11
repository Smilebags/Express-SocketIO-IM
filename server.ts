/// <reference path=".vscode/node.d.ts" />
/// <reference path=".vscode/express3.d.ts" />
/// <reference path=".vscode/socket.io.d.ts" />
/// <reference path=".vscode/jquery.d.ts" />
/// <reference path="public/scripts/functions.ts" />
function hi() {
  return "Hi";
}
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function makeNickNumber(string) {
    var nickNumber = 1;
      for (var i = 0; i < string.length; i++) {
        nickNumber = nickNumber * string.charCodeAt(i);
      }
      return nickNumber;
}
function nickNumberToColour(number) {
    return HSVtoRGB(((number%1000)/1000),0.5,0.8);
}

function escapeHtml(string: string) {
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
}





//requires
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
//convert HSB colours to RGB



var port: number = 8080;
var loggedInUsers = [];
var messages = [];
var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

app.use(express.static('public'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/templates/header.html');
});

io.on('connection', function(socket){

  function updateUser(userObject, property, value) {
    userObject.property = value;
  }

  console.log('Someone connected:' + socket.id);

  socket.on("login request", function(msg){
    if (socket.SocketID) {
      for (var j = 0; j < loggedInUsers.length; j++) {
        if (loggedInUsers[j].ID == socket.ID) {
          console.log("updating user");
          updateUser(loggedInUsers[j], SocketID, socket.id); 
          socket.emit("user list", loggedInUsers);
          socket.emit("message list", messages);
          console.log(JSON.stringify(loggedInUsers[j]));
        }
      }
    } else {
      console.log("Login Request: " + JSON.stringify(msg));
      var socketID = socket.id;
      console.log(JSON.stringify(msg));
      if (msg.Nickname !== "") {
        var nickNumber = makeNickNumber(escapeHtml(msg.Nickname));
        var colour = nickNumberToColour(nickNumber);
        var newUser = {"Nickname": escapeHtml(msg.Nickname), "SocketID": socketID, "Colour": colour, "ID": loggedInUsers.length};
        loggedInUsers.push(newUser);
        socket.emit("login accept", newUser);
        socket.emit("user list", loggedInUsers);
        socket.emit("message list", messages);
        console.log(JSON.stringify(messages));
        socket.broadcast.emit("user login", newUser);
      } else {
        socket.emit("login reject");
      }
    }
    socket.on("chat message", function(incomingMessage) {
      if(incomingMessage) {
        var chatMessage = {"Nickname": msg.Nickname, "Message": escapeHtml(incomingMessage), "Colour": colour};
        messages.push(chatMessage);
        socket.broadcast.emit("chat message", chatMessage);
        console.log(escapeHtml(msg.Nickname) + ": " + escapeHtml(chatMessage.Message));
      }
    });
  });
  socket.on('disconnect', function(){
    var nickname;
    var msg;
    var positionInArray;
    var colour;
    for (var i = 0; i < loggedInUsers.length; i++) {
      if (loggedInUsers[i].SocketID == socket.id) {
        nickname = loggedInUsers[i].Nickname;
        colour = loggedInUsers[i].Colour;
        positionInArray = i;
      }
    }
    msg = {"Nickname": nickname, "Colour": colour};
    console.log(msg.Nickname +' disconnected.');
    socket.broadcast.emit("user disconnect", msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:8080');
});
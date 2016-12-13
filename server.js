/// <reference path=".vscode/node.d.ts" />
/// <reference path=".vscode/express3.d.ts" />
/// <reference path=".vscode/socket.io.d.ts" />
/// <reference path=".vscode/jquery.d.ts" />
/// <reference path="public/scripts/functions.ts" />
//requires
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var f = require('./public/scripts/functions.js');
console.log("makeNickNumber: " + typeof f.makeNickNumber);
var port = 8080;
var loggedInUsers = [];
var messages = [];
app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/templates/header.html');
});
io.on('connection', function (socket) {
    function updateUser(userObject, property, value) {
        userObject.property = value;
    }
    console.log('Someone connected:' + socket.id);
    socket.on("login request", function (msg) {
        if (socket.SocketID) {
            for (var j = 0; j < loggedInUsers.length; j++) {
                if (loggedInUsers[j].ID == socket.ID) {
                    console.log("updating user");
                    updateUser(loggedInUsers[j], SocketID, f.escapeHtml(socket.id));
                    socket.emit("user list", loggedInUsers);
                    socket.emit("message list", messages);
                    console.log("Logged in Users: " + JSON.stringify(loggedInUsers[j]));
                }
            }
        }
        else {
            console.log("Login Request: " + JSON.stringify(msg));
            var socketID = socket.id;
            if (msg.Nickname !== "") {
                var nickNumber = f.makeNickNumber(f.escapeHtml(msg.Nickname));
                var colour = f.nickNumberToColour(nickNumber);
                var newUser = { "Nickname": f.escapeHtml(msg.Nickname), "SocketID": socketID, "Colour": colour, "ID": loggedInUsers.length };
                loggedInUsers.push(newUser);
                socket.emit("login accept", newUser);
                socket.emit("user list", loggedInUsers);
                socket.emit("chat list", messages);
                console.log(JSON.stringify(messages));
                socket.broadcast.emit("user login", newUser);
            }
            else {
                socket.emit("login reject");
            }
        }
        socket.on("chat message", function (incomingMessage) {
            if (incomingMessage) {
                var chatMessage = incomingMessage;
                messages.push(chatMessage);
                socket.broadcast.emit("chat message", chatMessage);
                console.log(f.escapeHtml(msg.Nickname) + ": " + f.escapeHtml(chatMessage.Contents));
            }
        });
        socket.on("chat stamp", function (incomingMessage) {
            if (incomingMessage) {
                var outputMessage = incomingMessage;
                outputMessage.Contents = f.findStampURL(incomingMessage.Contents);
                messages.push(outputMessage);
                socket.broadcast.emit("chat stamp", outputMessage);
                console.log(f.escapeHtml(msg.Nickname) + ": " + outputMessage.Contents);
            }
        });
    });
    socket.on('disconnect', function () {
        var user;
        var positionInArray;
        for (var i = 0; i < loggedInUsers.length; i++) {
            if (loggedInUsers[i].SocketID == socket.id) {
                user = loggedInUsers[i];
                positionInArray = i;
            }
        }
        var msg = new f.Message("disconnect", user.Nickname, user.Colour, "");
        console.log(msg.Nickname + ' disconnected.');
        socket.broadcast.emit("user disconnect", msg);
        messages.push(msg);
        //loggedInUsers.splice(positionInArray, 1);
    });
});
http.listen(port, function () {
    console.log('listening on *:8080');
});

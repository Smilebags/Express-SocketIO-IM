var socket = io();
var loggedInUsers = [];
var messages = [];
var me;


$("form#login-form").submit(function() {
    var msg = {"Nickname": $("#nickname").val()};
    if (me) {   
        msg = me;
    }
    socket.emit("login request", msg);
    $("#login").attr("disabled", true);
    return false;
});

$("form#messenger").submit(function() {
    var messageContents = $("#m").val();
    var msg = new Message("message", me.Nickname, me.Colour, messageContents);
    socket.emit("chat message", msg);
    $("#messages").append($("<li>").text(msg).addClass("self-message").css("background-color", "rgb(" + me.Colour.r + "," + me.Colour.g + "," + me.Colour.b + ")"));
    $("#m").val("");
    $(".messages-container").trigger('newMessage');
    return false;
});

socket.on("user list", function (msg) {
    loggedInUsers = msg;
    console.log(loggedInUsers.length + " logged in users.")
});

socket.on("message list", function (msg) {
    messages = msg;
    console.log("Loading all existing messages.");
    for (var i = 0; i < messages.length; i++) {
        var text = "<p class='message-nickname'>";
        text += messages[i].Nickname;
        text += "</h2><p>";
        text += messages[i].Message;
        text += "</p>";
        $("#messages").append($("<li>").html(text).css("background-color", "rgb(" + messages[i].Colour.r + "," + messages[i].Colour.g + "," + messages[i].Colour.b + ")").addClass("message"));
    }
    $(".messages-container").trigger('newMessage');
});

socket.on("login accept", function(msg) {
    $("#login-form").fadeOut();
    $(document).prop('title', 'TeamChat - ' + msg.Nickname);
    me = msg;
});
socket.on("login reject", function() {
    $("#login").attr("disabled", false);
    alert("Please enter a Nickname.");
});
socket.on("chat message", function(msg) {
    var text = "<p class='message-nickname'>";
    text += msg.Nickname;
    text += "</h2><p>";
    text += msg.Contents;
    text += "</p>";
    $("#messages").append($("<li>").html(text).css("background-color", "rgb(" + msg.Colour.r + "," + msg.Colour.g + "," + msg.Colour.b + ")").addClass("message"));
    $(".messages-container").trigger('newMessage');
    $("#message-sound")[0].play();
});
socket.on("chat stamp", function(msg) {
    var text = "<p class='message-nickname'>";
    text += msg.Nickname;
    text += "</h2><img class='message-stamp' src='";
    text += msg.URL;
    text += "' ></p>";
    $("#messages").append($("<li>").html(text).css("background-color", "rgb(" + msg.Colour.r + "," + msg.Colour.g + "," + msg.Colour.b + ")").addClass("message"));
    $(".messages-container").trigger('newMessage');
    $("#message-sound")[0].play();
});
socket.on("user disconnect", function(msg) {
    $("#messages").append($("<li>").html("<p class='message-nickname'>" + msg.Nickname + " disconnected.</p>").addClass("message").css("background-color", "rgb(" + msg.Colour.r + "," + msg.Colour.g + "," + msg.Colour.b + ")"));
    $(".messages-container").trigger('newMessage');
});
socket.on("user login", function(msg) {
    $("#messages").append($("<li>").html("<p class='message-nickname'>" + msg.Nickname + " connected.</p>").addClass("message").css("background-color", "rgb(" + msg.Colour.r + "," + msg.Colour.g + "," + msg.Colour.b + ")")); 
    $(".messages-container").trigger('newMessage');
});

socket.on('disconnect', function() {
    if (me) {
        $("#nickname").attr("disabled", true);
    }
    $("#login-form").fadeIn();
    
});
socket.on('connect', function() {
    if (me) {
        $("#login").attr("disabled", false);
    }
});
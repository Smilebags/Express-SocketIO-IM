var socket = io();
var loggedInUsers = [];
var messages = [];
var me;
$("#nickname").focus();
$("form#login-form").submit(function () {
    var msg = { "Nickname": $("#nickname").val() };
    if (me) {
        msg = me;
    }
    socket.emit("login request", msg);
    $("#login").attr("disabled", true);
    return false;
});
$("form#messenger").submit(function () {
    var messageContents = $("#m").val();
    if (messageContents != "") {
        var msg = new Message("message", me.Nickname, me.Colour, messageContents);
        socket.emit("chat message", msg);
        $("#messages").append($("<li>").text(msg.Contents).addClass("self-message").css("background-color", "rgb(" + me.Colour.r + "," + me.Colour.g + "," + me.Colour.b + ")"));
        $("#m").val("");
        $(".messages-container").trigger('newMessage');
        return false;
    }
});
$("#stamps").click(function () {
    var messageContents = 2;
    var msg = new Message("stamp", me.Nickname, me.Colour, messageContents);
    socket.emit("chat stamp", msg);
    var local = "<img class='message-stamp' src='";
    //local+= findStampURL(1);
    local += "/images/stamps/2.jpg";
    local += "'/>";
    $("#messages").append($("<li>").html(local).addClass("self-message").css("background-color", "rgb(" + me.Colour.r + "," + me.Colour.g + "," + me.Colour.b + ")"));
    $(".messages-container").trigger('newMessage');
    return false;
});
socket.on("user list", function (msg) {
    loggedInUsers = msg;
});
socket.on("chat list", function (msg) {
    messages = msg;
    for (var i = 0; i < messages.length; i++) {
        switch (messages[i].Type) {
            case "message":
                var text = "<p class='message-nickname'>";
                text += messages[i].Nickname;
                text += "</p><p>";
                text += messages[i].Contents;
                text += "</p>";
                $("#messages").append($("<li>").html(text).css("background-color", "rgb(" + messages[i].Colour.r + "," + messages[i].Colour.g + "," + messages[i].Colour.b + ")").addClass("message"));
                break;
            case "stamp":
                var text = "<p class='message-nickname'>";
                text += messages[i].Nickname;
                text += "</p><img class='message-stamp' src='";
                text += messages[i].Contents;
                text += "' />";
                $("#messages").append($("<li>").html(text).css("background-color", "rgb(" + messages[i].Colour.r + "," + messages[i].Colour.g + "," + messages[i].Colour.b + ")").addClass("message"));
                break;
            case "disconnect":
                var text = "<p class='message-nickname'>";
                text += messages[i].Nickname;
                text += " Disconnected</p>";
                $("#messages").append($("<li>").html(text).css("background-color", "rgb(" + messages[i].Colour.r + "," + messages[i].Colour.g + "," + messages[i].Colour.b + ")").addClass("message"));
                break;
            default:
                var text = "<p class='message-nickname'>";
                text += escapeHtml(messages[i].Nickname);
                text += "</p><p>";
                text += escapeHtml(messages[i].Contents);
                text += "</p>";
                $("#messages").append($("<li>").html(text).css("background-color", "rgb(" + messages[i].Colour.r + "," + messages[i].Colour.g + "," + messages[i].Colour.b + ")").addClass("message"));
                break;
        }
    }
    $(".messages-container").trigger('newMessage');
});
socket.on("login accept", function (msg) {
    $("#m").focus();
    $("#login-form").fadeOut();
    $(document).prop('title', 'TeamChat - ' + msg.Nickname);
    me = msg;
});
socket.on("login reject", function () {
    $("#login").attr("disabled", false);
    alert("Please enter a Nickname.");
});
socket.on("chat message", function (msg) {
    var text = "<p class='message-nickname'>";
    text += msg.Nickname;
    text += "</p><p>";
    text += msg.Contents;
    text += "</p>";
    $("#messages").append($("<li>").html(text).css("background-color", "rgb(" + msg.Colour.r + "," + msg.Colour.g + "," + msg.Colour.b + ")").addClass("message"));
    $(".messages-container").trigger('newMessage');
    $("#message-sound")[0].play();
});
socket.on("chat stamp", function (msg) {
    var text = "<p class='message-nickname'>";
    text += msg.Nickname;
    text += "</p><img class='message-stamp' src='";
    text += msg.Contents;
    text += "' />";
    $("#messages").append($("<li>").html(text).css("background-color", "rgb(" + msg.Colour.r + "," + msg.Colour.g + "," + msg.Colour.b + ")").addClass("message"));
    $(".messages-container").trigger('newMessage');
    $("#message-sound")[0].play();
});
socket.on("user disconnect", function (msg) {
    $("#messages").append($("<li>").html("<p class='message-nickname'>" + msg.Nickname + " disconnected.</p>").addClass("message").css("background-color", "rgb(" + msg.Colour.r + "," + msg.Colour.g + "," + msg.Colour.b + ")"));
    $(".messages-container").trigger('newMessage');
});
socket.on("user login", function (msg) {
    $("#messages").append($("<li>").html("<p class='message-nickname'>" + msg.Nickname + " connected.</p>").addClass("message").css("background-color", "rgb(" + msg.Colour.r + "," + msg.Colour.g + "," + msg.Colour.b + ")"));
    $(".messages-container").trigger('newMessage');
});
socket.on('disconnect', function () {
    if (me) {
        $("#nickname").attr("disabled", true);
    }
    $("#login-form").fadeIn();
});
socket.on('connect', function () {
    if (me) {
        $("#login").attr("disabled", false);
    }
});
socket.on('debug alert', function (msg) {
    alert(msg);
});

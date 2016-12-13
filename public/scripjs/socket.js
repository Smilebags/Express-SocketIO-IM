"use strict";var socket=io(),loggedInUsers=[],messages=[],me;$("#nickname").focus(),$("form#login-form").submit(function(){var e={Nickname:$("#nickname").val()};return me&&(e=me),socket.emit("login request",e),$("#login").attr("disabled",!0),!1}),$("form#messenger").submit(function(){var e=$("#m").val(),s=new Message("message",me.Nickname,me.Colour,e);return socket.emit("chat message",s),$("#messages").append($("<li>").text(s.Contents).addClass("self-message").css("background-color","rgb("+me.Colour.r+","+me.Colour.g+","+me.Colour.b+")")),$("#m").val(""),$(".messages-container").trigger("newMessage"),!1}),$("#stamps").click(function(){var e=2,s=new Message("stamp",me.Nickname,me.Colour,e);socket.emit("chat stamp",s);var o="<img class='message-stamp' src='";return o+="/images/stamps/2.jpg",o+="'/>",$("#messages").append($("<li>").html(o).addClass("self-message").css("background-color","rgb("+me.Colour.r+","+me.Colour.g+","+me.Colour.b+")")),$(".messages-container").trigger("newMessage"),!1}),socket.on("user list",function(e){loggedInUsers=e}),socket.on("chat list",function(e){messages=e;for(var s=0;s<messages.length;s++){var o="<p class='message-nickname'>";o+=messages[s].Nickname,o+="</p><p>",o+=messages[s].Contents,o+="</p>",$("#messages").append($("<li>").html(o).css("background-color","rgb("+messages[s].Colour.r+","+messages[s].Colour.g+","+messages[s].Colour.b+")").addClass("message"))}$(".messages-container").trigger("newMessage")}),socket.on("login accept",function(e){$("#m").focus(),$("#login-form").fadeOut(),$(document).prop("title","TeamChat - "+e.Nickname),me=e}),socket.on("login reject",function(){$("#login").attr("disabled",!1),alert("Please enter a Nickname.")}),socket.on("chat message",function(e){var s="<p class='message-nickname'>";s+=e.Nickname,s+="</p><p>",s+=e.Contents,s+="</p>",$("#messages").append($("<li>").html(s).css("background-color","rgb("+e.Colour.r+","+e.Colour.g+","+e.Colour.b+")").addClass("message")),$(".messages-container").trigger("newMessage"),$("#message-sound")[0].play()}),socket.on("chat stamp",function(e){var s="<p class='message-nickname'>";s+=e.Nickname,s+="</p><img class='message-stamp' src='",s+=e.Contents,s+="' />",$("#messages").append($("<li>").html(s).css("background-color","rgb("+e.Colour.r+","+e.Colour.g+","+e.Colour.b+")").addClass("message")),$(".messages-container").trigger("newMessage"),$("#message-sound")[0].play()}),socket.on("user disconnect",function(e){$("#messages").append($("<li>").html("<p class='message-nickname'>"+e.Nickname+" disconnected.</p>").addClass("message").css("background-color","rgb("+e.Colour.r+","+e.Colour.g+","+e.Colour.b+")")),$(".messages-container").trigger("newMessage")}),socket.on("user login",function(e){$("#messages").append($("<li>").html("<p class='message-nickname'>"+e.Nickname+" connected.</p>").addClass("message").css("background-color","rgb("+e.Colour.r+","+e.Colour.g+","+e.Colour.b+")")),$(".messages-container").trigger("newMessage")}),socket.on("disconnect",function(){me&&$("#nickname").attr("disabled",!0),$("#login-form").fadeIn()}),socket.on("connect",function(){me&&$("#login").attr("disabled",!1)}),socket.on("debug alert",function(e){alert(e)});
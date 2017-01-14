$(document).ready(function () {
    $('.messages-container').bind('newMessage', function () {
        if (!messagesScrolled) {
            $(".messages-container").scrollTop(32 + $("#messages").height() - $(".messages-container").height());
        }
    });
    var scrollHeight = $("#messages").height();
    $(".messages-container").scrollTop(scrollHeight);
    var messagesScrolled = false;
    $("form#login-form #nickname").on("input", function () {
        var string = $("#nickname").val();
        var nickNumber = makeNickNumber(string);
        var colour = nickNumberToColour(nickNumber);
        $(".custom-colour").css("color", "rgb(" + colour.r + "," + colour.g + "," + colour.b + ")");
        return false;
    });
    $(".messages-container").scroll(function () {
        if ($(".messages-container").scrollTop() + $(".messages-container").height() >= $("#messages").height()) {
            messagesScrolled = false;
        }
        else {
            messagesScrolled = true;
        }
    });
    $("#stamps").click(function () {
        $(".stamp-box").toggleClass("open");
    });
});

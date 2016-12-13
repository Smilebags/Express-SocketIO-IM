
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

function escapeHtml(string) {
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
}

function Message(type, nickname, colour, contents) {
    this.Type = type;
    this.Nickname = nickname;
    this.Colour = colour;
    this.Contents = contents;
}
function findStampURL(stampID: number) {
    var URL = "/images/stamps/" + stampID + ".jpg";
    return URL;
}

module.exports = exports = {HSVtoRGB: HSVtoRGB, makeNickNumber: makeNickNumber, nickNumberToColour: nickNumberToColour, escapeHtml: escapeHtml, Message: Message, findStampURL: findStampURL};
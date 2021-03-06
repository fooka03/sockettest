var argv = require('minimist')(process.argv.slice(2));
var os = require('os');
var io = require("socket.io-client");
var clientCount = argv.c;
var serverUrl = argv.s;

var heartbeatInterval = 25 * 1000;
var idx = 0;
var intervalID;
var makeConnection = function() {
  var chat = io.connect(serverUrl, { "force new connection": true, "transports": ['websocket'] });
  chat.on('connect', function () {
    var myCon = idx;
    setTimeout(function() {
      chat.emit('chat message', 'hi! from client: ' + myCon + ' and host: ' + os.hostname() + ' and time: ' + new Date().getTime());
    }, 5000);
    chat.on('chat message', function(msg){
      //console.log(new Date().getTime() + ' - message: ' + msg);
    });
  });
  idx++;
  if (idx === clientCount) {
    clearInterval(intervalID);
  }
};

intervalID = setInterval(makeConnection, heartbeatInterval/clientCount);

// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;


const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom

var numUsers = 0;

//Client connects to the server 
io.on('connection', (socket) => {
    console.log("New Connection");
    socket.on('new session', (data) => {

      socket.serialPortPath = data.serialPortPath;
      socket.baudrate=data.baudrate;
      //TODO: Update the array of opened ports

      try{
        socket.serialPort = new SerialPort(socket.serialPortPath, { baudRate: parseInt(socket.baudrate) });
        socket.serialPortParser = new Readline()
        socket.serialPort.pipe(socket.serialPortParser)

		socket.serialPortParser.on('data', (line) => 
			//console.log(`> ${line}`)
			socket.emit('new message',line)
		)

        console.log("New Session Started");
        socket.emit('session started', {});       
      }catch(e){
        console.error(e)
        socket.emit('session failed', {}); 
      }
 
    });

	

    socket.on('disconnect', () => {
      //TODO: Update Open Serial Ports List
    });
});

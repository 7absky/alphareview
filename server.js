var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static('scripts'));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('drawing', function(data){
        console.log(data);
        socket.broadcast.emit('drawing', data);
    });
});

http.listen(3000, function(){
    console.log('listening on: 3000');
});


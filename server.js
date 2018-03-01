var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

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

    socket.on('note:add', function(data) {
        console.log('new note!', data);
        socket.broadcast.emit('note:add', data);
    })
});

http.listen(port, function(){
    console.log('listening on: ', port);
});


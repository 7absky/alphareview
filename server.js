var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static('scripts'));
io.configure(function(){
    io.set('transports', ["xhr-polling"]);
    io.set("polling duration", 10);
})
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

http.listen(port, function(){
    console.log('listening on: ', port);
});


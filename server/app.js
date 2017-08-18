var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    io = require('socket.io');

var app = express();
var server = http.createServer(app);
io = io.listen(server);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var SMSService = require('./services/SMSService');


io.on('connection', function(socket) {
    console.log("user connected");

    socket.on('sendMessage', function(data){
        console.log(data);

        SMSService.sendMsg(data, io, function(serverAnswer){
            socket.emit('getNotification', serverAnswer);
        });

        //SMSService.sendSMS(data, function(serverAnswer){
        //    socket.emit('getNotification', serverAnswer);
        //});

        socket.emit('getNotification', {
            type: 'infoMsg',
            msg: 'Message is performing...'
        });
    });

    socket.on('deviceConnected', function(){
        console.log('mobile device is connected');
    });
    socket.on('deviceData', function(data){
        data.socketId = socket.id;
        SMSService.addClient(data);
    });
    socket.on('disconnect', function () {
        SMSService.removeClient(socket.id);
    });
});


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});


app.use(express.static('public'));

server.listen(3055, function(){
    console.log('+++++ smsServer was started +++++');
});
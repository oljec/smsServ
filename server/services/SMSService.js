//config data
var configData = {
    smppAddress: 'smpp://94.249.146.183:29900',
    system_id: 'oljecTest',                         //name of shlyz
    password: 'qwerty',                             //password of shlyz
    source_addr: 'blablabla'                              //name of podpis' ('reg')
};

var msgText = {
    error: 'Rejected',
    success: 'Accepted'
};

var connectedClients = [];

var smpp = require('smpp');

module.exports = {
    sendSMS: function(data, callback){
        sendSMS(data, callback);
    },

    sendMsg: function(data, io, callback){
        //find if number is connected to program => send to program
        //else => send sms

        var id = findClient({
            field: 'phoneNumber',
            value: data.destination_addr
        });
        if (id !== 'noData') {
            io.sockets.sockets[connectedClients[id].socketId].emit('deviceMsgReceiver', data.short_message);
        } else {
            sendSMS(data, callback);
        }

        console.log(JSON.stringify(data));
        console.log(id);
    },

    addClient: function(data){
        var id = findClient({
            field: 'phoneNumber',
            value: data.phoneNumber
        });
        if (id !== 'noData') {
            connectedClients.splice(id, 1);
        }
        connectedClients.push(data);

        console.log(JSON.stringify(connectedClients));
    },

    removeClient: function(socketId){
        var id = findClient({
            field: 'socketId',
            value: socketId
        });
        if (id !== 'noData') {
            connectedClients.splice(id, 1);
        }

        console.log(JSON.stringify(connectedClients));
    }
};

function sendSMS(data, callback){
    data.destination_addr = '+' + data.destination_addr;
    console.log(data);

    var session = smpp.connect(configData.smppAddress);
    session.bind_transceiver({
        system_id: configData.system_id,
        password: configData.password
    }, function(pdu) {
        data.source_addr =  configData.source_addr;

        session.submit_sm(data, function(pdu){
            console.log('checking');
            console.log(pdu);
        });
    });

    session.on('connect', function(data) {
        console.log('connected');
    });
    session.on('pdu', function(pdu){
        console.log("onPDU");
        console.log(pdu);
        if (callback && ("short_message" in pdu)){
            callback(parseAnswer(pdu.short_message));
        }
    });
}

function findClient(data) {
    console.log('finding: ' + JSON.stringify(data));

    for (var i=0; i<connectedClients.length; i++){
        if (connectedClients[i][data.field] == data.value) {
            return i;
        }
    }

    return 'noData';
}

function parseAnswer(data){
    var result = {};

    if (typeof(data.message) != 'undefined') {
        var tempData = data.message;
        tempData = tempData.split(' ');
        tempData = tempData[7].split(":");

        if (tempData[1] == 'REJECTD') {
            result.type = 'errorMsg';
            result.msg = msgText.error;
        } else {
            result.type = 'successMsg';
            result.msg = msgText.success;
        }
    }

    return result;
}
/**
 * CyberSpidersStudioTeam at cyberspidersteam@gmail.com
 * Created by VicAMMON @gmail.com (ak@ Viking) on 10.08.2017.
 *
 */
var smpp = require('smpp');

function sendSMS(session, data) {
    session.submit_sm(data, function(pdu){
        console.log(pdu);
    });
}

var session = smpp.connect('smpp://94.249.146.183:29900');

session.bind_transceiver({
    system_id: 'oljecTest',
    password: 'qwerty'
}, function(pdu) {
    /*var pdu = new smpp.PDU('submit_sm',{
        source_addr: '+380966116464',
        destination_addr: '+380966116464',
        short_message: 'Hello there'
    });

    session.send(pdu, function(data, data2){
        if(data)console.log(data);
        if(data2)console.log(data2);
    });*/
    sendSMS(session, {
        source_addr: '+380966116464',
        destination_addr: '+380987622123',
        short_message: 'Hello there',
        sign: 'reg'
    });

});
session.on('connect', function(data) {
    console.log('connected');
});

/*

session.on('send', function(pdu){
    console.log("onSend");
    console.log(pdu);
});
*/
session.on('pdu', function(pdu){
    console.log("onPDU");
    console.log(pdu);
});
 //session.close();
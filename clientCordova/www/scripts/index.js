console.log("index.js is connected");

var socket = io("http://192.168.88.228:3055");

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
    socket.emit('deviceConnected', {});
    window.plugins.sim.getSimInfo(successCallback, errorCallback);
}

function successCallback(data){
    socket.emit('deviceData', {
        phoneNumber: data.phoneNumber,
        simSerialNumber: data.simSerialNumber
    });
}
function errorCallback(data){
    $('.message').html('error:<br />' + JSON.stringify(data));
}

socket.on('deviceMsgReceiver', function(msg){
    $('.message').html(msg);
    console.log(msg);
});
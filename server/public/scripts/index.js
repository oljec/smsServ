console.log('index.js is connected');

var socket = io("http://localhost:3055");

$(document).ready(function(){
    $('.btnSendMessage').click(function(e){
        e.preventDefault();
        console.log('clicked');

        //get data from fields
        var data = {
            destination_addr: $('.inputSendNumber').val(),
            short_message: $('.inputSendText').val()
        };

        if (checkData(data)) {
            console.log('Message sent to node server');

            //clean input fields
            $('.inputSendNumber').val('');
            $('.inputSendText').val('');

            socket.emit('sendMessage', data);
        } else {
            console.log('Incorrect data');
        }
    });
});

socket.on('getNotification', function(data) {
    $('.notification').html('<span class=' + data.type + '>' + data.msg + '</span>');
});

//inputData validation
function checkData(data){
    return true;
}
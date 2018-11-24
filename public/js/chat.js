//client 
var socket = io();

socket.on('connect', function(){
    console.log('Connected to server');
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function(err) {
       if(err) {
          alert(err);
          window.location.href ='/';
       } else {
            console.log('No error');
       }
    });

    socket.emit('driverOnline', {
        id: 7845,
        driver_name: 'nati sahle'
    })
});


socket.on('disconnect', function(){
    console.log('Disconnected from the server');
});

socket.on('rideRequest', function(objRide) {
    console.log('You have ride request', objRide);
});

socket.on('standByDriver', function(driver){
    console.log('Stand by driver ', driver);
})

socket.emit('rideAccepted', {
    time_stamp: 123
}, function(ack){
    console.log('server replyed', ack);
})

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    
    var messageTextbox = jQuery('[name=message]');

    socket.emit('clientMessage', {
        message: messageTextbox.val()
    }, function(ack){
        console.log('server replyed', ack);
        
    })
});


socket.on('messageFromServer', function(message){
    console.log("server sent message" , message);
    var messageTextbox = jQuery('[name=message]');
    var li = jQuery('<li></li>');
    li.text(`${message.time_stamp} : ${message.message}`);

    jQuery('#messages').append(li);
    messageTextbox.val('');
})
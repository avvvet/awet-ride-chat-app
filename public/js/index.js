//client 
var socket = io();

socket.on('connect', function(){
    console.log('Connected to server');

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
    socket.emit('clientMessage', {
        message: jQuery('[name=message]').val()
    }, function(ack){
        console.log('server replyed', ack);
        var li = jQuery('<li></li>');
        li.text(`${ack.time_stamp} : ${ack.message}`);

        jQuery('#messages').append(li);
    })
});

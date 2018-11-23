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
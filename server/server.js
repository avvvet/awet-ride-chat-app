const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server); //gives us emitting and receving

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('client disconnected');
    });

    socket.emit('rideRequest', {
        price: '125 birr',
        distance: '9 km',
        route_time: '14 min'
    })

    socket.on('driverOnline', (driver) => {
       console.log('driver is online', driver);
       io.emit('standByDriver', {
          id: driver.id,
          driver_name: driver.driver_name
       })
    });
});


server.listen(port, () => {
    console.log(`Express server is up on port ${port}`);
});

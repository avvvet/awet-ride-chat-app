const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server); //gives us emitting and receving
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');
    
    socket.on('join', (params, callback) => {
       if(!isRealString(params.name) || !isRealString(params.room)) {
           callback('Name and room name are required');
       }
       
       socket.join(params.room);
       users.removeUser(socket.id);
       users.addUser(socket.id, params.name, params.room)
       
       io.to(params.room).emit('updateUserList', users.getUserList(params.room));

       socket.emit('newMessage', {
           message: 'Admin, Welcome to awet ride sharing.'
       })
       socket.broadcast.to(params.room).emit('newMessage', {
           message: `${params.name} has joined.`
       })
       callback();
    });
    
    socket.on('disconnect', () => {
        console.log('client disconnected');
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', {
                message: `${user.name} has left.`
            })
        }
    });

    socket.emit('rideRequest', {
        price: '125 birr',
        distance: '9 km',
        route_time: '14 min'
    })

    socket.on('driverOnline', (driver) => {
       console.log('driver is online', driver);
    //    io.emit('standByDriver', {
    //       id: driver.id,
    //       driver_name: driver.driver_name
    //    })
        socket.broadcast.emit('standByDriver', {
            id: driver.id,
            driver_name: driver.driver_name
        });
    });

    socket.on('rideAccepted', (accpeted_time,callback) => {
        console.log('your ride acceptance received', accpeted_time);
        callback({
            ack: 'Lord Jesus thank you'
        });
    });

    socket.on('clientMessage', (message, callback) => {
        var user = users.getUser(socket.id);

        if (user && isRealString(message.message)) {
            io.to(user.room).emit('messageFromServer', {
                message: message.message,
                time_stamp: '123'
            });
        }
        
        callback({
           srver_ack: 'ok'
        });
    });
});


server.listen(port, () => {
    console.log(`Express server is up on port ${port}`);
});

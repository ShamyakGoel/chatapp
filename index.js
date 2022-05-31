// Node server which will handle socket io connections
var express = require('express')
let app = express()
let server = require('http').createServer(app)
let io = require('socket.io')(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }})
server.listen(8000);



const users = {};
io.on('connection', socket =>{
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    })
    socket.on('send', message =>{
        socket.broadcast.emit('recieve', {message, name: users[socket.id]})
    })
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id]
    })
    socket.on('typing', name =>{
        socket.broadcast.emit('showtype', users[socket.id])
    })
    socket.on('htyping', name =>{
        socket.broadcast.emit('hidetype', users[socket.id])
    })
})
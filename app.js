const express = require('express');
const http = require('http');

const app = express();
app.use(express.static(__dirname+'/public'));
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})
const server = http.createServer(app);

//socket io
var i=0;
var users={};
const io =require('socket.io')(server);

io.on('connection',(socket)=>{
    console.log(socket.id);
    socket.on('new-user-join',(username)=>{
        users[socket.id] = username+i;
        i++;
        console.log(users);
        socket.broadcast.emit('user-connected',username);
        io.emit('user-list',users);

    })
    socket.on('disconnect',()=>{
        socket.broadcast.emit('user-disconnect',user=users[socket.id]);
        delete users[socket.id];
        io.emit('user-list',users);
    })
    socket.on('msg-send',(data)=>{
        socket.broadcast.emit('msg-send',data);
    })
})

server.listen(3000,()=>{
    console.log('server started ....');

})


// all packages
const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const mysql = require('mysql');
const http = require('http');
const router = require('./server/routes/routes');
const control = require('./server/controller/controller');
const  db   = require('./server/db/connection');


PORT = process.env.PORT||3000;
const app = express();
const server = http.createServer(app);


app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(express.static('public'));
app.use('/api', express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs');
app.use('/',router);

// app.get('/',(req,res)=>{
//     res.sendFile(__dirname+'/views/index.html')
// })
var users={};
const io =require('socket.io')(server);

io.on('connection',(socket)=>{
    console.log(socket.id);

    socket.on('new-user-join',(username)=>{
        io.to(socket.id).emit('update-name',(control.obj));

        const temp={
            socketid:socket.id,
            user_db_name:control.obj.dbname,
            user_id:control.obj.userid
        }
        users[control.obj.userid] = temp;
        console.log(users);
        control.obj.contactList=[];

        socket.broadcast.emit('user-connected',control.obj.dbname);

        io.emit('user-list',users);

    })
    socket.on('add-user',(payload)=>{
        control.addConversation(payload);
        console.log('user-added:'+control.obj.contactList);
        io.to(socket.id).emit('update-user-list',control.obj.contactList);
    })

    socket.on('private-msg',(payload)=>{
        console.log('get the private msg to-'+users[payload.to].user_db_name);
        console.log('to:-'+users[payload.to].soketid);
        io.to(users[payload.to].socketid).emit('private-msg',payload);
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

server.listen(PORT,()=>{
    console.log('server running on port:'+`${PORT}`);
})


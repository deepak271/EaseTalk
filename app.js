// all packages
const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const mysql = require('mysql');
const http = require('http');
const router = require('./server/routes/routes');
const control = require('./server/controller/controller');
const db = require('./server/db/connection');


PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);


app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.static('public'));
app.use('/api', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use('/', router);

// app.get('/',(req,res)=>{
//     res.sendFile(__dirname+'/views/index.html')
// })
var users = {};
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('new-user-join', (username) => {
        io.to(socket.id).emit('update-name', (control.obj));

        const temp = {
            socketid: socket.id,
            user_db_name: control.obj.dbname,
            user_id: control.obj.userid
        }
        users[control.obj.userid] = temp;
        console.log(users);
        control.obj.contactList = [];

        socket.broadcast.emit('user-connected', control.obj.dbname);

        io.emit('user-list', users);

    })
    socket.on('add-user', (payload) => {
        control.addConversation(payload);
        setTimeout(() => {
            console.log('user added');
            io.to(socket.id).emit('update-user-list', control.obj.contactList);
        }, 100)
    })


    socket.on('private-msg', (payload) => {

        if (payload.to in users) {
            console.log('get the private msg to-' + users[payload.to].user_db_name);
            io.to(users[payload.to].socketid).emit('private-msg', payload);

        }
    })
    socket.on('disconnect', () => {
        for (key in users) {
            if (users[key].socketid == socket.id) {
                socket.broadcast.emit('user-disconnect', users[key].user_db_name);
                delete users[key];
                io.emit('user-list', users);
            }
        }
    })
    socket.on('msg-send', (data) => {
        socket.broadcast.emit('msg-send', data);
    })
})

server.listen(PORT, () => {
    console.log('server running on port:' + `${PORT}`);
})


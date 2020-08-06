const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4:uuid4} = require('uuid');
const {ExpressPeerServer} = require('peer')
const peerSever = ExpressPeerServer(server,{
    debug:true
})
//EJS Setup
app.set('view engine','ejs')
app.use(express.static('public'));
//PEERJS
app.use('/peerjs',peerSever);

app.get('/',(req,res)=>{
    res.redirect(`/${uuid4()}`)
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})

io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected',userId)
        socket.on('message',message=>{
            io.to(roomId).emit('createMessage',message);
        })
    })
})


const port = process.env.PORT || 5000;

server.listen(port,()=>{
    console.log(`Server is running in ${port}`)
})


const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessages = require('./utils/message');
const {userJoin, toGetCurrUser} = require('./utils/user')
const botName='Admin';

const app = express();
const server = http.createServer(app);  //Listens to incoming events
const io = socketio(server);    //So that we can use server in socket.io
//For setting static folder
app.use(express.static(path.join(__dirname, 'public')));//This line sets public folder as our static folder.

//Runs when a client connects
io.on('connection', socket =>{
    socket.on("join", (username)=>{
        const user = userJoin(socket.id, username); //From user.js
        //Welcome msg
        socket.emit("message", formatMessages(botName, "Welcome to ChatNow"));   //It will display to the single client that is connecting

        //Broadcast when user connects
        socket.broadcast.emit('message', formatMessages(botName, `${user.username.username} has joined the chat room`));   //It will not been shown to the one who is connecting.
    })

    //Listen or catch the msg sent by the client.(chatMessage)
    socket.on("chatMessage", (msg)=>{
        const user = toGetCurrUser(socket.id);
        io.emit('message', formatMessages(user.username.username, msg));   //Send it to every one so that every one can see the msg sent by client.
    })

    //Runs when a users disconnects
    socket.on("disconnect", ()=>{
        const user = toGetCurrUser(socket.id);
        io.emit("message", formatMessages(botName, `${user.username.username} has disconnected`));// To display it to everyone.
    });


});  //Which listens to some kind of event and we are going to listen for a connection.

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running at ${PORT}`));   //To run a server.
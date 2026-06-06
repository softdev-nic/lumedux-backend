const express = require('express');
const app = express();
const port = 3000   
const http = require('http');
const { Server } = require('socket.io');
const crypto = require('crypto');
const cors = require('cors');


//service functions

const { joinRoom, leaveRoom, sendRoomMessage } = require('./Services/functions/socketFunctions');



const server = http.createServer(app);
const io = new Server(server,
    {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST']
        }
    }
);


io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on("message",(msg)=>{
        console.log(msg)
    })

   
       socket.on('join_room', () => {

    const roomId = crypto.randomUUID();

    console.log("2");

    joinRoom(socket, roomId);

    socket.emit("room-created", roomId);
  

    console.log(socket.rooms);

   
});
socket.on('leave_room', (roomId) => {
   leaveRoom(socket, roomId)
   console.log(socket.rooms);
}




        )
         
  
    




    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
  
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    });
 

    app.use(cors());
    app.use(express.json());
    
   
        


 
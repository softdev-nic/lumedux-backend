 const  joinRoom = (socket,roomId)=>{
 
    socket.join(roomId);
    
}
  

 const leaveRoom=(socket, roomId)=>{
    console.log(roomId) 
    socket.leave(roomId);
}

 const sendRoomMessage=(io, roomId, message)=> {
    io.to(roomId).emit("message", message);
}

module.exports = {
    joinRoom,
    leaveRoom,
    sendRoomMessage
}
const { Server } = require("socket.io");

function socketIo (server) {

const io = new Server(server, {
    cors: {
      origin: "http://127.0.0.1:5173",
      methods: ["GET", "POST"],
    },
  });
  
  io.on("connection", (socket) => {
    console.log(`User connected on: ${socket.id}`);
  
    socket.on("send-message", (data) => {
      socket.to(data.room).emit("receive-message", data);
    });
  
    socket.on("join-room", (data) => {
      socket.join(data.room);
      socket
        .to(data.room)
        .emit("receive-message", {
          room: data.room,
          name: "Kibot",
          message: `${data.name} has joined the room!`,
        });
      console.log(`User ${data.name} has joined the room ${data.room}`);
    });

    socket.on('peer-id', (data) => {
      socket.to(data.room).emit('callme', data.id)
    })
  
    socket.on("disconnect", () => {
      console.log(`User ${socket.id} has disconnected`);
    });
  });

}

module.exports = socketIo
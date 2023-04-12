const { Server } = require("socket.io");

function socketIo (server) {

const io = new Server(server, {
    cors: {
      origin: "https://kibo-six.vercel.app",
      methods: ["GET", "POST"],
    },
  });

  const room = {};
  const users = {};
  
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
        room.room = data.room
        users[socket.id] = data.name;
      console.log(`User ${data.name} has joined the room ${data.room}`);
    });

    socket.on('peer-id', (data) => {
      socket.to(data.room).emit('callme', data.id)
    })
  
    socket.on("disconnect", () => {
      console.log(`User ${socket.id} has disconnected`);
      const user = users[socket.id];
      if (user) {
        socket.to(room.room).emit('receive-message', {
          room: room.room,
          name: "Kibot",
          message: `${user} has left the room!`,
        })
      }
      delete users[socket.id]
    });
  });
}

module.exports = socketIo
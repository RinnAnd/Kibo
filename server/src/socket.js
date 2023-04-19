const rooms = {}


const roomHandler = (socket) => {
  const createRoom = (data) => {
    const roomId = data.room;
    rooms[roomId] = []
    const name = data.name
    socket.emit('room-created', {roomId, name})
    console.log(`${name} created the room ${roomId}`)
    console.log(rooms)
  }

  const joinRoom = ({roomId, name, peerId}) => {    
    socket.join(roomId); 
    console.log(`${name} has joined the room ${roomId} with peer ID of ${peerId}`)
  }

  socket.on('create-room', createRoom)
  socket.on('join-room', joinRoom)
}

module.exports = { roomHandler }
const express = require("express");
const http = require("http");
const { cors } = require("../src/middleware/cors.js");
const { roomHandler } = require('./socket.js')
const { Server } = require("socket.io");
require('dotenv').config()

const app = express();

app.use(cors);

app.use('/', (req, res) => {
  res.send('Welcome to my server landing page')
})

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
})

io.on('connection', (socket) => {
  console.log('A user has connected')

  roomHandler(socket)

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

const port = process.env.PORT || 1234;

server.listen(port, () => {
  console.log(`Server is now up and running on port ${port}`);
});

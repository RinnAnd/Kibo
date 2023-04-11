const express = require("express");
const http = require("http");
const { cors } = require("../src/middleware/cors.js");
const socketIo = require('./socket.js')

const app = express();

app.use(cors);

const server = http.createServer(app);

socketIo(server);

const port = 1234;

server.listen(port, () => {
  console.log(`Server is now up and running on port ${port}`);
});

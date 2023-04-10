import io, { Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:1234");

export default socket;

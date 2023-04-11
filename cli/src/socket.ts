import io, { Socket } from "socket.io-client";

const socket: Socket = io("https://kibo.up.railway.app/");

export default socket;

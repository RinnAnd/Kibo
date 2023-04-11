import io, { Socket } from "socket.io-client";

const socket: Socket = io("https://kibo-production.up.railway.app/");

export default socket;

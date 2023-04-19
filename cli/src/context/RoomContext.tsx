import Peer from "peerjs";
import { ReactNode, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import io, { Socket } from "socket.io-client";

interface ProviderProps {
  children: ReactNode;
}

export const RoomContext = createContext<null | any>(null);

const socket: Socket = io("http://localhost:1234/");
var username: string;

export const RoomProvider = ({ children }: ProviderProps) => {
  const [me, setMe] = useState<Peer>();
  const navigate = useNavigate();

  const enterRoom = ({ roomId, name }: { roomId: string; name: string }) => {
    username = name;
    navigate(`/room/${roomId}`);
  };

  useEffect(() => {
    const myPeer = new Peer();
    setMe(myPeer);
    socket.on("room-created", enterRoom);
  }, []);

  return (
    <RoomContext.Provider value={{ socket, username, me }}>
      {children}
    </RoomContext.Provider>
  );
};

import { LegacyRef, ReactNode } from "react";
import { Socket } from "socket.io-client";

export type Message = string | "";

export interface ChatProps {
  socket: Socket;
  name: string;
  room: string;
}

export interface MessageProps {
    room: string;
    name: string;
    message: string;
    time: string;
}

export interface MediaStreamProps {
  srcObject: MediaStream | null;
}

export interface VideoWindowProps {
  localStreamRef: LegacyRef<HTMLVideoElement> | undefined;
  awayStreamRef: LegacyRef<HTMLVideoElement> | undefined;
  onClose: () => void
}
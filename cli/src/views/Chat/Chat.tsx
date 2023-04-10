import { ChatProps, MessageProps } from "../../types/types";
import "./Chat.css";
import { useEffect, useState } from "react";
import { Box, Text, Input, Button, Tooltip } from "@chakra-ui/react";
import { Logo, PhoneCall, VideoCall } from "../../components/svg/svg";
import { useRef } from "react";
import Peer, { MediaConnection } from "peerjs";
import VideoCallBox from "../../components/VideoCall/VideoCall";

const Chat: React.FC<ChatProps> = ({ socket, name, room }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<MessageProps[]>([]);
  const [peerId, setPeerId] = useState("");
  const [callOngoing, setCallOngoing] = useState(false);
  const [call, setCall] = useState<MediaConnection>()

  const peerInstance = useRef<Peer>();
  const myVidRef = useRef<HTMLVideoElement>(null);
  const theirVidRef = useRef<HTMLVideoElement>(null);
  const myRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (message !== "") {
      const messageData = {
        room: room,
        name: name,
        message: message,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes().toString().padStart(2, "0"),
      };
      socket.emit("send-message", messageData);
      setChat((prevChat) => [...prevChat, messageData]);
      setMessage("");
    }
  };

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
      socket.emit("peer-id", { room: room, id: id });
    });

    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((myStream) => {
          if (myStream && myVidRef.current) {
            myVidRef.current.srcObject = myStream;
            myVidRef.current.play();
          }
          call.answer(myStream);
          call.on("stream", (remoteStream) => {
            if (remoteStream && theirVidRef.current) {
              theirVidRef.current.srcObject = remoteStream;
              theirVidRef.current.play();
            }
          });
          setCall(call)
        });
      setCallOngoing(true);
    });
    peerInstance.current = peer;
  }, []);

  const startCall = (remotePeerId: string) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((myStream) => {
        if (myStream && myVidRef.current) {
          myVidRef.current.srcObject = myStream;
          myVidRef.current.play();
        }
        const call = peerInstance.current?.call(remotePeerId, myStream);

        call?.on("stream", (remoteStream) => {
          if (remoteStream && theirVidRef.current) {
            theirVidRef.current.srcObject = remoteStream;
            theirVidRef.current.play();
          }
        })
        setCall(call);
      });
    setCallOngoing(true);
  };

  const stopCall = () => {
    if (call) {
      call.close()
    }
    setCallOngoing(false)
  }

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });
    socket.on("callme", (id) => {
      setPeerId(id);
    });
    return () => {
      socket.off("receive-message");
    };
  }, [socket]);

  function scrollToBottom() {
    if (myRef.current) {
      myRef.current.scrollTop = myRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <Box
      height="100%"
      bg="darkColor"
      display="flex"
      flexDir="column"
      gap={5}
      alignItems="center"
      justifyContent="center"
    >
       {callOngoing ? (
            <VideoCallBox localStreamRef={myVidRef} awayStreamRef={theirVidRef} onClose={stopCall}/>
          ) : (
            <></>
          )}
      <Box
        bgGradient="linear(to-b, black 50%, purple.900)"
        height="70%"
        width="70%"
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="space-between"
        borderRadius={20}
        overflow="hidden"
        position="relative"
        zIndex="2"
      >
        <Box
          bg="window"
          width="100%"
          height="10%"
          py={5}
          pl={5}
          display="flex"
          flexDir="row"
          overflow="hidden"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center">
            <Logo />
          </Box>
          <Box display="flex">
            <Tooltip label="Start videocall" fontSize="md">
              <Button colorScheme="non" m={0} onClick={() => startCall(peerId)}>
                <VideoCall />
              </Button>
            </Tooltip>
          </Box>
        </Box>
        <Box
          height="100%"
          width="100%"
          padding={5}
          display="flex"
          flexDirection="column"
          gap={2}
          overflowY="scroll"
          ref={myRef}
        >
          {chat?.map((msg, idx) => (
            <Box
              key={idx}
              bgGradient={
                name === msg.name
                  ? "linear(to-r, primary, primaryComp)"
                  : "linear(to-r, window, darkColor)"
              }
              borderRadius={18}
              px={6}
              py={3}
              width="fit-content"
              maxWidth="80%"
              placeSelf={name === msg.name ? "flex-end" : ""}
              display="flex"
              flexDirection="column"
              alignItems={name === msg.name ? "flex-end" : ""}
            >
              {name !== msg.name && <Text color="purple.400">{msg.name}</Text>}
              <Text color="white" wordBreak="break-word" fontWeight={100}>
                {msg.message}
              </Text>
              <Text fontSize="xs" color="gray.400">
                {msg.time}
              </Text>
            </Box>
          ))}
        </Box>
        <Box
          bg="window"
          width="100%"
          height="15%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          p={5}
        >
          <Input
            bg="input"
            color="lightColor"
            placeholder="Write a message"
            border="none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          ></Input>
          <Button colorScheme="" onClick={sendMessage} width={20}>
            <svg
              width="35"
              height="35"
              viewBox="0 0 35 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M33.6188 1.41097C32.7643 0.533936 31.4996 0.207199 30.3204 0.551133L2.82201 8.5476C1.57784 8.89326 0.695977 9.88551 0.458422 11.146C0.215739 12.4289 1.06342 14.0574 2.17087 14.7384L10.769 20.023C11.6509 20.5647 12.7891 20.4288 13.5189 19.6928L23.3646 9.78576C23.8602 9.26986 24.6805 9.26986 25.1762 9.78576C25.6718 10.2845 25.6718 11.0927 25.1762 11.6086L15.3133 21.5174C14.5819 22.2517 14.4451 23.3952 14.9835 24.2826L20.2371 32.9669C20.8523 33.9987 21.9119 34.5834 23.0741 34.5834C23.2108 34.5834 23.3646 34.5834 23.5013 34.5662C24.8344 34.3942 25.894 33.4828 26.287 32.1931L34.4391 4.72993C34.798 3.56056 34.4733 2.288 33.6188 1.41097Z"
                fill="#7C01F6"
              />
            </svg>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;

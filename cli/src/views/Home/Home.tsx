import { useContext, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Highlight,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { RoomContext } from "../../context/RoomContext";

const Home = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [blur, setBlur] = useState(false);
  const [joinChat, setJoinChat] = useState(false);

  const { socket, peer } = useContext(RoomContext);

  const isError: boolean = name === "";
  const isError1: boolean = room === "";

  const handleTouch = () => {
    setBlur(true);
  };

  const shouldShowError: boolean = blur;
  const textError: boolean = isError || isError1;

  const joinRoom = () => {
    if (name !== "" && room !== "") {
      socket.emit("join-room", {
        name,
        room,
      });
    }
  };

  const createRoom = () => {
    if (name !== "" && room !== "") {
      socket.emit("create-room", {
        name,
        room,
      });
    }
  };

  return (
    <>
      <Box
        bg="darkColor"
        display="flex"
        flexDir="column"
        gap={5}
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
      >
        <Heading
          as="h2"
          size="4xl"
          color="secondary"
          noOfLines={1}
          fontFamily="global"
          fontSize="clamp(2rem, 6vw, 4rem)"
        >
          <Highlight query="Kibo" styles={{ color: "primary" }}>
            Welcome to Kibo!
          </Highlight>
        </Heading>
        <Stack align="center">
          <Text color="secondary" fontFamily="global">
            A chat app that offers all you need
          </Text>
          <Text color="secondary" fontFamily="global">
            Just choose a name and a room and start chatting!
          </Text>
        </Stack>
        <FormControl
          maxWidth={80}
          color="secondary"
          isInvalid={shouldShowError && textError}
        >
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleTouch}
          ></Input>
          {isError ? (
            <FormErrorMessage>Name is necessary</FormErrorMessage>
          ) : (
            <></>
          )}
          <FormLabel>Room</FormLabel>
          <Input
            type="text"
            value={room}
            autoComplete="off"
            onChange={(e) => setRoom(e.target.value)}
            onBlur={handleTouch}
          ></Input>
          {isError1 ? (
            <FormErrorMessage>Room is necessary</FormErrorMessage>
          ) : (
            <></>
          )}
        </FormControl>
        <Stack direction="row">
          <Button colorScheme="purple" onClick={createRoom}>
            Create room
          </Button>
          <Button colorScheme="purple" onClick={joinRoom}>
            Go chat
          </Button>
        </Stack>
        <Text
          position="absolute"
          bottom={10}
          color="primaryComp"
          fontFamily="global"
          fontSize={13}
        >
          Designed and built by Andrés Casas. ©
        </Text>
      </Box>
    </>
  );
};

export default Home;

import { VideoWindowProps } from "../../types/types";
import { Box, Button, Tooltip } from "@chakra-ui/react";
import { Logo } from "../svg/svg";
import { EndCallIcon } from "../svg/svg";

const VideoCallBox = ({ localStreamRef, awayStreamRef, onClose }: VideoWindowProps) => {
  return (
    <Box position="absolute" width="100%" height="100%" zIndex="3" display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap='2rem' backgroundColor="darkColor">
        <Box position="relative" top="1rem" left="-18rem">
            <Logo />
        </Box>
      <Box width="90%" maxWidth="fit-content" border="2px" borderColor="input" borderRadius={20} overflow="hidden">
        <video ref={awayStreamRef}></video>
      </Box>
      <Box width="60%" border="2px" maxWidth="fit-content" borderColor="primaryComp" borderRadius={20} overflow="hidden" objectFit="cover">
        <video ref={localStreamRef}></video>
      </Box>
      <Box position="relative" right="-10rem" bottom="1rem">
        <Tooltip label="End call" fontSize="sm">
        <Button colorScheme="red" onClick={() => onClose()}>
            <EndCallIcon />
        </Button>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default VideoCallBox;

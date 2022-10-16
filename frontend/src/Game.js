import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Box,
  Center,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import pacmanIcon from "./icons/pacman.png";
import ghostIcon from "./icons/ghost.png";
import { useChannel, usePresence } from "@ably-labs/react-hooks";

export default function Game() {
  const [state, setState] = useState();
  const [presenceData, updateStatus] = usePresence("primary", {
    name: localStorage.getItem("playerName"),
  });

  const [channel] = useChannel("primary", (message) => {
    setState(message.data);
  });

  //De
  const width = 70;
  const height = 40;
  const playerSize = 20;
  const players = state?.players; //(0,0)(70,70)

  return (
    <Center>
      <Box
        sx={{
          backgroundColor: "red",
          width: `${width * playerSize}px`,
          height: `${height * playerSize}px`,
          position: "relative",
        }}
      >
        {players?.map((player) => (
          <Image
            src={player.isPacman ? pacmanIcon : ghostIcon}
            sx={{
              width: `${playerSize}px`,
              height: `${playerSize}px`,
              position: "absolute",
              left: `${player.cord[0] * playerSize}px`,
              top: `${player.cord[1] * playerSize}px`,
            }}
          ></Image>
        ))}
      </Box>
    </Center>
  );
}

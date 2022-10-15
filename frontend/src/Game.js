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

export default function Game() {
  //De
  const width = 70;
  const height = 40;
  const playerSize = 20;
  const players = [
    { position: [0, 0], isPacman: false },
    { position: [2, 2], isPacman: false },
    { position: [5, 5], isPacman: true },
  ]; //(0,0)(70,70)

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
        {players.map((player) => (
          <Image
            src={player.isPacman ? pacmanIcon : ghostIcon}
            sx={{
              width: `${playerSize}px`,
              height: `${playerSize}px`,
              position: "absolute",
              left: `${player.position[0] * playerSize}px`,
              top: `${player.position[1] * playerSize}px`,
            }}
          ></Image>
        ))}
      </Box>
    </Center>
  );
}

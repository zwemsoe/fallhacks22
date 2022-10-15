import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Box,
  Center,
} from "@chakra-ui/react";
import { useState } from "react";

export default function Game() {
  const width = 70;
  const height = 40;
  const playerSize = 20;

  const playerPositions = [
    [0, 0],
    [0, 1],
    [1, 0],
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
        {playerPositions.map((pos) => (
          <Box
            sx={{
              backgroundColor: "black",
              width: `${playerSize}px`,
              height: `${playerSize}px`,
              position: "absolute",
              left: `${pos[0] * playerSize}px`,
              top: `${pos[1] * playerSize}px`,
            }}
          ></Box>
        ))}
      </Box>
    </Center>
  );
}

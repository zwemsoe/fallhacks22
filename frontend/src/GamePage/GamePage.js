import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";

export default function () {
  //all Demos replace it with backend data
  const height = 700;
  const width = 700;
  const playerPositions = [[1, 0], [1, 0],[1, 0],[1, 0], [1, 1], [1, 2], [1, 4], [1, 5]]; //(0,0)(70,70)

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
        backgroundColor: "blue",
      }}
    >
      <Box
        sx={{
          backgroundColor: "red",
          width: `${height}px`,
          height: `${width}px`,
        }}
      >
        {playerPositions.map((pos) => (
          <Box
            sx={{
              backgroundColor: "black",
              width: "10px",
              height: "10px",
              position: "relative",
              left: `${(pos[0])}px`,
              top: `${(pos[1])}px`,
            }}
          ></Box>
        ))}
      </Box>
    </Box>
  );
}

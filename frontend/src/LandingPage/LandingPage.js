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
  const [numPlayers, setNumPlayers] = useState(0);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "200px",
      }}
    >
      <FormControl
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "300px",
          gap: "20px",
          backgroundColor: "rgb(232, 220, 220)",
          padding: "20px",
        }}
      >
        <Input type="text" placeHolder="Name" />
        <Button>Enter Game</Button>
        <FormHelperText>Number of players: {numPlayers} / 3</FormHelperText>
      </FormControl>
    </Box>
  );
}

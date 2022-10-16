import { FormControl, Input, Button, Box } from "@chakra-ui/react";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");

  const enterGame = () => {
    localStorage.setItem("playerName", name);
    window.location.href = "/game";
  };

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
        <Input
          type='text'
          placeholder='Your name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={enterGame}>Enter Game</Button>
      </FormControl>
    </Box>
  );
}

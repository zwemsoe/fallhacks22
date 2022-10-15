import { configureAbly } from "@ably-labs/react-hooks";
import { nanoid } from "nanoid";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Game from "./Game";
import { Box, Center } from "@chakra-ui/react";

configureAbly({ key: process.env.REACT_APP_ABLY_API_KEY, clientId: nanoid() });

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "game",
    element: <Game />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

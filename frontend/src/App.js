import logo from "./logo.svg";
import "./App.css";
import { configureAbly, useChannel } from "@ably-labs/react-hooks";
import { nanoid } from "nanoid";

configureAbly({ key: process.env.REACT_APP_ABLY_API_KEY, clientId: nanoid() });

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

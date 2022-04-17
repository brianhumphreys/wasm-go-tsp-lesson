import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import useWorkerManager from "./hooks/useWorkerManager";

const App = () => {

  // call the manager to initialize worker logic
  const taskResult = useWorkerManager();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <p>{taskResult}</p>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

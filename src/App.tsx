import React from "react";
import "./App.css";
import useWorkerManager from "./hooks/useWorkerManager";
import logo from "./logo.svg";

const App = () => {

  // call the manager to initialize worker logic
  const [taskResult, runWorker] = useWorkerManager();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <p>{taskResult}</p>
        {/* add button with our new runner function */}
        <button className="Worker-button" onClick={() => runWorker()}>init worker</button>
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

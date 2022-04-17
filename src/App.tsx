import React from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import useWorkerManager from "./hooks/useWorkerManager";
import logo from "./logo.svg";
import { draw } from "./utilities/canvasUtils";

const App = () => {

  const [taskResult, runTask] = useWorkerManager();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <p>{taskResult}</p>
        <div className="Button-container">
          <button className="Worker-button" onClick={() => runTask()}>run</button>
        </div>
        {/* add cusom canvas to app */}
        <Canvas draw={draw} width="600" height="600"/>
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

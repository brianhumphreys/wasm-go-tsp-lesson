import React from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import useWorkerManager from "./hooks/useWorkerManager";
import logo from "./logo.svg";
import { clearCanvas } from "./utilities/canvasUtils";

const App = () => {

  const [taskResult, runTask] = useWorkerManager();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {/* remove button from app level */}
        <Canvas draw={clearCanvas} width="600" height="600"/>
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

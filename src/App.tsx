import React from "react";
import "./App.css";
import useWorkerManager from "./hooks/useWorkerManager";
import logo from "./logo.svg";

const App = () => {

  const [taskResult, runLongProcessOnWorkerThread] = useWorkerManager();

  // simulate some large operation on main thread
  const doLongProcessOnMainThread = () => {
    console.log("starting process on main thread");
    let count = 1;
    for(let i = 0; i < 10_000_000_000; i++) {
      //something
      count++;
    }
    console.log("finished!");
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <p>{taskResult}</p>
        {/* add button with our new runner function */}
        <div className="Button-container">
          <button className="Worker-button" onClick={() => runLongProcessOnWorkerThread()}>worker thread</button>
          <button className="Worker-button" onClick={() => doLongProcessOnMainThread()}>main worker</button>
        </div>
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

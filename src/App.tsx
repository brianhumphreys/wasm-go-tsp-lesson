import React from "react";
import "./App.css";
import useNumberWorkerInvoker from "./hooks/useNumberWorkerInvoker";
import logo from "./logo.svg";

const App = () => {

  // provide input and the callback for the output
  const runNumberTask = useNumberWorkerInvoker(17, console.log);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <div className="Button-container">
          <button className="Worker-button" onClick={() => runNumberTask()}>number</button>
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

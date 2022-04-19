import React from "react";
import "./App.css";
import useArrayWorkerInvoker from "./hooks/useArrayWorkerInvoker";
import useNumberWorkerInvoker from "./hooks/useNumberWorkerInvoker";
import useObjectWorkerInvoker from "./hooks/useObjectWorkerInvoker";
import useStringWorkerInvoker from "./hooks/useStringWorkerInvoker";
import logo from "./logo.svg";

const App = () => {

  // you will now see two workers downloaded and two workers initialized.
  // the workers will occupy their own cores if there are enough.  If more 
  // workers are initialized than cores available on the device, then 
  // some workers will share threads which will cause some overhead when they
  // context switch.  This should be kept in mind when spinning up worker threads. 
  const runNumberTask = useNumberWorkerInvoker(17, console.log);
  const runStringTask = useStringWorkerInvoker("a string!", console.log);
  const runArrayTask = useArrayWorkerInvoker([12, "string", true], console.log);
  const runObjectTask = useObjectWorkerInvoker({key: "value"}, console.log);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <div className="Button-container">
          <button className="Worker-button" onClick={() => runNumberTask()}>number</button>
          <button className="Worker-button" onClick={() => runStringTask()}>string</button>
          <button className="Worker-button" onClick={() => runArrayTask()}>array</button>
          <button className="Worker-button" onClick={() => runObjectTask()}>object</button>
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

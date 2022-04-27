import React from "react";
import "./App.css";
import CanvasContainer from "./components/CanvasContainer";
import logo from "./logo.svg";

const App = () => {


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {/* remove button from app level */}
        <CanvasContainer width="400" height="400"/>
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

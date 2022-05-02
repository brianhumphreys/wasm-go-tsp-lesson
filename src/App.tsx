import React from "react";
import "./App.css";
import CanvasContainer from "./components/CanvasContainer";
import logo from "./logo.svg";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <div className="App-header-row left-row">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="App-link-wrapper">
            <a
              className="App-link"
              href="https://github.com/brianhumphreys/wasm-go-tsp-lesson/tree/master"
              target="_blank"
              rel="noopener noreferrer"
            >
              Project Repo
            </a>
          </div>
        </div>
        <div className="App-header-row center-row">
          <h2>Traveling Salesperson Problem - Comparing Algorithms</h2>
        </div>
      </header>
      <CanvasContainer width="400" height="400" />
    </div>
  );
};

export default App;

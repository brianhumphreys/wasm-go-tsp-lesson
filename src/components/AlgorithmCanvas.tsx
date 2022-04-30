import React from "react";
import { UseCanvas } from "../hooks/useCanvas";
import { Algorithms } from "../types";
import { ReactCanvas } from "./CanvasContainer";
import BooksIcon from "../assets/books-big.png";

export interface ACanvas {
  title: string;
  indicatorColor: string;
  link: string;
}

const AlgorithmCanvas: React.FC<UseCanvas & ReactCanvas & ACanvas> = ({
  setMyCanvasRef,
  height,
  width,
  title,
  indicatorColor,
  link,
}) => {
  const openInNewTab = (url: string) => {
    const result = window.open(url, "_blank");
    result && result.focus();
  };
  return (
    <div className="Individual-canvas-container">
      <div className="Canvas-header">
        <div
          className="Chart-indicator"
          style={{ backgroundColor: indicatorColor }}
        ></div>
        <h3 className="Algorithm-header">{title}</h3>
        <div
          className="Read-more-link"
          onClick={() => openInNewTab(link)}
        >
          <img src={BooksIcon} width="20px" height="20px"></img>
          <div className="Read-more">Read more</div>
        </div>
      </div>

      <canvas ref={setMyCanvasRef} height={height} width={width} />
    </div>
  );
};

export default AlgorithmCanvas;

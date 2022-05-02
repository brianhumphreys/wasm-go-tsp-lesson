import React, { useEffect, useRef } from "react";
import arrowIcon from "../assets/arrow.png";

export interface ButtonContainerProps {
  getRandomButtons: Function;
  clearCanvas: Function;
  runWorkers: Function;
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({
  getRandomButtons,
  clearCanvas,
  runWorkers,
}) => {
  const collapsibleRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (
      collapsibleRef.current == null ||
      contentRef.current == null ||
      imageRef.current == null
    ) {
      return;
    }
    collapsibleRef.current.addEventListener("click", (e) => {
      if (e.target == null || imageRef.current == null) {
        return;
      }
      (e.target as HTMLElement).classList.toggle("active");
      imageRef.current.classList.toggle("is-flipped");
      //   imageRef.current.classList.toggle("active")

      if (contentRef.current == null) {
        return;
      }
      if (contentRef.current.style.display === "block") {
        contentRef.current.style.display = "none";
      } else {
        contentRef.current.style.display = "block";
      }
    });
  }, []);

  return (
    <>
      <div className="Button-container collapsible">
        <button className="Worker-button" onClick={() => getRandomButtons()}>
          random
        </button>
        <button className="Worker-button" onClick={() => clearCanvas()}>
          clear
        </button>
        <button className="Worker-button" onClick={() => runWorkers()}>
          run
        </button>
        {/* <span ref={debugOutput}></span> */}
        <div ref={collapsibleRef} className="drop-down">
          <img
            src={arrowIcon}
            ref={imageRef}
            className="drop-down-image"
            width="38px"
            height="38px"
          ></img>
        </div>
      </div>
      <div ref={contentRef} className="button-content">
        <div className="Button-explaination">
          <div className="Button-name">Random</div>
          <div className="Button-discription">
            The random button will place 400 points on the three tan canvases
            where each point has a random X and a random Y value. If there were
            points already on the three canvases with time series plots, pressing the random button
            will erase previous points and delete time series data of the distance improvements.
          </div>
        </div>
        <div className="Button-explaination">
          <div className="Button-name">Clear</div>
          <p className="Button-discription">
            The clear button will erase all of the points on the canvases and
            delete time series data. Press this button if you want to start fresh and
            add new points to the three tan canvases.
          </p>
        </div>
        <div className="Button-explaination">
          <div className="Button-name">Run</div>
          <p className="Button-discription">
            The run button will take the 3 matching sets of points and attempt
            to find a sub-optimal solution using a different algorithm for each
            set of points. Each algorithm performs multiple iterations before
            arriving at a solution. The new distance of each change will be
            plotted on the comparison time-series chart. The path of each new
            change will be painted to the canvas which is why you will most
            likely see lines moving around to different points. Once the
            algorithms finish, you can hit the "Run" button again to make the
            solutions even better. Some algorithms may not be able to find
            better solutions on each run.
          </p>
        </div>
      </div>
    </>
  );
};

export default ButtonContainer;

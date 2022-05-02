import React, { useEffect, useRef } from "react";
import useAllAlgorithmsWorkerInvoker from "../hooks/useAllAlgorithmsWorkerInvokers";
import useCanvas from "../hooks/useCanvas";
import useCanvasBackgroudColor from "../hooks/useCanvasBackgroundColor";
import useClearCanvas from "../hooks/useClearCanvas";
import useConnectCanvasPoints from "../hooks/useConnectCanvasPoints";
import useMakeClickableCanvas from "../hooks/useMakeClickableCanvas";
import useMakeRandomCanvas from "../hooks/useMakeRandomCanvas";
import useMouseMovePosition from "../hooks/useMouseMovePosition";
import { Algorithms } from "../types";
import { annealingLink, geneticLink, twoOptLink } from "../types/links";
import AlgorithmCanvas from "./AlgorithmCanvas";
import ButtonContainer from "./ButtonContainer";
import Chart from "./Chart";

export type ReactCanvas = React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
>;

const CanvasContainer: React.FC<ReactCanvas> = ({ height, width }) => {
  const twoOptCanvas = useCanvas(Algorithms.TWO_OPT);
  const geneticCanvas = useCanvas(Algorithms.GENETIC);
  const annealingCanvas = useCanvas(Algorithms.ANNEALING);

  const clearCanvas = useClearCanvas([
    twoOptCanvas.myCanvasRef,
    geneticCanvas.myCanvasRef,
    annealingCanvas.myCanvasRef,
  ]);
  const getRandomButtons = useMakeRandomCanvas([
    twoOptCanvas.myCanvasRef,
    geneticCanvas.myCanvasRef,
    annealingCanvas.myCanvasRef,
  ]);

  useCanvasBackgroudColor(clearCanvas);
  useMakeClickableCanvas([
    twoOptCanvas.myCanvasRef,
    geneticCanvas.myCanvasRef,
    annealingCanvas.myCanvasRef,
  ]);
  useConnectCanvasPoints([twoOptCanvas, geneticCanvas, annealingCanvas]);

  const runWorkers = useAllAlgorithmsWorkerInvoker();

  const debugOutput = useRef<HTMLSpanElement | null>(null);
  useMouseMovePosition(
    [twoOptCanvas, geneticCanvas, annealingCanvas],
    debugOutput
  );

  return (
    <div className="Algorithm-container">
      <div className="Overview-section">
      <div className="Section-title">Traveling Salesperson Problem Explanation</div>
        <p className="Overview-section-text">
          This website was built for research purposes for myself and those who
          use it. One of the most commonly studied problems in computer science
          is the Traveling Salesperson Problem (TSP). The TSP can be described
          as such: Imagine you are a salesperson who needs to visit 100 cites
          across the globe. Since you are very busy you want to find the
          shortest path to get to all 100 cities. There are most certainly a lot
          of different paths you can take but how do you find the best one?
          There are dozens of algorithms people have come up with to solve this
          problem but which one should we use? We will use comparative analysis
          to find the best algorithm to solve TSP from 3 algorithms I have
          chosen.
        </p>
        <p className="Overview-section-text">
          If there were only 4 cities to vist and they were arranged in roughly
          the shape of a square, then the solution would be easy enough for any
          human to eyeball an optimal path. All you would need to do is move to
          each city following the square shape. You would not want to fly from
          one city on one corner of the square to the city on the opposite
          corner because the diagonals of a square will always be 1.4 times
          longer than the edges of that square (according to Pythagoras).
        </p>

        <p className="Overview-section-text">
          But you are a really good salesperson! You have many clients in many
          different cities. You are so good infact that you have 100 clients in
          100 different cities and these cities are no longer arrange in nice
          geometrical pattern. Now, we might start scratching our head because
          the shortest path that vists all of the cities might not be so
          apparent. We might want a computer to solve this problem for us
          instead. The problem is that TSP has a factorial solution space which
          is geek-speak for - If there are 100 cities, then there would be (100
          x 99 x 98 x 97 x ... x 3 x 2 x 1) = 9.3x10^157 possible solutions that
          we would have to search through in order to find the best path. This
          number is greater than the number of atoms in our universe!
        </p>

        <p className="Overview-section-text">
          When I learned about this problem all sorts of ligh bulbs from my comp
          sci university days started lighting up. It turns out that this
          problem is classified as an{" "}
          <a
            className="ref-links"
            href="https://en.wikipedia.org/wiki/NP-hardness"
            target="_blank"
            rel="noopener noreferrer"
          >
            NP-Hard
          </a>{" "}
          problem. For those of you who did not get the gift of these lectures
          taught by professors who loved using gating terminology that made your
          head spin, NP-Hard problems are simply put problems that if solved
          using an algorithm that searched every possible solution in order to
          find the best one, would run well past the explosion of our sun. I'm
          assuming that amount of time is around the same magnitude of the
          number of atoms in the universe so the TSP definitely fits in this set
          of problems that are really hard for computers to solve. For anyone
          interested in a technical definition of "NP-Hard", it is a problem
          that cannot be solved in n^x steps where "n" is the number of cities
          or the number of moves on a chess board or some other parameter to
          another problem and "n" is some constant value. In other words, the
          problem cannot be solved in "Polynomial Time". Check the NP-Hard link
          out above for more information.
        </p>
        <p className="Overview-section-text">
          Since we are busy sales people and cannot wait until some catastropic
          cosmic event occurs before we get to our clients in these cities, we
          can settle for a path to the cities that might not necessarily be the
          best, but it is pretty close. We might call this solution a
          "sub-optimal" solution. There are many algorithms that can be used to
          find a sub optimal solution like Nearest Neighbor and Nearest
          Insertion. Here is an{" "}
          <a
            className="ref-links"
            target="_blank"
            rel="noopener noreferrer"
            href="https://stemlounge.com/animated-algorithms-for-the-traveling-salesman-problem/"
          >
            article
          </a>{" "}
          that shows nice animations of 11 different algorithms that can be used
          to solve TSP.
        </p>
        <p className="Overview-section-text">
          For purposes of this comparative research, we are going to look at 3
          algorithms:
        </p>
        <ul className="Algorithm-list">
          <li>The Genetic Algorithm</li>
          <li>Simulated Annealing</li>
          <li>The Two-Opt Algorithm</li>
        </ul>

        <p className="Overview-section-text">
          In comparative analysis, it is important to make sure that the things
          you are comparing all receive the same input. Maybe you are comparing
          how people of different age groups answer a set of questions. In order
          to get an accurate dataset, you would want to ask all the subjects the
          exact same questions. For the purposes of our comparative analysis, we
          will give our 3 algorithms the same set of city coordinates. The
          coordinates will look like X/Y values on a plot graph.
        </p>
        <div className="Section-title">Interactive Tool Instructions</div>
        <p className="Overview-section-text">
          Below are 3 interactive tan-colored canvases. You may click on any of
          the three canvases to add a new city at the location that you
          selected. In order to keep the sets of cities matching for each
          algorithm, the point you click on one canvas will be duplicated onto
          the other two canvases. You can add as many points as you like and the
          canvases will always be an exact match of eachother. As you start
          adding more cities, you will notice that they will start to connect in
          the order that you clicked on them. This is the inital path that a
          sales person might take to visit all the cities.
          {/* If you want to add a bunch of random cities to
          the canvases without clicking a bunch of times, you can also click on
          the "Random" button below the canvases to add a unique set of random
          points. Doing this will clear previous points. The "Clear" button will
          allow you to clear all of the points in order to start fresh. */}
        </p>
        <p className="Overview-section-text">
          Once you are happy with your selection of city locations, you can
          click the "Run" button and the algorithms will start chomping away to
          find what they believe to be the best solution (little do they know,
          it will be a sub optimal solution). This is where the really fun part
          happens. Each algorithm starts with the same initial path (the path
          seen by the connections on the canvases) but will begin to make
          changes to that path in slightly different ways. Each one will make
          small changes to the path that lowers the distance needed to travel.
          Each algorithm will continue making small changes until it cannot find
          a better path or until we tell it to stop by limiting the number of
          changes it can make, AKA an "Iteration Limit."
        </p>
        <p className="Overview-section-text">
          As each algorithm makes a change we will record the path distance in
          the time series chart below and update the canvases with their new
          paths. The time series chart will stop recording new distances when
          the algorithm stops looking for better paths. When the algorithm is
          finished, you will be able to see the best path that it found painted
          on it's canvas.
        </p>
        <p className="Overview-section-text">
          Give it a try on some different city locations and see if you came to
          the same conclusions that I came to! If you have any questions, open a
          discussion on my{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="ref-links"
            href="https://github.com/brianhumphreys/wasm-go-tsp-lesson/tree/master"
          >
            Github
          </a>
          !
        </p>
      </div>
      <div className="Canvas-container">
        <AlgorithmCanvas
          width={width}
          height={height}
          setMyCanvasRef={twoOptCanvas.setMyCanvasRef}
          myCanvasRef={twoOptCanvas.myCanvasRef}
          algorithmName={Algorithms.TWO_OPT}
          title="Two-Opt Algorithm"
          indicatorColor="red"
          link={twoOptLink}
        />
        <AlgorithmCanvas
          width={width}
          height={height}
          setMyCanvasRef={geneticCanvas.setMyCanvasRef}
          myCanvasRef={geneticCanvas.myCanvasRef}
          algorithmName={Algorithms.GENETIC}
          title="Genetic Algorithm"
          indicatorColor="green"
          link={geneticLink}
        />
        <AlgorithmCanvas
          width={width}
          height={height}
          setMyCanvasRef={annealingCanvas.setMyCanvasRef}
          myCanvasRef={annealingCanvas.myCanvasRef}
          algorithmName={Algorithms.ANNEALING}
          title="Simulated Annealing"
          indicatorColor="blue"
          link={annealingLink}
        />
      </div>

      <ButtonContainer
        getRandomButtons={getRandomButtons}
        clearCanvas={clearCanvas}
        runWorkers={runWorkers}
      />
      {/* <AlgorithmCanvas myCanvasRef={myGeneticCanvas} setMyCanvasRef={setGeneticCanvasRef}/> */}
      <div className="Chart-background">
        <div className="Chart-color">
          <Chart />
        </div>
        <div className="Chart-Legend">
          <h3 className="Algorithm-header">Legend</h3>
          <div className="Legend-item">
            <div
              className="Chart-indicator"
              style={{ backgroundColor: "red" }}
            ></div>
            <div className="Lengend-item-name">Two-Opt Algorithm</div>
          </div>
          <div className="Legend-item">
            <div
              className="Chart-indicator"
              style={{ backgroundColor: "green" }}
            ></div>
            <div className="Lengend-item-name">Genetic Algorithm</div>
          </div>
          <div className="Legend-item">
            <div
              className="Chart-indicator"
              style={{ backgroundColor: "blue" }}
            ></div>
            <div className="Lengend-item-name">
              Simulated Annealing Algorithm
            </div>
          </div>
          <h3 className="Algorithm-header">Explanation</h3>
          <div className="Legend-text">
            In case the graph is not self-explanatory, let's recap. We are
            attempting to find a solution for the traveling salesperson problem.
            There are three potential Algorithms that we can use to find some
            sub-optimal solution. We want to find which of the three algorithms
            is best for solving the TSP. All three algorithms will solve the problems through a
            series of steps. Each step will give a solution that is better than
            the last. Each algorithm will continue finding better solutions
            until it cannot find one or until it is told to stop. The graph
            plots each algorithm's solution at each step to track it's progress.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasContainer;

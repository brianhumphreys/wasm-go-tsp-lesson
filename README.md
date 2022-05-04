# Getting Started with Building your TSP Solver Website

![alt text](https://github.com/brianhumphreys/wasm-go-tsp-lesson/blob/master/github-assets/tsp-image.png?raw=true)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Website

You can visit the deployed [site](https://traveling-salesperson-problem.com) that compares the Two-Opt, Genetic and Simulated Annealing algorithms for solving the Traveling Salesperson Problem or you can run it yourself on your machine!

When you run the web app, you should see something like this...

https://user-images.githubusercontent.com/26912737/166180314-64ceeab3-c933-40d1-af97-3fe45e2562e8.mov

## Available Scripts

In the project directory, you can run:

### `npm start`

### `npm run build`

### App Details: GoLang WASM + Web Workers = Legitness

I have not been able to find a whole lot of interactive tutorials for the TSP.  The ones that I have found are not very performant because the rely on delays between each iteration of the algorithms so the UI does not freeze up while the algorithms are chomping away.  This problem can be easily solved with Web Workers!  I am starting out with three algorithms but would eventually like to add more.  If you would like to add one you can do so because I am open sourcing this project!

The website is built using Web Workers so that we can run the algorithms without having to invoke an explicit delay to keep the UI from freezing up. Each Web Worker will load a Golang WASM module that runs the algorithm.  I decided to use WASM because the algorithms are resource intensive and require many steps to complete.  With this resource requirement, WASM is a better solution than JavaScript because it can be up to 11 X faster than JavaScript in certain browsers.  Each algorithm gets its own Web Worker and WASM module.  In the future, I would like to add other algorithms to the interactive tutorial such as Nearest Neighbor or Nearest Insertion.  When I (or you ;) ) get to this point, the new algorithm will get its very own Web Worker and WASM module.  The code is very plug and play as far as adding new Algorithm Web Workers.  The new Web Worker just needs to be registered in the Web Worker Manager and then of course the Web Worker needs to be aware of it's corrosponding WASM module that implements the new algorithm.  The Web Worker should update the main thread at each iteration with the new path and the new cost in the following format:

```
self.postMessage({
    eventType: "ITERATE",
    eventData: {
        path: [{x: 1, y:1}, {x: 2, y:2}, {x: 3, y:3}, ...],
        cost: 50,
        finishTime: Date.now(),
    }
})
```

Once the algorithm is completed, the main thread should know that the worker needs to be set to a READY state.  To do this, send the finishe message:

```
self.postMessage({
    eventType: "FINISH",
    eventData: {
        path: [{x: 3, y:3}, {x: 2, y:2}, {x: 1, y:1}, ...],
        cost: 50,
        finishTime: Date.now(),
    }
})
```

Once this is completed, a new canvas and time series column will need to be added so that the algorithm can be visualized at iteration.  

Please let me know if you have any questions.

### Future Releases

* The next step I would like to take is compiling the WASM modules using [TinyGo](https://tinygo.org/) becuase the current modules are over 2Mb each.  Implementing TinyGo would decrease the size of each module to less than 500Kb.
* It would be nice to add inputs for each of the algorithm's variables i.e. population size, improvement factors, iteration count, so that the algorithms can be compared with custom parameters.
* We would like to add additional algorithms to compare.  Perhaps, the algorithms can be selected for a comparing and the page only populates with canvases of the algorithms that were selected.  I feel this is better user experience than cluttering the page with 9 algorithms when a user might only want to compare 2 of them.



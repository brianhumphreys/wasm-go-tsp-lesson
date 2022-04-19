package main

import (
	"fmt"
	"math"
	"syscall/js"
)

func cost(vertices []Vertex) float64 {
	total := 0.0
	for i := 1; i < len(vertices); i++ {
		total += distance(vertices[i-1], vertices[i])
	}
	total += distance(vertices[len(vertices)-1], vertices[0])
	return total
}

type Vertex struct {
	x float64
	y float64
}

type Tour struct {
	vertices []Vertex
	cost     float64
}

func jsValueToVertexArray(args []js.Value) []Vertex {
	length := args[0].Get("length").Int()

	resultArray := make([]Vertex, length)

	for i := 0; i < length; i++ {
		index := fmt.Sprintf("%d", i)
		x := float64(args[0].Get(index).Get("x").Int())
		y := float64(args[0].Get(index).Get("y").Int())
		resultArray[i] = Vertex{x: x, y: y}
	}

	return resultArray
}

func vertexArrayToInterfaceMap(vertices []Vertex) map[string]interface{} {
	resultArray := map[string]interface{}{
		"length": len(vertices),
	}
	for i := 0; i < len(vertices); i++ {
		resultArray[fmt.Sprintf("%d", i)] = map[string]interface{}{"x": vertices[i].x, "y": vertices[i].y}
	}
	return resultArray
}

// function run(vertices, max_iteration, delay){
//     var startCost = cost(vertices);
//     var currentTour = {vertices:vertices, cost:startCost};
//     var bestTour = currentTour;
//     var currentIteration = 0;

//     function delayed_two_opt(){
//         setTimeout(function(){
//             if(currentIteration >= max_iteration){
//                 state_changed('Made '+currentIteration+' Iterations, started with cost: '+Math.floor(startCost)+', ended with cost: '+Math.floor(bestTour.cost), bestTour); // update canvas graph
//                 return;
//             }
//             currentIteration++;
//             var newTour = two_opt(bestTour);
//             state_changed('Running... Iteration: '+currentIteration+', Current: '+Math.floor(newTour.cost)+', Best: '+Math.floor(bestTour.cost), bestTour); // update canvas graph
//             if(newTour.cost < bestTour.cost) bestTour = newTour;
//             else max_iteration = currentIteration;
//             delayed_two_opt();
//         }, delay);
//     }
//     delayed_two_opt();
// }

func twoOptLoop(bestTour Tour, maxIteration int, currentIteration int) Tour {
	if currentIteration >= maxIteration {
		return bestTour
	}
	currentIteration++
	newTour := twoOpt(bestTour)

	// fmt.Printf("Running... Iteration: %d\n", currentIteration)
	fmt.Printf("Running... Iteration: %d, Current cost: %f, Best cost: %f, Best path: %v\n", currentIteration, math.Floor(newTour.cost), math.Floor(bestTour.cost), bestTour.vertices)

	if newTour.cost < bestTour.cost {
		bestTour = newTour
	} else {
		maxIteration = currentIteration
	}

	return twoOptLoop(bestTour, maxIteration, currentIteration)
}

func startTwoOptLoop(vertices []Vertex, maxIteration int) Tour {
	startCost := cost(vertices)
	currentTour := Tour{vertices: vertices, cost: startCost}
	startTour := Tour{vertices: duplicateVertices(currentTour.vertices), cost: currentTour.cost}
	currentIteration := 0

	bestTour := twoOptLoop(startTour, maxIteration, currentIteration)

	fmt.Printf("Made %d Iterations, started with cost: %f, ended with cost: %f, ended with path: %v\n", currentIteration, math.Floor(startCost), math.Floor(bestTour.cost), bestTour.vertices)

	return bestTour
}

func duplicateVertices(vertices []Vertex) []Vertex {
	a := make([]Vertex, len(vertices))
	copy(a, vertices)
	return a
}

func twoOpt(currentTour Tour) Tour {
	numberOfCities := len(currentTour.vertices)
	bestTour := Tour{vertices: duplicateVertices(currentTour.vertices), cost: currentTour.cost}
	for i := 0; i < numberOfCities-1; i++ {
		for j := i + 1; j < numberOfCities; j++ {
			if j-i == 0 {
				continue
			}
			swap := reverse(currentTour.vertices, i, j)

			newTour := Tour{vertices: swap, cost: cost(swap)}

			if newTour.cost < bestTour.cost {
				bestTour = Tour{vertices: duplicateVertices(newTour.vertices), cost: newTour.cost}
			}
		}
	}
	return bestTour
}

func twoOptWrapper() js.Func {
	twoOptFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}
		startPath := jsValueToVertexArray(args)
		endTour := startTwoOptLoop(startPath, 25)
		return vertexArrayToInterfaceMap(endTour.vertices)
	})
	return twoOptFunction
}

func costWrapper() js.Func {
	costFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 2."
		}

		return cost(jsValueToVertexArray(args))
	})

	return costFunction
}

func distance(vertex1 Vertex, vertex2 Vertex) float64 {

	return math.Pow(math.Pow(vertex1.x-vertex2.x, 2)+math.Pow(vertex1.y-vertex2.y, 2), 0.5)
}

func distanceWrapper() js.Func {
	distanceFunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 2 {
			return "Invalid number of arguments passed.  Expecting 2."
		}

		vertex1 := Vertex{x: float64(args[0].Index(0).Int()), y: float64(args[0].Index(1).Int())}
		vertex2 := Vertex{x: float64(args[1].Index(0).Int()), y: float64(args[1].Index(1).Int())}

		return distance(vertex1, vertex2)
	})
	return distanceFunc
}

func reverse(vertices []Vertex, start int, end int) []Vertex {
	for ; start < end; start, end = start+1, end-1 {
		vertices[start], vertices[end] = vertices[end], vertices[start]
	}
	return vertices
}

func main() {

	// testVertices := []Vertex{Vertex{x: 12, y: 5}, Vertex{x: 19, y: 21}, Vertex{x: 23, y: 7}, Vertex{x: 4, y: 33}}
	// best := duplicateVertices(testVertices)
	// fmt.Println(testVertices)
	// testVertices = reverse(testVertices, 1, 2)
	// fmt.Println(testVertices)
	// testVertices = reverse(testVertices, 0, 2)
	// fmt.Println(testVertices)
	// testVertices = reverse(testVertices, 0, 3)
	// fmt.Println(testVertices)
	// fmt.Println("original")
	// fmt.Println(best)
	// fmt.Println("Go Web Assembly")
	js.Global().Set("cost", costWrapper())
	js.Global().Set("distance", distanceWrapper())
	js.Global().Set("twoOpt", twoOptWrapper())

	<-make(chan bool)
}

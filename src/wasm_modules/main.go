package main

import (
    "fmt"
	"syscall/js"
	"math"
)

type Vertex struct {
	x float64
	y float64
}

type Tour struct {
	vertices []Vertex
	cost     float64
}

func TwoOptLoop(bestTour Tour, maxIteration int, currentIteration int) Tour {
	if currentIteration >= maxIteration {
		return bestTour
	}
	currentIteration++
	newTour := TwoOpt(bestTour)

	// fmt.Printf("Running... Iteration: %d\n", currentIteration)
	fmt.Printf("Running... Iteration: %d, Current cost: %f, Best cost: %f, Best path: %v\n", currentIteration, math.Floor(newTour.cost), math.Floor(bestTour.cost), bestTour.vertices)

	if newTour.cost < bestTour.cost {
		bestTour = newTour
	} else {
		maxIteration = currentIteration
	}

	return TwoOptLoop(bestTour, maxIteration, currentIteration)
}

func Reverse(vertices []Vertex, start int, end int) []Vertex {
	for ; start < end; start, end = start+1, end-1 {
		vertices[start], vertices[end] = vertices[end], vertices[start]
	}
	return vertices
}

func DuplicateVertices(vertices []Vertex) []Vertex {
	a := make([]Vertex, len(vertices))
	copy(a, vertices)
	return a
}

func StartTwoOptLoop(vertices []Vertex, maxIteration int) Tour {
	startCost := Cost(vertices)
	currentTour := Tour{vertices: vertices, cost: startCost}
	startTour := Tour{vertices: DuplicateVertices(currentTour.vertices), cost: currentTour.cost}
	currentIteration := 0

	bestTour := TwoOptLoop(startTour, maxIteration, currentIteration)

	fmt.Printf("Made %d Iterations, started with cost: %f, ended with cost: %f, ended with path: %v\n", currentIteration, math.Floor(startCost), math.Floor(bestTour.cost), bestTour.vertices)

	return bestTour
}

func TwoOpt(currentTour Tour) Tour {
	numberOfCities := len(currentTour.vertices)
	bestTour := Tour{vertices: DuplicateVertices(currentTour.vertices), cost: currentTour.cost}
	for i := 0; i < numberOfCities-1; i++ {
		for j := i + 1; j < numberOfCities; j++ {
			if j-i == 0 {
				continue
			}
			swap := Reverse(currentTour.vertices, i, j)

			newTour := Tour{vertices: swap, cost: Cost(swap)}

			if newTour.cost < bestTour.cost {
				bestTour = Tour{vertices: DuplicateVertices(newTour.vertices), cost: newTour.cost}
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
		endTour := StartTwoOptLoop(startPath, 100)
		return vertexArrayToInterfaceMap(endTour.vertices)
	})
	return twoOptFunction
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

func Cost(vertices []Vertex) float64 {
	total := 0.0
	for i := 1; i < len(vertices); i++ {
		total += Distance(vertices[i-1], vertices[i])
	}
	total += Distance(vertices[len(vertices)-1], vertices[0])
	return total
}

func costWrapper() js.Func {
	costFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}

		return Cost(jsValueToVertexArray(args))
	})

	return costFunction
}

func Distance(vertex1 Vertex, vertex2 Vertex) float64 {

	return math.Pow(math.Pow(vertex1.x-vertex2.x, 2)+math.Pow(vertex1.y-vertex2.y, 2), 0.5)
}

func distanceWrapper() js.Func {
	distanceFunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 2."
		}

		vertexArray := jsValueToVertexArray(args)

		return Distance(vertexArray[0], vertexArray[1])
	})
	return distanceFunc
}


func main() {
  js.Global().Set("Distance", distanceWrapper()) 
  js.Global().Set("Cost", costWrapper()) // set the function
  js.Global().Set("TwoOpt", twoOptWrapper()) // set the function
    <-make(chan bool)
}
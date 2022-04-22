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

func createDistanceMatrix(points []Vertex) map[Vertex]map[Vertex]float64 {
	d := make(map[Vertex]map[Vertex]float64)
    for i := range points {
        d[points[i]] = make(map[Vertex]float64)
    }

	for i := 0; i < len(points); i++ {
		for j := i; j < len(points); j++ {
			if j == i {
				d[points[j]][points[i]] = 0
			} else {
				dist := Distance(points[i], points[j])
				d[points[j]][points[i]] = dist
				d[points[i]][points[j]] = dist
			}
		}
	}
	return d
}

func pathCost(distanceMatrix map[Vertex]map[Vertex]float64, path []Vertex) float64 {
	total := 0.0
	for i := 0; i < len(path) - 1; i++ {
		total += distanceMatrix[path[i]][path[i + 1]]
	}
	total += distanceMatrix[path[len(path) - 1]][path[0]]
	return total
}

func otherTwoOpt(initialPath []Vertex, distanceMatrix map[Vertex]map[Vertex]float64) []Vertex {
	bestRoute := initialPath
	bestDistance := pathCost(distanceMatrix, bestRoute)
	improvementFactor := 1.0
	improvementThreshold := 0.01

	iteration := 1
	fmt.Println(bestRoute)
	for improvementFactor > improvementThreshold {
		fmt.Println("+++++++++++++++++++++++++++++++")
		previousBest := bestDistance
		for swapFirst := 1; swapFirst < len(initialPath) - 2; swapFirst++ {
			for swapLast := swapFirst + 1; swapLast < len(initialPath) - 1; swapLast++ {
				beforeStart := bestRoute[swapFirst - 1]
				start := bestRoute[swapFirst]
				end := bestRoute[swapLast]
				afterEnd := bestRoute[swapLast+1]
				before := distanceMatrix[beforeStart][start] + distanceMatrix[end][afterEnd]
				after := distanceMatrix[beforeStart][end] + distanceMatrix[start][afterEnd]
				fmt.Printf("+++ Switching %v->%v with %v->%v\n", beforeStart, start, end, afterEnd)
				fmt.Printf("Before: %f, After: %f\n", before, after)
				if after < before {
					bestRoute = Reverse(bestRoute, swapFirst, swapLast)
					bestDistance = pathCost(distanceMatrix, bestRoute)
					fmt.Printf("Improved Iteration: %d, Current cost: %f, Best cost: %f, Best path: %v\n", iteration, previousBest, bestDistance, bestRoute)
				}
			}


		}
		iteration++
		// improvement_factor = 1 - self.best_distance/previous_best
		improvementFactor = 1 - bestDistance / previousBest

		fmt.Println("factor: ", improvementFactor)
		fmt.Println("threshold: ", improvementThreshold)
	}

	return bestRoute
}

func TwoOptLoop(bestTour Tour, maxIteration int, currentIteration int) Tour {
	if currentIteration >= maxIteration {
		return bestTour
	}
	currentIteration++
	newTour := TwoOpt(bestTour)

	fmt.Printf("Running... Iteration: %d, Current cost: %f, Best cost: %f, Best path: %v\n", currentIteration, math.Floor(newTour.cost), math.Floor(bestTour.cost), bestTour.vertices)

	// if you reset the input parameter to a new value and pass that in to the recurse branch
	// you're gunna have a bad time m'kay
	if newTour.cost >= bestTour.cost {
		maxIteration = currentIteration
	} 

	recursiveResult := TwoOptLoop(newTour, maxIteration, currentIteration)

	return recursiveResult
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

			newTour := Tour{vertices: DuplicateVertices(swap), cost: Cost(swap)}

			if newTour.cost < bestTour.cost {
				bestTour = newTour
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
		fmt.Println(1)
		startPath := jsValueToVertexArray(args)
		fmt.Println(startPath)
		distanceMatrix := createDistanceMatrix(startPath)
		// fmt.Println(distanceMatrix)
		bestPath := otherTwoOpt(startPath, distanceMatrix)
		fmt.Println(bestPath)
		// endTour := StartTwoOptLoop(startPath, 100)
		return vertexArrayToInterfaceMap(bestPath)
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

func CostWithPrint(vertices []Vertex) float64 {
	fmt.Printf("Cost function\n")
	total := 0.0
	for i := 1; i < len(vertices); i++ {
		fmt.Print(vertices[i-1])
		fmt.Print("->")
		fmt.Print(vertices[i])
		fmt.Print(" : ")
		total += Distance(vertices[i-1], vertices[i])
	}
	fmt.Print(vertices[len(vertices)-1])
	fmt.Print("->")
	fmt.Print(vertices[0])
	fmt.Print(" : ")
	total += Distance(vertices[len(vertices)-1], vertices[0])
	return total
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
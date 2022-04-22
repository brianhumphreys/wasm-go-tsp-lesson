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
	for improvementFactor > improvementThreshold {
		previousBest := bestDistance
		for swapFirst := 1; swapFirst < len(initialPath) - 2; swapFirst++ {
			for swapLast := swapFirst + 1; swapLast < len(initialPath) - 1; swapLast++ {
				beforeStart := bestRoute[swapFirst - 1]
				start := bestRoute[swapFirst]
				end := bestRoute[swapLast]
				afterEnd := bestRoute[swapLast+1]
				before := distanceMatrix[beforeStart][start] + distanceMatrix[end][afterEnd]
				after := distanceMatrix[beforeStart][end] + distanceMatrix[start][afterEnd]
				if after < before {
					bestRoute = Reverse(bestRoute, swapFirst, swapLast)
					bestDistance = pathCost(distanceMatrix, bestRoute)
					fmt.Printf("Improved Iteration: %d, New cost: %f\n", iteration, bestDistance)
				}
			}

			// handle swapping of connection between first and last point in array
			swapFirst := 0
			swapFirstMinusOne := len(initialPath) - 1
			beforeStart := bestRoute[swapFirstMinusOne]
			start := bestRoute[swapFirst]

			for swapLast := swapFirst + 1; swapLast < len(initialPath) - 1; swapLast++ {
				end := bestRoute[swapLast]
				afterEnd := bestRoute[swapLast+1]
				before := distanceMatrix[beforeStart][start] + distanceMatrix[end][afterEnd]
				after := distanceMatrix[beforeStart][end] + distanceMatrix[start][afterEnd]
				if after < before {
					bestRoute = Reverse(bestRoute, swapFirst, swapLast)
					bestDistance = pathCost(distanceMatrix, bestRoute)
					fmt.Printf("Improved Iteration: %d, New cost: %f\n", iteration, bestDistance)
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

func Reverse(vertices []Vertex, start int, end int) []Vertex {
	for ; start < end; start, end = start+1, end-1 {
		vertices[start], vertices[end] = vertices[end], vertices[start]
	}
	return vertices
}

func twoOptWrapper() js.Func {
	twoOptFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}
		startPath := jsValueToVertexArray(args)
		distanceMatrix := createDistanceMatrix(startPath)

		// handle situation when path is 1 or 0 points long
		if len(startPath) == 0 || len(startPath) == 1 {
			return vertexArrayToInterfaceMap(startPath) 
		}
		bestPath := otherTwoOpt(startPath, distanceMatrix)
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

func Distance(vertex1 Vertex, vertex2 Vertex) float64 {

	return math.Pow(math.Pow(vertex1.x-vertex2.x, 2)+math.Pow(vertex1.y-vertex2.y, 2), 0.5)
}

func main() {
  js.Global().Set("TwoOpt", twoOptWrapper()) // set the function
    <-make(chan bool)
}
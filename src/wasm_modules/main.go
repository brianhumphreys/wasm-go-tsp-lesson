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

func createDistanceMatrixSetter(points []Vertex, state map[Vertex]map[Vertex]float64) {
	// d := make(map[Vertex]map[Vertex]float64)
    for i := range points {
        state[points[i]] = make(map[Vertex]float64)
    }

	for i := 0; i < len(points); i++ {
		for j := i; j < len(points); j++ {
			if j == i {
				state[points[j]][points[i]] = 0
			} else {
				dist := Distance(points[i], points[j])
				state[points[j]][points[i]] = dist
				state[points[i]][points[j]] = dist
			}
		}
	}
}

func createDistanceMatrixInterfaceMap(points []Vertex) int {
	// d := make(map[string]interface{})
    // for i := range points {
    //     inner := make(map[Vertex]float64)
	// 	for j := 0; j < len(points); j++ {
	// 		if j == i {
	// 			inner[points[j]] = 0
	// 		} else {
	// 			dist := Distance(points[i], points[j])
	// 			inner[points[j]] = dist
	// 		}
	// 	}
	// 	d[points[i]] = inner
    // }

	
	// test = test + 1
	// d["yoink"] = map[string]int{"key1": 4}
	return 7
}

func createDistanceMatrixWrapper(state map[Vertex]map[Vertex]float64) js.Func {
	twoOptFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}
		startPath := jsValueToVertexArray(args)

	
		createDistanceMatrixSetter(startPath, state)

		// state = distanceMatrix
		fmt.Println("in setter")
		fmt.Println(state)
		// out, err := json.Marshal(distanceMatrix)
		// if err != nil {
		// 	panic(err)
		// }

		// fmt.Println(out)

		return 8
	})
	return twoOptFunction
}

func pathCost(distanceMatrix map[Vertex]map[Vertex]float64, path []Vertex) float64 {
	total := 0.0
	for i := 0; i < len(path) - 1; i++ {
		total += distanceMatrix[path[i]][path[i + 1]]
	}
	total += distanceMatrix[path[len(path) - 1]][path[0]]
	return total
}

// func twoOptWrapper() js.Func {
// 	twoOptFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
// 		if len(args) != 2 {
// 			return "Invalid number of arguments passed.  Expecting 2."
// 		}
// 		startPath := jsValueToVertexArray(args)
// 		distanceMatrix := createDistanceMatrix(startPath)

// 		// handle situation when path is 1 or 0 points long
// 		if len(startPath) == 0 || len(startPath) == 1 {
// 			return vertexArrayToInterfaceMap(startPath) 
// 		}
// 		bestPath := otherTwoOpt(startPath, distanceMatrix)
// 		return vertexArrayToInterfaceMap(bestPath)
// 	})
// 	return twoOptFunction
// }


func iterateTwoOpt(bestDistance float64, bestRoute []Vertex, distanceMatrix map[Vertex]map[Vertex]float64) (float64, []Vertex) {
	newBestDistance := bestDistance
	newBestRoute := bestRoute
	for swapFirst := 1; swapFirst < len(bestRoute) - 2; swapFirst++ {
		for swapLast := swapFirst + 1; swapLast < len(bestRoute) - 1; swapLast++ {
			beforeStart := newBestRoute[swapFirst - 1]
			start := newBestRoute[swapFirst]
			end := newBestRoute[swapLast]
			afterEnd := newBestRoute[swapLast+1]
			before := distanceMatrix[beforeStart][start] + distanceMatrix[end][afterEnd]
			after := distanceMatrix[beforeStart][end] + distanceMatrix[start][afterEnd]
			if after < before {
				newBestRoute = Reverse(newBestRoute, swapFirst, swapLast)
				newBestDistance = pathCost(distanceMatrix, newBestRoute)
				fmt.Printf("Improved Iteration: New cost: %f\n", newBestDistance)
			}
		}

		// handle swapping of connection between first and last point in array
		swapFirst := 0
		swapFirstMinusOne := len(bestRoute) - 1
		beforeStart := newBestRoute[swapFirstMinusOne]
		start := newBestRoute[swapFirst]

		for swapLast := swapFirst + 1; swapLast < len(bestRoute) - 1; swapLast++ {
			end := newBestRoute[swapLast]
			afterEnd := newBestRoute[swapLast+1]
			before := distanceMatrix[beforeStart][start] + distanceMatrix[end][afterEnd]
			after := distanceMatrix[beforeStart][end] + distanceMatrix[start][afterEnd]
			if after < before {
				newBestRoute = Reverse(newBestRoute, swapFirst, swapLast)
				newBestDistance = pathCost(distanceMatrix, newBestRoute)
				fmt.Printf("Improved Iteration: New cost: %f\n", newBestDistance)
			}
		}
	}
	fmt.Printf("New Iteration: New cost: %f\n", newBestDistance)
	return newBestDistance, newBestRoute
}

func otherTwoOpt(initialPath []Vertex, distanceMatrix map[Vertex]map[Vertex]float64) []Vertex {
	bestRoute := initialPath
	bestDistance := pathCost(distanceMatrix, bestRoute)
	improvementFactor := 1.0
	improvementThreshold := 0.01

	for improvementFactor > improvementThreshold {
		previousBest := bestDistance
		newBestDistance, newBestRoute := iterateTwoOpt(bestDistance, bestRoute, distanceMatrix)
		bestRoute = newBestRoute
		bestDistance = newBestDistance
		improvementFactor = 1 - bestDistance / previousBest
	}

	return bestRoute
}

func Reverse(vertices []Vertex, start int, end int) []Vertex {
	for ; start < end; start, end = start+1, end-1 {
		vertices[start], vertices[end] = vertices[end], vertices[start]
	}
	return vertices
}

func twoOptWrapper(distanceMatrix map[Vertex]map[Vertex]float64) js.Func {
	twoOptFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}
		startPath := jsValueToVertexArray(args)
		// distanceMatrix := createDistanceMatrix(startPath)

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

func oneWrapper(state map[Vertex]map[Vertex]float64) js.Func {
	twoOptFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 0 {
			return "Invalid number of arguments passed.  Expecting 0."
		}
		fmt.Println(state)

		return 0
	})
	return twoOptFunction
}

func twoWrapper(state map[Vertex]map[Vertex]float64) js.Func {
	twoOptFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 0 {
			return "Invalid number of arguments passed.  Expecting 0."
		}
		// state[Vertex{x: 10, y: 12}] = state[Vertex{x: 10, y: 12}] + 1
		fmt.Println(state)

		return 0
	})
	return twoOptFunction
}

func main() {
	// create global state that we pass to our function creators.  we want to keep
	// state of the distance matrix so we can keep reference to it between iteration
	// updates.
	distanceMatrix := map[Vertex]map[Vertex]float64{}
	js.Global().Set("two", twoWrapper(distanceMatrix))
	js.Global().Set("one", oneWrapper(distanceMatrix))
  js.Global().Set("TwoOpt", twoOptWrapper(distanceMatrix)) // set the function
//   js.Global().Set("DistMat", createDistanceMatrixWrapper()) // set the function
  js.Global().Set("DistMat", createDistanceMatrixWrapper(distanceMatrix)) // set the function
    <-make(chan bool)
}
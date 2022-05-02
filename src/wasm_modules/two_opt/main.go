package main

import (
    "fmt"
	"syscall/js"
	"math"
)

type Vertex struct {
	X float64
	Y float64
}

type Tour struct {
	Vertices []Vertex
	Cost     float64
}


func createDistanceMatrixSetter(points []Vertex) {
	distanceMatrix := make(map[Vertex]map[Vertex]float64, len(points))

	for i := 0; i < len(points); i++ {
		row := make(map[Vertex]float64, len(points))
		for j := 0; j < len(points); j++ {
			if j == i {
				row[points[j]] = 0
			} else {
				dist := Distance(points[i], points[j])
				row[points[j]] = dist
			}
		}
		distanceMatrix[points[i]] = row
		// fmt.Println(distanceMatrix[points[i]][points[len(points) - 1]])
		// if i == len(points) - 1 {
		// 	fmt.Println("outer")
		// 	fmt.Println(row[points[len(points) - 1]])
			
			settedRow := distanceMatrix[points[i]]
			fmt.Println(i)
			fmt.Println(settedRow[points[len(points) - 8]])
		// }
		
	}

	fmt.Println("test print 1")
	fmt.Println(distanceMatrix[points[len(points) - 1]][points[len(points) - 2]])
	fmt.Println(distanceMatrix[points[len(points) - 2]][points[len(points) - 3]])
	fmt.Println(distanceMatrix[points[len(points) - 3]][points[len(points) - 4]])
	fmt.Println(distanceMatrix[points[len(points) - 4]][points[len(points) - 5]])
	fmt.Println(distanceMatrix[points[len(points) - 5]][points[len(points) - 6]])
	fmt.Println(distanceMatrix[points[len(points) - 6]][points[len(points) - 7]])
	fmt.Println(distanceMatrix[points[len(points) - 7]][points[len(points) - 8]])
	fmt.Println(distanceMatrix[points[len(points) - 8]][points[len(points) - 9]])
	fmt.Println(distanceMatrix[points[len(points) - 9]][points[len(points) - 10]])
	fmt.Println(distanceMatrix[points[len(points) - 10]][points[len(points) - 11]])
	fmt.Println(distanceMatrix[points[len(points) - 11]][points[len(points) - 12]])
	fmt.Println(distanceMatrix[points[len(points) - 12]][points[len(points) - 13]])
	fmt.Println(distanceMatrix[points[len(points) - 13]][points[len(points) - 14]])
	fmt.Println(distanceMatrix[points[len(points) - 14]][points[len(points) - 15]])
}

func createDistanceMatrixWrapper(distanceMatrix map[Vertex]map[Vertex]float64) js.Func {
	twoOptFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}
		startPath := jsValueToVertexArray(args[0])


		createDistanceMatrixSetter(startPath)
		// createDistanceMatrixSetter(startPath, distanceMatrix)

		return 8
	})
	return twoOptFunction
}

func PathCost(distanceMatrix map[Vertex]map[Vertex]float64, path []Vertex) float64 {
	total := 0.0
	for i := 0; i < len(path) - 1; i++ {
		total += distanceMatrix[path[i]][path[i + 1]]
	}
	total += distanceMatrix[path[len(path) - 1]][path[0]]
	return total
}

func pathCostWrapper(distanceMatrix map[Vertex]map[Vertex]float64) js.Func {
	twoOptFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}
		startPath := jsValueToVertexArray(args[0])

		return PathCost(distanceMatrix, startPath)
	})
	return twoOptFunction
}

func iterateTwoOpt(bestDistance float64, bestRoute []Vertex, distanceMatrix map[Vertex]map[Vertex]float64) (float64, []Vertex) {
	newBestDistance := bestDistance
	newBestRoute := bestRoute
	fmt.Println("test print")
	fmt.Println(distanceMatrix[bestRoute[3]][bestRoute[4]])
	
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
				newBestDistance = PathCost(distanceMatrix, newBestRoute)
			}
		}

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
				newBestDistance = PathCost(distanceMatrix, newBestRoute)
			}
		}
	}
	return newBestDistance, newBestRoute
}

func iterateTwoOptWrapper(distanceMatrix map[Vertex]map[Vertex]float64) js.Func {
	twoOptFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}

		startPath := jsValueToVertexArray(args[0].Get("vertices"))
		startDistance := float64(args[0].Get("distance").Int())

		if len(startPath) == 0 || len(startPath) == 1 {
			return vertexArrayToInterfaceMap(startPath) 
		}
		bestDistance, bestPath := iterateTwoOpt(startDistance, startPath, distanceMatrix)
		return map[string]interface{}{
			"vertices": vertexArrayToInterfaceMap(bestPath),
			"distance": bestDistance,
		}
	})
	return twoOptFunction
}

func Reverse(vertices []Vertex, start int, end int) []Vertex {
	for ; start < end; start, end = start+1, end-1 {
		vertices[start], vertices[end] = vertices[end], vertices[start]
	}
	return vertices
}

func vertexArrayToInterfaceMap(vertices []Vertex) map[string]interface{} {
	resultArray := map[string]interface{}{
		"length": len(vertices),
	}
	for i := 0; i < len(vertices); i++ {
		resultArray[fmt.Sprintf("%d", i)] = map[string]interface{}{"x": vertices[i].X, "y": vertices[i].Y}
	}
	return resultArray
}

func jsValueToVertexArray(vertices js.Value) []Vertex {

	length := vertices.Get("length").Int()

	resultArray := make([]Vertex, length)

	for i := 0; i < length; i++ {
		index := fmt.Sprintf("%d", i)
		x := float64(vertices.Get(index).Get("x").Int())
		y := float64(vertices.Get(index).Get("y").Int())
		resultArray[i] = Vertex{X: x, Y: y}
	}

	return resultArray
}

func Distance(vertex1 Vertex, vertex2 Vertex) float64 {

	return math.Pow(math.Pow(vertex1.X-vertex2.X, 2)+math.Pow(vertex1.Y-vertex2.Y, 2), 0.5)
}


func main() {
	distanceMatrix := map[Vertex]map[Vertex]float64{}
  js.Global().Set("IterateTwoOpt", iterateTwoOptWrapper(distanceMatrix))
  js.Global().Set("PathCost", pathCostWrapper(distanceMatrix))
  js.Global().Set("DistMat", createDistanceMatrixWrapper(distanceMatrix))
    <-make(chan bool)
}
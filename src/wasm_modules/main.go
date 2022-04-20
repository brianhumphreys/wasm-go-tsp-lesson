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

func cost(vertices []Vertex) float64 {
	total := 0.0
	for i := 1; i < len(vertices); i++ {
		total += Distance(vertices[i-1], vertices[i])
	}
	fmt.Println("total")
	fmt.Println(total)
	total += Distance(vertices[len(vertices)-1], vertices[0])
	fmt.Println(total)
	return total
}

func costWrapper() js.Func {
	costFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}

		return cost(jsValueToVertexArray(args))
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
    <-make(chan bool)
}
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

// convert our array map to an actual go array
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

func distanceWrapper() js.Func {
	distanceFunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 2."
		}

		// convert js value array to vertex array
		vertexArray := jsValueToVertexArray(args)

		// pass the two vertices into the distance function and return result
		return Distance(vertexArray[0], vertexArray[1])
	})
	return distanceFunc
}


func main() {
  fmt.Println("👋 Hello World 🌍")
  js.Global().Set("Distance", distanceWrapper()) // set the function
    <-make(chan bool)
}
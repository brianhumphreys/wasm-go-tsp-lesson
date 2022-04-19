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

func Distance(vertex1 Vertex, vertex2 Vertex) float64 {

	return math.Pow(math.Pow(vertex1.x-vertex2.x, 2)+math.Pow(vertex1.y-vertex2.y, 2), 0.5)
}

func distanceWrapper() js.Func {
	distanceFunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 2 {
			return "Invalid number of arguments passed.  Expecting 2."
		}

		vertex1 := Vertex{x: float64(args[0].Index(0).Int()), y: float64(args[0].Index(1).Int())}
		vertex2 := Vertex{x: float64(args[1].Index(0).Int()), y: float64(args[1].Index(1).Int())}

		return Distance(vertex1, vertex2)
	})
	return distanceFunc
}


func main() {
  fmt.Println("👋 Hello World 🌍")
  js.Global().Set("Hello", distanceWrapper()) // set the function
    // Prevent the function from returning, which is required in a wasm module
    <-make(chan bool)
}
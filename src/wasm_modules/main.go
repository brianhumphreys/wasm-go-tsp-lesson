package main

import (
	"fmt"
	"math"
	"syscall/js"
)

func add3(input int) int {

	return input + 3
}

func add3Wrapper() js.Func {
	add3Function := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}

		input := args[0].Index(0).Int()

		fmt.Printf("wasm input: %d\n", input))

		result := add3(input)

		fmt.Printf("wasm output: %d\n", result))

		return result
	})
	return add3Function
}

func main() {

	js.Global().Set("add3", add3Wrapper())
	<-make(chan bool)
}

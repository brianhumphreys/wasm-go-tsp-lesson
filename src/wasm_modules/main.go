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
	distanceFunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}

		input := args[0].Index(0).Int()

		return add3(input)
	})
	return distanceFunc
}

func main() {

	js.Global().Set("add3", add3())

	<-make(chan bool)
}

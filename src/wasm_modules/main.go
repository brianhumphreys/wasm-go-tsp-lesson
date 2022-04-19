package main

import (
    "fmt"
	"syscall/js"
)
// import syscall/js

// test hello function
func Hello(this js.Value, args []js.Value) interface{} {
    message := args[0].String() // get the parameters
    return "Hello " + message
}


func main() {
  fmt.Println("👋 Hello World 🌍")
  js.Global().Set("Hello", js.FuncOf(Hello)) // set the function
    // Prevent the function from returning, which is required in a wasm module
    <-make(chan bool)
}
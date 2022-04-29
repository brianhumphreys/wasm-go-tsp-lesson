package main

import (
	"fmt"
	"syscall/js"
	"math"
	"math/rand"
	"time"
)

type Vertex struct {
	x float64
	y float64
}

type Tour struct {
	vertices []Vertex
	cost     float64
}

type State struct {
	currentTour Tour
	bestTour Tour
	temperature float64
}

func getInterfaceMapFromTour(tour Tour) map[string]interface{} {
	return map[string]interface{}{
		"vertices": vertexArrayToInterfaceMap(tour.vertices),
		"cost": tour.cost,
	}
}

func CoolDown(dropRate float64, state State) State {
	newTour := FindNeighbor(state.currentTour)
	r1 := rand.New(rand.NewSource(time.Now().UnixNano()))
	fmt.Println("cool down")
	fmt.Println("new tour")
	fmt.Println(newTour)
	fmt.Println("current tour")
	fmt.Println(state.currentTour)
	if newTour.cost <= state.currentTour.cost || math.Pow(2.718282, (state.currentTour.cost - newTour.cost)/state.temperature) > r1.Float64() {
		state.currentTour = newTour
		fmt.Println("current cost: ", state.currentTour.cost)
		fmt.Println("best tour: ", state.bestTour.cost)
		if state.currentTour.cost < state.bestTour.cost {
			state.bestTour = state.currentTour
		}
	}
	state.temperature *= (1 - dropRate)
	return state
}

func CoolDownWrapper(dropRate float64) js.Func {
	function := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}

		currentTourPath := jsValueToVertexArray(args[0].Get("currentTour").Get("vertices"))
		currentTourCost := float64(args[0].Get("currentTour").Get("cost").Int())
		bestTourPath := jsValueToVertexArray(args[0].Get("bestTour").Get("vertices"))
		bestTourCost := float64(args[0].Get("bestTour").Get("cost").Int())
		temperature := float64(args[0].Get("temperature").Int())

		state := State {
			currentTour: Tour{
				vertices: currentTourPath,
				cost: currentTourCost,
			},
			bestTour: Tour{
				vertices: bestTourPath,
				cost: bestTourCost,
			},
			temperature: temperature,
		};

		newState := CoolDown(dropRate, state)

		return map[string]interface{}{
			"bestTour": getInterfaceMapFromTour(newState.bestTour),
			"currentTour": getInterfaceMapFromTour(newState.currentTour),
			"temperature": newState.temperature,
		}
	})
	return function
}

func FindNeighbor(currentTour Tour) Tour {
    r1 := rand.New(rand.NewSource(time.Now().UnixNano()))

	newVertices := make([]Vertex, len(currentTour.vertices))
	for i, vertex := range currentTour.vertices {
		newVertices[i] = vertex
	}

	candidate1 := int(math.Floor(r1.Float64() * float64(len(newVertices))))
	candidate2 := int(math.Floor(r1.Float64() * float64(len(newVertices))))
	temp := newVertices[candidate1]
	newVertices[candidate1] = newVertices[candidate2]
	newVertices[candidate2] = temp

	return Tour{
		vertices: newVertices,
		cost: Cost(newVertices),
	}
}

func FindNeighborWrapper() js.Func {
	function := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}

		startPath := jsValueToVertexArray(args[0].Get("vertices"))
		startDistance := float64(args[0].Get("cost").Int())

		individual := Tour{
			vertices: startPath,
			cost: startDistance,
		}
		neighbor := FindNeighbor(individual)

		return map[string]interface{}{
			"vertices": vertexArrayToInterfaceMap(neighbor.vertices),
			"cost": neighbor.cost,
		}
	})
	return function
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

func jsValueToVertexArray(vertices js.Value) []Vertex {

	length := vertices.Get("length").Int()

	resultArray := make([]Vertex, length)

	for i := 0; i < length; i++ {
		index := fmt.Sprintf("%d", i)
		x := float64(vertices.Get(index).Get("x").Int())
		y := float64(vertices.Get(index).Get("y").Int())
		resultArray[i] = Vertex{x: x, y: y}
	}

	return resultArray
}

func Cost(vertices []Vertex) float64 {
	total := 0.0

	for i := 1; i < len(vertices); i++ {
		total += Distance(vertices[i], vertices[i-1]);
	}
	total += Distance(vertices[len(vertices) - 1], vertices[0])

	return total
}

func CostWrapper() js.Func {
	function := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}

		path := jsValueToVertexArray(args[0])

		return Cost(path)
	})
return function
}

func Distance(vertex1 Vertex, vertex2 Vertex) float64 {

	return math.Pow(math.Pow(vertex1.x-vertex2.x, 2)+math.Pow(vertex1.y-vertex2.y, 2), 0.5)
}

func main() {
	dropRate := 0.1
	js.Global().Set("Cost", CostWrapper())
	js.Global().Set("CoolDown", CoolDownWrapper(dropRate))
	js.Global().Set("FindNeighbor", FindNeighborWrapper())
    <-make(chan bool)
}
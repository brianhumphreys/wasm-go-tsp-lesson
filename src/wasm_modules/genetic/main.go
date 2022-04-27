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
	fitness     float64
}

func Fitness(distanceMatrix map[Vertex]map[Vertex]float64, path []Vertex) float64 {
	total := 0.0
	for i := 0; i < len(path) - 1; i++ {
		total += distanceMatrix[path[i]][path[i + 1]]
	}
	total += distanceMatrix[path[len(path) - 1]][path[0]]
	return total
}

func FitnessWrapper(distanceMatrix map[Vertex]map[Vertex]float64) js.Func {
	twoOptFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}
		startPath := jsValueToVertexArray(args[0])

		return Fitness(distanceMatrix, startPath)
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

// function populate(tour, population_size){ // create random citizens
//     var population = [];
//     for(let i=0; i<population_size; i++){
//         var temp = tour.slice();
//         var newTour = []
//         while(temp.length > 0){
//             var index = Math.floor(Math.random()*(temp.length));
//             newTour.push(temp[index]);
//             temp.splice(index, 1);
//         }
//         population.push({vertices:newTour, fitness:fitness(newTour)});
//     }
//     return population;
// }

func populate(tour Tour, populationSize int) {
	population := make([]Tour, populationSize)

	for i := 0; i < populationSize; i++ {
		temp
	}
}

func Distance(vertex1 Vertex, vertex2 Vertex) float64 {

	return math.Pow(math.Pow(vertex1.x-vertex2.x, 2)+math.Pow(vertex1.y-vertex2.y, 2), 0.5)
}


func main() {
	distanceMatrix := map[Vertex]map[Vertex]float64{}
//   js.Global().Set("IterateTwoOpt", iterateTwoOptWrapper(distanceMatrix))
  js.Global().Set("Fitness", FitnessWrapper(distanceMatrix))
//   js.Global().Set("DistMat", createDistanceMatrixWrapper(distanceMatrix))
    <-make(chan bool)
}
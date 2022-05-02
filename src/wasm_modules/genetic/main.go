package main

import (
    "fmt"
	"syscall/js"
	"math"
	"math/rand"
	"time"
	"sort"
	"crypto/sha256"
	"bytes"
	"strconv"
)
type Vertex struct {
	X float64
	Y float64
}

type Tour struct {
	Vertices []Vertex
	Fitness     float64
	CostInverse float64
	Probability float64
}

func Genetic(initialPath []Vertex) {
	initialFitness := Fitness(initialPath)
	js.Global().Call("iterateGenetic", "ITERATE", initialFitness, vertexArrayToInterfaceMap(initialPath))

	initialTour := Tour{
		Vertices: initialPath,
		Fitness: initialFitness,
	}

	currentGeneration := 1
	maxGeneration := 50
	populationSize := 10
	elitism := 1
	mutationRate := 0.8
	mutationSize := 3.0
	mutations := 0

	population := populate(initialTour, populationSize);
	currentBest := FindMostFit(population);

	if initialTour.Fitness < currentBest.Fitness {
		currentBest = initialTour
	}

	// fmt.Println("calling iterate")
	// fmt.Println(currentBest.fitness)
	js.Global().Call("iterateGenetic", "ITERATE", currentBest.Fitness, vertexArrayToInterfaceMap(currentBest.Vertices))

	for currentGeneration < maxGeneration {
		newPopulation, bestOverall, newMutations := IterateGenetic(population, populationSize, elitism, currentBest, mutationRate, mutationSize, mutations)

		population = newPopulation
		if bestOverall.Fitness < currentBest.Fitness {
			currentBest = bestOverall
			mutations = newMutations

			// fmt.Println("calling iterate")
			// fmt.Println(currentBest.fitness)
			// fmt.Println(currentBest.vertices)
			js.Global().Call("iterateGenetic", "ITERATE", currentBest.Fitness, vertexArrayToInterfaceMap(currentBest.Vertices))
		}
		
		currentGeneration++
	}

	// fmt.Println("calling finish")
	// fmt.Println(currentBest.fitness)
	// fmt.Println(currentBest.vertices)
	// fmt.Print("recalculate: ")
	// fmt.Println(Fitness(currentBest.vertices))
	js.Global().Call("iterateGenetic", "FINISH", currentBest.Fitness, vertexArrayToInterfaceMap(currentBest.Vertices))

}

func GeneticWrapper() js.Func {
	function := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}

		path := jsValueToVertexArray(args[0])

		Genetic(path)
		return 8
	})
	return function
}

func IterateGenetic(population []Tour, populationSize int, elitism int, bestOverall Tour, mutationRate float64, mutationSize float64, mutations int) ([]Tour, Tour, int) {
	// js.Global().Call("testFunc")
	parentSize := populationSize * 2
	parents := Select(population, parentSize)

	newPopulation := []Tour{bestOverall}
	bestCurrent := bestOverall
	popSizeAddition := 1

	if elitism == 0 {
		newPopulation = []Tour{}
		bestCurrent = Tour{Fitness: math.MaxFloat64}
		popSizeAddition = 0
	}
	
	parentIdx := 0
	for parentIdx < (parentSize + popSizeAddition) {
		momIdx := parentIdx % parentSize
		dadIdx := (parentIdx + 1) % parentSize
		parentIdx = parentIdx + 2

		mom := parents[momIdx]
		dad := parents[dadIdx]
		individual := Cross(mom, dad)
		mutatedIndividual, didMutate := Mutate(mutationRate, mutationSize, individual)
		individual = mutatedIndividual
		if didMutate  {
			mutations++
		}
		newPopulation = append(newPopulation, individual)
		if individual.Fitness < bestCurrent.Fitness {
			bestCurrent = individual
		}
	}
	// fmt.Println("NEW POP SIZE: ", len(newPopulation))
	if bestCurrent.Fitness < bestOverall.Fitness {
		
		bestOverall = bestCurrent
		// fmt.Println("SETTING BEST")
		// fmt.Println(bestOverall.Vertices)
		// fmt.Println(bestOverall.Fitness)
		// fmt.Println(Fitness(bestOverall.Vertices))
	}
	
	population = newPopulation

	return newPopulation, bestOverall, mutations
}

func computeHashForList(list []Vertex) [32]byte {
	var buffer bytes.Buffer
	for i, _ := range list {
		buffer.WriteString(strconv.Itoa(int(list[i].X)) + "," + strconv.Itoa(int(list[i].Y)))
	}
	return (sha256.Sum256([]byte(buffer.String())))
}

func IterateGeneticWrapper(populationSize int, mutationRate float64, mutationSize float64) js.Func {
	function := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}

		path := jsValueToVertexArray(args[0].Get("vertices"))
		fitness := float64(args[0].Get("fitness").Int())
		mutations := args[0].Get("mutations").Int()
		population := jsValueToPopulation(args[0].Get("population"))

		currentBest := Tour{
			Vertices: path,
			Fitness: fitness,
		}

		elitism := 1

		// fmt.Println(currentBest)
		

		newPopulation, bestOverall, mutations := IterateGenetic(population, populationSize, elitism, currentBest, mutationRate, mutationSize, mutations)

		return map[string]interface{}{
			"vertices": vertexArrayToInterfaceMap(bestOverall.Vertices),
			"fitness": bestOverall.Fitness,
			"mutations": mutations,
			"population": populationToInterfaceMap(newPopulation),
		}
	})
	return function
}

func Select(population []Tour, n int) []Tour {
	min, max := FindMinMaxFitness(population)
	limit := max + min
	SetCostInverse(population, limit)
	SortDescendingCostInverse(population)
	costInverseSum := GetSumOfCostInverse(population)
	SetSelectionProbability(population, costInverseSum)

	// fmt.Println("POPULATION INV: ", population[0].costInverse)

	parents := []Tour{}
	for i := 0; i < n; i++ {
		r1 := rand.New(rand.NewSource(time.Now().UnixNano()))
		total := 0.0
		ind := 0
		prob := r1.Float64()
		for j := 0; j < len(population); j++ {
			ind++
			total = total + population[j].Probability
			if total >= prob {
				if j == 0 {
					parents = append(parents, population[0])
				} else {
					parents = append(parents, population[j - 1])
				}
			}
		}
	}

	return parents
}

func SetSelectionProbability(population []Tour, costInverseSum float64) {
	for i := range population {
		population[i].Probability = population[i].CostInverse / costInverseSum
	}
}

func SetCostInverse(population []Tour, limit float64) {
	for i := range population {
		population[i].CostInverse = limit - population[i].Fitness
	}
}

func SortDescendingCostInverse(popoulation []Tour) {
	sort.Slice(popoulation, func(i, j int) bool {
		return popoulation[i].CostInverse < popoulation[j].CostInverse
	})
}

func GetSumOfCostInverse(population []Tour) float64 {
	sum := 0.0
	for i := range population {
		sum += population[i].CostInverse
	}
	return sum
}


func SelectWrapper(population []Tour) js.Func {
	function := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 0 {
			return "Invalid number of arguments passed.  Expecting 0."
		}

		Select(population, len(population) * 2)

		return 8
	})
	return function
}

func FindMinMaxFitness(population []Tour) (float64, float64) {
	minFitness := math.MaxFloat64
	maxFitness := 0.0
	for i := range population {
		if population[i].Fitness < minFitness {
			minFitness = population[i].Fitness
		}
		if population[i].Fitness > maxFitness {
			maxFitness = population[i].Fitness
		}
	}
	
	return minFitness, maxFitness;
}


func IsGeneDuplicateOfMom(baby []Vertex, singleGeneOfDad Vertex) bool {
	for i := 0; i < len(baby); i++ {
		if baby[i].X == singleGeneOfDad.X && baby[i].Y == singleGeneOfDad.Y {
			return true
		}
	}
	return false
}

// single point crossover
func Cross(mom Tour, dad Tour) Tour {
	middle := int(math.Floor(float64(len(mom.Vertices)) / 2.0))

	babyVertices := make([]Vertex, middle)
	// add mom's genes
	for i := 0; i < middle; i++ {
		babyVertices[i] = mom.Vertices[i]
	}
	
	// add dad's genes
	for i := 0; i < len(dad.Vertices); i++ {
		gene := dad.Vertices[i]
		if !IsGeneDuplicateOfMom(babyVertices, gene) {
			babyVertices = append(babyVertices, gene)
		}
	}

	baby := Tour{Vertices: babyVertices, Fitness: Fitness(babyVertices)}
	return baby
}

func CrossWrapper() js.Func {
	twoOptFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 2 {
			return "Invalid number of arguments passed.  Expecting 2."
		}

		momPath := jsValueToVertexArray(args[0].Get("vertices"))
		momFitness := float64(args[0].Get("distance").Int())
		dadPath := jsValueToVertexArray(args[1].Get("vertices"))
		dadFitness := float64(args[1].Get("distance").Int())

		mom := Tour{
			Vertices: momPath,
			Fitness: momFitness,
		}
		dad := Tour{
			Vertices: dadPath,
			Fitness: dadFitness,
		}

		baby := Cross(mom, dad)

		return map[string]interface{}{
			"vertices": vertexArrayToInterfaceMap(baby.Vertices),
			"fitness": baby.Fitness,
		}
	})
	return twoOptFunction
}

func Mutate(mutationRate float64, mutationSize float64, individual Tour) (Tour, bool) {
    r1 := rand.New(rand.NewSource(time.Now().UnixNano()))
	if r1.Float64() <= mutationRate {
		numberOfMutations := int(math.Floor((r1.Float64() * mutationSize) + 1.0))
		for i := 0; i < numberOfMutations; i++ {
			rand.New(rand.NewSource(time.Now().UnixNano())).Float64()
			candidate1 := int(math.Floor(r1.Float64() * float64(len(individual.Vertices))))
			candidate2 := int(math.Floor(r1.Float64() * float64(len(individual.Vertices))))
			temp := individual.Vertices[candidate1]
			individual.Vertices[candidate1] = individual.Vertices[candidate2]
			individual.Vertices[candidate2] = temp
			individual.Fitness = Fitness(individual.Vertices)
		}
		return individual, true
	}
	return individual, false
}

func MutateWrapper(mutationRate float64, mutationSize float64) js.Func {
	twoOptFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}

		startPath := jsValueToVertexArray(args[0].Get("vertices"))
		startDistance := float64(args[0].Get("distance").Int())

		individual := Tour{
			Vertices: startPath,
			Fitness: startDistance,
		}
		Mutate(mutationRate, mutationSize, individual)

		return map[string]interface{}{
			"vertices": vertexArrayToInterfaceMap(individual.Vertices),
			"fitness": individual.Fitness,
		}
	})
	return twoOptFunction
}

func FindMostFit(population []Tour) Tour {
	bestFitness := math.MaxFloat64
	var bestTour Tour
	for i := range population {
		if population[i].Fitness < bestFitness {
			bestFitness = population[i].Fitness
			bestTour = population[i]
		}
	}
	return bestTour
}

func FindMostFitWrapper() js.Func {
	twoOptFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}

		population := jsValueToPopulation(args[0])

		mostFit := FindMostFit(population)

		return map[string]interface{}{
			"vertices": vertexArrayToInterfaceMap(mostFit.Vertices),
			"fitness": mostFit.Fitness,
		}
	})
	return twoOptFunction
}

func Fitness(path []Vertex) float64 {
	total := 0.0
	for i := 0; i < len(path) - 1; i++ {
		total += Distance(path[i], path[i + 1])
	}
	total += Distance(path[len(path) - 1], path[0])
	return total
}

func FitnessWrapper() js.Func {
	twoOptFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}
		startPath := jsValueToVertexArray(args[0])

		return Fitness(startPath)
	})
	return twoOptFunction
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


func jsValueToPopulation(population js.Value) []Tour {
	length := population.Get("length").Int()

	resultPop := make([]Tour, length)

	for i := 0; i < length; i++ {
		index := fmt.Sprintf("%d", i)
		fitness := float64(population.Get(index).Get("fitness").Int())
		vertices := jsValueToVertexArray(population.Get(index).Get("vertices"))
		resultPop[i] = Tour{Fitness: fitness, Vertices: vertices}
	}

	return resultPop
}

func populationToInterfaceMap(population []Tour) map[string]interface{} {
	populationMap := map[string]interface{}{
		"length": len(population),
	}
	for i := 0; i < len(population); i++ {
		populationMap[fmt.Sprintf("%d", i)] = map[string]interface{}{
			"vertices": vertexArrayToInterfaceMap(population[i].Vertices), 
			"fitness": population[i].Fitness,
		}
	}
	return populationMap
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

func Shuffle(slice []Vertex) []Vertex {

	newVertices := make([]Vertex, len(slice))
	for n := 0; n < len(slice); n++ {
		newVertices[n] = slice[n]
	}
	for n := len(newVertices); n > 0; n-- {
	   randIndex := int(math.Floor(rand.Float64() * float64(len(newVertices))))
	   newVertices[n-1], newVertices[randIndex] = newVertices[randIndex], newVertices[n-1]
	}
	return newVertices
 }


func populate(tour Tour, populationSize int) []Tour {

	population := make([]Tour, populationSize)
	for i := 0; i < len(population); i++ {
		newVertices := Shuffle(tour.Vertices)
		population[i] = Tour{Vertices: newVertices, Fitness: Fitness(newVertices)}
	}
	return population
}

// func PopulateWrapper(population []Tour) js.Func {
// 	populateFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
// 		if len(args) != 1 {
// 			return "Invalid number of arguments passed.  Expecting 1."
// 		}
// 		startPath := jsValueToVertexArray(args[0].Get("vertices"))
// 		startDistance := float64(args[0].Get("fitness").Int())

// 		population = populate(population, Tour{vertices: startPath, fitness: startDistance})

// 		return populationToInterfaceMap(population)
// 	})
// 	return populateFunction
// }

func Distance(vertex1 Vertex, vertex2 Vertex) float64 {

	return math.Pow(math.Pow(vertex1.X-vertex2.X, 2)+math.Pow(vertex1.Y-vertex2.Y, 2), 0.5)
}


func main() {
	// populationSize := 200
	// population := make([]Tour, populationSize)
	// mutationRate := 0.7
	// mutationSize := 3.0
//   js.Global().Set("Fitness", FitnessWrapper())
  js.Global().Set("Genetic", GeneticWrapper())
//   js.Global().Set("IterateGenetic", IterateGeneticWrapper(populationSize, mutationRate, mutationSize))
//   js.Global().Set("FindMostFit", FindMostFitWrapper())
//   js.Global().Set("Mutate", MutateWrapper(mutationRate, mutationSize))
//   js.Global().Set("Cross", CrossWrapper())
//   js.Global().Set("Select", SelectWrapper(population))
//   js.Global().Set("Populate", PopulateWrapper(population))
    <-make(chan bool)
}
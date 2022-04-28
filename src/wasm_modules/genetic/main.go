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
	x float64
	y float64
}

type Tour struct {
	vertices []Vertex
	fitness     float64
	costInverse float64
	probability float64
}

// var parents = select(population, population_size*2) // selection
// var new_population = elitism ? [best_overall] : []; // elitism
// var best_current = elitism ? best_overall : {fitness:Number.POSITIVE_INFINITY};
// while(new_population.length < Number(population_size)+(elitism ? 1 : 0)){
// 	var individual = cross(parents.shift(), parents.shift()); // crossover
// 	if (mutate(mutation_rate, individual)) mutations++; //mutation
// 	new_population.push(individual);
// 	if(individual.fitness < best_current.fitness) best_current = individual;
// }
// if(best_current.fitness < best_overall.fitness) best_overall = best_current; // keep the best, always

// state_changed('Running... Generation: '+current_generation+', Best: '+Math.floor(best_current.fitness)+', Global Best:'+Math.floor(best_overall.fitness)+', Mutations:'+mutations, best_overall);
// current_generation++;
// if(current_generation < max_generation) evolve(); // loop until max generation
// else state_changed('Started with cost: '+Math.floor(startCost)+', ended with cost: '+Math.floor(best_overall.fitness), best_overall);

func IterateGenetic(population []Tour, elitism int, bestOverall Tour, mutationRate float64, mutations int) ([]Tour, Tour, int) {
	fmt.Println("check population")
	fmt.Println(population[0].fitness)
	populationSize := len(population) * 2
	parents := Select(population, populationSize)
	newPopulation := []Tour{bestOverall}
	bestCurrent := bestOverall
	popSizeAddition := 1

	for i := range population {
		fmt.Printf("Hash A: %d - fitness: %.2f - inv: %.2f", i, population[i].fitness, population[i].costInverse)
		fmt.Println(computeHashForList(population[i].vertices))
	}

	if elitism == 0 {
		newPopulation = []Tour{}
		bestCurrent = Tour{fitness: math.MaxFloat64}
		popSizeAddition = 0
	}
	
	parentIdx := 0
	for parentIdx < (populationSize + popSizeAddition) {
		momIdx := parentIdx % populationSize
		dadIdx := (parentIdx + 1) % populationSize
		parentIdx = parentIdx + 2

		mom := parents[momIdx]
		dad := parents[dadIdx]
		individual := Cross(mom, dad)
		if Mutate(mutationRate, individual)  {
			mutations++
		}
		newPopulation = append(newPopulation, individual)
		if individual.fitness < bestCurrent.fitness {
			bestCurrent = individual
		}
	}
	if bestCurrent.fitness < bestOverall.fitness {
		bestOverall = bestCurrent
	}

	// population = newPopulation

	for i := range newPopulation {
		// vertices := []Vertex{}
		// fitness := newPopulation[i].fitness
		// for _, v := range newPopulation[i].vertices {
		// 	vertices = append(vertices, Vertex{x: v.x, y: v.y})
		// }
		// population[i] = Tour{vertices: vertices, fitness: fitness}
		fmt.Printf("Hash B: %d - fitness: %.2f - inv: %.2f", i, newPopulation[i].fitness, newPopulation[i].costInverse)
		fmt.Println(computeHashForList(newPopulation[i].vertices))
	}



	return newPopulation, bestOverall, mutations
}

func computeHashForList(list []Vertex) [32]byte {
	var buffer bytes.Buffer
	for i, _ := range list {
		buffer.WriteString(strconv.Itoa(int(list[i].x)) + "," + strconv.Itoa(int(list[i].y)))
	}
	return (sha256.Sum256([]byte(buffer.String())))
}

func IterateGeneticWrapper(population []Tour, populationSize int) js.Func {
	function := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}

		path := jsValueToVertexArray(args[0].Get("vertices"))
		fitness := float64(args[0].Get("fitness").Int())
		mutations := args[0].Get("mutations").Int()

		currentBest := Tour{
			vertices: path,
			fitness: fitness,
		}

		elitism := 1
		newPopulation, bestOverall, mutations := IterateGenetic(population, elitism, currentBest, 0.8, mutations)

		r1 := rand.New(rand.NewSource(time.Now().UnixNano()))
		vertices := []Vertex{{x: math.Floor(r1.Float64()*10), y: math.Floor(r1.Float64()*10)}, {x: math.Floor(r1.Float64()*10), y: math.Floor(r1.Float64()*10)}, {x: math.Floor(r1.Float64()*10), y: math.Floor(r1.Float64()*10)}, {x: math.Floor(r1.Float64()*10), y: math.Floor(r1.Float64()*10)}, {x: math.Floor(r1.Float64()*10), y: math.Floor(r1.Float64()*10)}, {x: math.Floor(r1.Float64()*10), y: math.Floor(r1.Float64()*10)}, {x: math.Floor(r1.Float64()*10), y: math.Floor(r1.Float64()*10)}, {x: math.Floor(r1.Float64()*10), y: math.Floor(r1.Float64()*10)}, {x: math.Floor(r1.Float64()*10), y: math.Floor(r1.Float64()*10)}, {x: math.Floor(r1.Float64()*10), y: math.Floor(r1.Float64()*10)}, {x: math.Floor(r1.Float64()*10), y: math.Floor(r1.Float64()*10)}}
		population = []Tour{{vertices: vertices, fitness: 100000}, {vertices: vertices, fitness: Fitness(vertices)}}

		population = newPopulation
		return map[string]interface{}{
			"vertices": vertexArrayToInterfaceMap(bestOverall.vertices),
			"fitness": bestOverall.fitness,
			"mutations": mutations,
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

	fmt.Println("POPULATION INV: ", population[0].costInverse)

	parents := []Tour{}
	for i := 0; i < n; i++ {
		r1 := rand.New(rand.NewSource(time.Now().UnixNano()))
		total := 0.0
		ind := 0
		prob := r1.Float64()
		for j := 0; j < len(population); j++ {
			ind++
			total = total + population[j].probability
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
		population[i].probability = population[i].costInverse / costInverseSum
	}
}

func SetCostInverse(population []Tour, limit float64) {
	for i := range population {
		population[i].costInverse = limit - population[i].fitness
	}
}

func SortDescendingCostInverse(popoulation []Tour) {
	sort.Slice(popoulation, func(i, j int) bool {
		return popoulation[i].costInverse < popoulation[j].costInverse
	})
}

func GetSumOfCostInverse(population []Tour) float64 {
	sum := 0.0
	for i := range population {
		sum += population[i].costInverse
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
		if population[i].fitness < minFitness {
			minFitness = population[i].fitness
		}
		if population[i].fitness > maxFitness {
			maxFitness = population[i].fitness
		}
	}
	
	return minFitness, maxFitness;
}


func IsGeneDuplicateOfMom(baby []Vertex, singleGeneOfDad Vertex) bool {
	for i := 0; i < len(baby); i++ {
		if baby[i].x == singleGeneOfDad.x && baby[i].y == singleGeneOfDad.y {
			return true
		}
	}
	return false
}

// single point crossover
func Cross(mom Tour, dad Tour) Tour {
	middle := int(math.Floor(float64(len(mom.vertices)) / 2.0))

	babyVertices := make([]Vertex, middle)
	// add mom's genes
	for i := 0; i < middle; i++ {
		babyVertices[i] = mom.vertices[i]
	}
	
	// add dad's genes
	for i := 0; i < len(dad.vertices); i++ {
		gene := dad.vertices[i]
		if !IsGeneDuplicateOfMom(babyVertices, gene) {
			babyVertices = append(babyVertices, gene)
		}
	}

	baby := Tour{vertices: babyVertices, fitness: Fitness(babyVertices)}
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
			vertices: momPath,
			fitness: momFitness,
		}
		dad := Tour{
			vertices: dadPath,
			fitness: dadFitness,
		}

		baby := Cross(mom, dad)

		return map[string]interface{}{
			"vertices": vertexArrayToInterfaceMap(baby.vertices),
			"fitness": baby.fitness,
		}
	})
	return twoOptFunction
}

func Mutate(mutationRate float64, individual Tour) bool {
    r1 := rand.New(rand.NewSource(time.Now().UnixNano()))
	if r1.Float64() <= mutationRate {
		rand.New(rand.NewSource(time.Now().UnixNano())).Float64()
		candidate1 := int(math.Floor(r1.Float64() * float64(len(individual.vertices))))
		candidate2 := int(math.Floor(r1.Float64() * float64(len(individual.vertices))))
		temp := individual.vertices[candidate1]
		individual.vertices[candidate1] = individual.vertices[candidate2]
		individual.vertices[candidate2] = temp
		individual.fitness = Fitness(individual.vertices)
		return true
	}
	return false
}

func MutateWrapper() js.Func {
	twoOptFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}

		startPath := jsValueToVertexArray(args[0].Get("vertices"))
		startDistance := float64(args[0].Get("distance").Int())
		// individual := Tour{vertices: []Vertex{{x:1,y:1}, {x:2,y:2}, {x:3,y:3}, {x:4,y:4}, {x:5,y:5}, {x:6,y:6}, {x:7,y:7}, {x:8,y:8}}, fitness: 10.0}

		individual := Tour{
			vertices: startPath,
			fitness: startDistance,
		}
		Mutate(0.9, individual)

		return map[string]interface{}{
			"vertices": vertexArrayToInterfaceMap(individual.vertices),
			"fitness": individual.fitness,
		}
	})
	return twoOptFunction
}

func FindMostFit(population []Tour) Tour {
	bestFitness := math.MaxFloat64
	var bestTour Tour
	for i := range population {
		if population[i].fitness < bestFitness {
			bestFitness = population[i].fitness
			bestTour = population[i]
		}
	}
	return bestTour
}

func FindMostFitWrapper(population []Tour) js.Func {
	twoOptFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 0 {
			return "Invalid number of arguments passed.  Expecting None."
		}
		mostFit := FindMostFit(population)

		return map[string]interface{}{
			"vertices": vertexArrayToInterfaceMap(mostFit.vertices),
			"fitness": mostFit.fitness,
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

func populate(population []Tour, tour Tour) {

	for i := 0; i < len(population); i++ {
		newVertices := Shuffle(tour.vertices)
		population[i] = Tour{vertices: newVertices, fitness: Fitness(newVertices)}
	}
}
func PopulateWrapper(population []Tour) js.Func {
	populateFunction := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 1 {
			return "Invalid number of arguments passed.  Expecting 1."
		}
		startPath := jsValueToVertexArray(args[0].Get("vertices"))
		startDistance := float64(args[0].Get("fitness").Int())

		populate(population, Tour{vertices: startPath, fitness: startDistance})

		return 8
	})
	return populateFunction
}

func Distance(vertex1 Vertex, vertex2 Vertex) float64 {

	return math.Pow(math.Pow(vertex1.x-vertex2.x, 2)+math.Pow(vertex1.y-vertex2.y, 2), 0.5)
}


func main() {
	populationSize := 5
	population := make([]Tour, populationSize)
//   js.Global().Set("IterateTwoOpt", iterateTwoOptWrapper(distanceMatrix))
  js.Global().Set("Fitness", FitnessWrapper())
  js.Global().Set("IterateGenetic", IterateGeneticWrapper(population, populationSize))
  js.Global().Set("FindMostFit", FindMostFitWrapper(population))
  js.Global().Set("Mutate", MutateWrapper())
  js.Global().Set("Cross", CrossWrapper())
  js.Global().Set("Select", SelectWrapper(population))
  js.Global().Set("Populate", PopulateWrapper(population))
//   js.Global().Set("DistMat", createDistanceMatrixWrapper(distanceMatrix))
    <-make(chan bool)
}
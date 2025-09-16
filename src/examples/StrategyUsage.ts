import {
  FitnessStrategy,
  ShortestPathFitnessStrategy,
  MutationStrategy,
  ShuffleMutationStrategy,
  CrossoverStrategy,
  OrderCrossoverStrategy,
} from '@/services';
import { Population, Point } from '@/entities';

/**
 * Example demonstrating how to use the strategy pattern
 * to customize genetic algorithm behavior
 */
export function demonstrateStrategies() {
  // Create some points for the traveling salesman problem
  const points = [new Point(0, 0), new Point(1, 1), new Point(2, 0), new Point(1, -1)];

  // Create strategy instances
  const fitnessStrategy: FitnessStrategy = new ShortestPathFitnessStrategy(points);
  const mutationStrategy: MutationStrategy = new ShuffleMutationStrategy();
  const crossoverStrategy: CrossoverStrategy = new OrderCrossoverStrategy();

  // Method 1: Create population with strategies
  const populationWithStrategies = Population.getRandomPopulation(
    10, // population size
    points,
    fitnessStrategy,
    0.1, // mutation rate
    mutationStrategy,
    crossoverStrategy
  );

  console.log('Population with strategies created');
  console.log('Best individual:', populationWithStrategies.getBestIndividual().genes);

  // Method 2: Create population without strategies (backward compatible)
  const traditionalPopulation = Population.getRandomPopulation(
    10,
    points,
    fitnessStrategy,
    0.1 // mutation rate
  );

  console.log('Traditional population created');
  console.log('Best individual:', traditionalPopulation.getBestIndividual().genes);

  // Method 3: Add strategies to existing population
  traditionalPopulation.setMutationStrategy(mutationStrategy);
  traditionalPopulation.setCrossoverStrategy(crossoverStrategy);

  console.log('Strategies added to traditional population');

  // Evolve populations
  const newGeneration1 = populationWithStrategies.evolve();
  const newGeneration2 = traditionalPopulation.evolve();

  console.log('Evolution completed');
  console.log('New generation 1 best:', newGeneration1.getBestIndividual().genes);
  console.log('New generation 2 best:', newGeneration2.getBestIndividual().genes);

  return {
    populationWithStrategies: newGeneration1,
    traditionalPopulation: newGeneration2,
  };
}

// Custom mutation strategy example
export class SwapMutationStrategy implements MutationStrategy {
  mutate(genes: number[], mutationRate: number): number[] {
    const result = [...genes];
    if (Math.random() < mutationRate && genes.length > 1) {
      const i = Math.floor(Math.random() * genes.length);
      const j = Math.floor(Math.random() * genes.length);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

// Custom crossover strategy example
export class SinglePointCrossoverStrategy implements CrossoverStrategy {
  crossover(parent1: number[], parent2: number[]): [number[], number[]] {
    const point = Math.floor(Math.random() * parent1.length);
    const child1 = [...parent1.slice(0, point), ...parent2.slice(point)];
    const child2 = [...parent2.slice(0, point), ...parent1.slice(point)];
    return [child1, child2];
  }
}

/**
 * Example showing how to use custom strategies
 */
export function demonstrateCustomStrategies() {
  const points = [new Point(0, 0), new Point(1, 1), new Point(2, 0)];
  const fitnessStrategy = new ShortestPathFitnessStrategy(points);

  // Use custom strategies
  const customMutation = new SwapMutationStrategy();
  const customCrossover = new SinglePointCrossoverStrategy();

  const population = Population.getRandomPopulation(
    5,
    points,
    fitnessStrategy,
    0.2,
    customMutation,
    customCrossover
  );

  console.log('Population with custom strategies created');
  console.log('Best individual:', population.getBestIndividual().genes);

  return population.evolve();
}

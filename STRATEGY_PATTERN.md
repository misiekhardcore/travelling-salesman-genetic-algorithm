# Strategy Pattern Implementation

This document explains how to use the newly implemented strategy pattern for fitness, mutation, and crossover operations in the Traveling Salesman Genetic Algorithm.

## Overview

The genetic algorithm now supports the strategy pattern for three key operations:

1. **FitnessStrategy** - How to evaluate individual fitness (already existed)
2. **MutationStrategy** - How to mutate individual genes
3. **CrossoverStrategy** - How to perform crossover between two parents

## Available Strategies

### Fitness Strategies
- `ShortestPathFitnessStrategy` - Evaluates fitness based on path length (existing)

### Mutation Strategies
- `ShuffleMutationStrategy` - Shuffles all genes when mutation occurs (default behavior)

### Crossover Strategies
- `OrderCrossoverStrategy` - Order-based crossover preserving gene uniqueness (default behavior)

## Usage Examples

### Using Default Strategies

```typescript
import { 
  ShortestPathFitnessStrategy,
  ShuffleMutationStrategy,
  OrderCrossoverStrategy
} from '@/services';
import { Population, Point } from '@/entities';

const points = [
  new Point(0, 0),
  new Point(1, 1),
  new Point(2, 0),
  new Point(1, -1)
];

const fitnessStrategy = new ShortestPathFitnessStrategy(points);
const mutationStrategy = new ShuffleMutationStrategy();
const crossoverStrategy = new OrderCrossoverStrategy();

// Create population with all strategies
const population = Population.getRandomPopulation(
  10, // population size
  points,
  fitnessStrategy,
  0.1, // mutation rate
  mutationStrategy,
  crossoverStrategy
);
```

### Backward Compatibility

The implementation maintains backward compatibility. You can still use the old API:

```typescript
// This still works exactly as before
const population = Population.getRandomPopulation(
  10,
  points,
  fitnessStrategy,
  0.1
);
```

### Adding Strategies to Existing Population

```typescript
const population = new Population(individuals, fitnessStrategy, 0.1);

// Add strategies later
population.setMutationStrategy(new ShuffleMutationStrategy());
population.setCrossoverStrategy(new OrderCrossoverStrategy());
```

### Creating Custom Strategies

#### Custom Mutation Strategy

```typescript
import { MutationStrategy } from '@/services';

class SwapMutationStrategy implements MutationStrategy {
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
```

#### Custom Crossover Strategy

```typescript
import { CrossoverStrategy } from '@/services';

class SinglePointCrossoverStrategy implements CrossoverStrategy {
  crossover(parent1: number[], parent2: number[]): [number[], number[]] {
    const point = Math.floor(Math.random() * parent1.length);
    const child1 = [...parent1.slice(0, point), ...parent2.slice(point)];
    const child2 = [...parent2.slice(0, point), ...parent1.slice(point)];
    return [child1, child2];
  }
}
```

#### Custom Fitness Strategy

```typescript
import { FitnessStrategy } from '@/services';
import { Individual } from '@/entities';

class MaximizeSum implements FitnessStrategy {
  getIndividualFitness(individual: Individual): number {
    return individual.genes.reduce((sum, gene) => sum + gene, 0);
  }

  getFitnessSum(individuals: Individual[]): number {
    return individuals.reduce((sum, individual) => 
      sum + this.getIndividualFitness(individual), 0);
  }
}
```

## Benefits

1. **Modularity** - Each strategy can be developed and tested independently
2. **Extensibility** - Easy to add new algorithms without changing core logic
3. **Reusability** - Strategies can be shared across different problems
4. **Testability** - Each strategy can be unit tested in isolation
5. **Flexibility** - Mix and match different strategies for experimentation
6. **Backward Compatibility** - Existing code continues to work without changes

## Strategy Interface Reference

### MutationStrategy

```typescript
interface MutationStrategy {
  mutate(genes: number[], mutationRate: number): number[];
}
```

### CrossoverStrategy

```typescript
interface CrossoverStrategy {
  crossover(parent1: number[], parent2: number[]): [number[], number[]];
}
```

### FitnessStrategy (existing)

```typescript
interface FitnessStrategy {
  getIndividualFitness(individual: Individual): number;
  getFitnessSum(individuals: Individual[]): number;
}
```

## Testing

All strategies include comprehensive unit tests. See the test files for examples of how to test custom strategies:

- `src/services/MutationStrategy/ShuffleMutationStrategy/ShuffleMutationStrategy.test.ts`
- `src/services/CrossoverStrategy/OrderCrossoverStrategy/OrderCrossoverStrategy.test.ts`
- `src/integration/StrategyPattern.test.ts`

## Implementation Notes

- Strategies are optional - the system falls back to original behavior if no strategy is provided
- Strategies operate on gene arrays (number[]) rather than Individual objects for better separation of concerns
- All mutation and crossover strategies should return new arrays rather than modifying input arrays
- The Population class manages strategy injection to Individual instances during reproduction
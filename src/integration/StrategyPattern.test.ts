import {
  FitnessStrategy,
  ShortestPathFitnessStrategy,
  MutationStrategy,
  ShuffleMutationStrategy,
  CrossoverStrategy,
  OrderCrossoverStrategy,
} from '@/services';
import { Individual, Population, Point } from '@/entities';

describe('Strategy Pattern Integration', () => {
  const points = [
    new Point(0, 0),
    new Point(0, 1),
    new Point(1, 0),
    new Point(1, 1),
    new Point(1, 2),
  ];

  let fitnessStrategy: FitnessStrategy;
  let mutationStrategy: MutationStrategy;
  let crossoverStrategy: CrossoverStrategy;

  beforeEach(() => {
    fitnessStrategy = new ShortestPathFitnessStrategy(points);
    mutationStrategy = new ShuffleMutationStrategy();
    crossoverStrategy = new OrderCrossoverStrategy();
  });

  describe('Individual with strategies', () => {
    it('should work with injected strategies', () => {
      const individual1 = new Individual([0, 1, 2, 3, 4], mutationStrategy, crossoverStrategy);
      const individual2 = new Individual([4, 3, 2, 1, 0], mutationStrategy, crossoverStrategy);

      // Test mutation with strategy
      const originalGenes = [...individual1.genes];
      individual1.mutate(1); // 100% mutation rate
      expect(individual1.genes).toHaveLength(originalGenes.length);
      expect(individual1.genes.sort()).toEqual(originalGenes.sort());

      // Test crossover with strategy
      const [child1, child2] = individual1.crossover(individual2);
      expect(child1.genes).toHaveLength(individual1.genes.length);
      expect(child2.genes).toHaveLength(individual2.genes.length);
    });

    it('should work without strategies (fallback behavior)', () => {
      const individual1 = new Individual([0, 1, 2, 3, 4]);
      const individual2 = new Individual([4, 3, 2, 1, 0]);

      // Test mutation fallback
      const originalGenes = [...individual1.genes];
      individual1.mutate(1); // 100% mutation rate
      expect(individual1.genes).toHaveLength(originalGenes.length);

      // Test crossover fallback
      const [child1, child2] = individual1.crossover(individual2);
      expect(child1.genes).toHaveLength(individual1.genes.length);
      expect(child2.genes).toHaveLength(individual2.genes.length);
    });

    it('should allow strategy override in method calls', () => {
      const individual1 = new Individual([0, 1, 2, 3, 4]);
      const individual2 = new Individual([4, 3, 2, 1, 0]);

      // Test strategy override
      const [child1, child2] = individual1.crossover(individual2, crossoverStrategy);
      expect(child1.genes).toHaveLength(individual1.genes.length);
      expect(child2.genes).toHaveLength(individual2.genes.length);
    });
  });

  describe('Population with strategies', () => {
    it('should work with all strategies provided', () => {
      const individuals = [new Individual([0, 1, 2, 3, 4]), new Individual([3, 0, 4, 2, 1])];

      const population = new Population(
        individuals,
        fitnessStrategy,
        0.1,
        mutationStrategy,
        crossoverStrategy
      );

      expect(population.individuals).toHaveLength(2);
      expect(population.getBestIndividual()).toBeDefined();

      // Test evolution with strategies
      const newPopulation = population.evolve();
      expect(newPopulation.individuals).toHaveLength(2);
    });

    it('should work with getRandomPopulation using strategies', () => {
      const population = Population.getRandomPopulation(
        5,
        points,
        fitnessStrategy,
        0.1,
        mutationStrategy,
        crossoverStrategy
      );

      expect(population.individuals).toHaveLength(5);
      expect(population.individuals[0].genes).toHaveLength(points.length);

      // Test that strategies can be changed
      const newMutationStrategy = new ShuffleMutationStrategy();
      population.setMutationStrategy(newMutationStrategy);

      const newCrossoverStrategy = new OrderCrossoverStrategy();
      population.setCrossoverStrategy(newCrossoverStrategy);

      const newPopulation = population.evolve();
      expect(newPopulation.individuals).toHaveLength(5);
    });

    it('should maintain backward compatibility without strategies', () => {
      const individuals = [new Individual([0, 1, 2, 3, 4]), new Individual([3, 0, 4, 2, 1])];

      const population = new Population(individuals, fitnessStrategy, 0.1);

      expect(population.individuals).toHaveLength(2);
      expect(population.getBestIndividual()).toBeDefined();

      // Test evolution without strategies (fallback behavior)
      const newPopulation = population.evolve();
      expect(newPopulation.individuals).toHaveLength(2);
    });
  });
});

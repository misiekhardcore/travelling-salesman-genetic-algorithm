import { FitnessStrategy, MutationStrategy, CrossoverStrategy } from '@/services';
import { Individual } from '../Individual';
import { shuffleArray } from '@/utils';
import { Point } from '../Point';

export class Population {
  constructor(
    public individuals: Individual[],
    readonly fitnessStrategy: FitnessStrategy,
    private mutationRate: number = 0.1,
    private mutationStrategy?: MutationStrategy,
    private crossoverStrategy?: CrossoverStrategy
  ) {}

  getMatingPool(): Individual[] {
    const matingPool: Individual[] = [];
    const fitnessSum = this.fitnessStrategy.getFitnessSum(this.individuals);

    this.individuals.forEach((individual) => {
      const fitness = this.fitnessStrategy.getIndividualFitness(individual);
      const fitnessRatio = fitness / fitnessSum;
      const numberOfCopies = Math.round(fitnessRatio * this.individuals.length + 1);

      for (let i = 0; i < numberOfCopies; i++) {
        matingPool.push(
          new Individual(individual.genes, this.mutationStrategy, this.crossoverStrategy)
        );
      }
    });

    return matingPool.splice(0, this.individuals.length);
  }

  reproduce(): Individual[] {
    const matingPool = this.getMatingPool().sort(
      (a, b) =>
        this.fitnessStrategy.getIndividualFitness(b) - this.fitnessStrategy.getIndividualFitness(a)
    );

    const offspring: Individual[] = [];
    for (let i = 0; i < matingPool.length; i += 2) {
      const parent1 = matingPool[i];
      const parent2 = matingPool[i + 1] || matingPool[0]; // Use first parent if no second parent available
      const [child1, child2] = parent1.crossover(parent2, this.crossoverStrategy);

      offspring.push(child1.mutate(this.mutationRate, this.mutationStrategy));
      if (offspring.length < this.individuals.length) {
        offspring.push(child2.mutate(this.mutationRate, this.mutationStrategy));
      }
    }

    return offspring.slice(0, this.individuals.length); // Ensure we return exactly the same number of individuals
  }

  getBestIndividual(): Individual {
    return this.individuals.reduce((bestIndividual, individual) => {
      return this.fitnessStrategy.getIndividualFitness(individual) >
        this.fitnessStrategy.getIndividualFitness(bestIndividual)
        ? individual
        : bestIndividual;
    });
  }

  getworstIndividual(): Individual {
    return this.individuals.reduce((worstIndividual, individual) => {
      return this.fitnessStrategy.getIndividualFitness(individual) <
        this.fitnessStrategy.getIndividualFitness(worstIndividual)
        ? individual
        : worstIndividual;
    });
  }

  score(): number {
    return this.individuals.reduce((score, gene) => {
      return score + this.fitnessStrategy.getIndividualFitness(gene);
    }, 0);
  }

  evolve(): Population {
    const newIndividuals = this.reproduce();

    return new Population(
      newIndividuals,
      this.fitnessStrategy,
      this.mutationRate,
      this.mutationStrategy,
      this.crossoverStrategy
    );
  }

  static getRandomPopulation(
    size: number,
    points: Point[],
    fitnessStrategy: FitnessStrategy,
    mutationRate: number,
    mutationStrategy?: MutationStrategy,
    crossoverStrategy?: CrossoverStrategy
  ): Population {
    const genes = Array.from(
      { length: size },
      () =>
        new Individual(
          shuffleArray(Array.from({ length: points.length }, (_, i) => i)),
          mutationStrategy,
          crossoverStrategy
        )
    );

    return new Population(
      genes,
      fitnessStrategy,
      mutationRate,
      mutationStrategy,
      crossoverStrategy
    );
  }

  setMutationRate(mutationRate: number): void {
    this.mutationRate = mutationRate;
  }

  setMutationStrategy(mutationStrategy: MutationStrategy): void {
    this.mutationStrategy = mutationStrategy;
  }

  setCrossoverStrategy(crossoverStrategy: CrossoverStrategy): void {
    this.crossoverStrategy = crossoverStrategy;
  }
}

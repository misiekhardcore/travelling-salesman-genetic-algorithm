export interface CrossoverStrategy {
  crossover(parent1: number[], parent2: number[]): [number[], number[]];
}

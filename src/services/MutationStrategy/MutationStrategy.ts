export interface MutationStrategy {
  mutate(genes: number[], mutationRate: number): number[];
}

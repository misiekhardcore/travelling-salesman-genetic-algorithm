import { shuffleArray } from '@/utils';
import { MutationStrategy } from '../MutationStrategy';

export class ShuffleMutationStrategy implements MutationStrategy {
  mutate(genes: number[], mutationRate: number): number[] {
    if (Math.random() < mutationRate) {
      return shuffleArray([...genes]);
    }
    return [...genes];
  }
}

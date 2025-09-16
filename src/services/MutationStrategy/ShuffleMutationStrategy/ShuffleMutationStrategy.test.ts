import { ShuffleMutationStrategy } from './ShuffleMutationStrategy';

describe('ShuffleMutationStrategy', () => {
  const strategy = new ShuffleMutationStrategy();

  it('should mutate genes when mutation rate is 1', () => {
    const originalGenes = [1, 2, 3, 4, 5];
    const mutatedGenes = strategy.mutate(originalGenes, 1);

    // Should have same length and elements, but possibly different order
    expect(mutatedGenes).toHaveLength(originalGenes.length);
    expect(mutatedGenes.sort()).toEqual(originalGenes.sort());

    // Should not modify original array
    expect(originalGenes).toEqual([1, 2, 3, 4, 5]);
  });

  it('should not mutate genes when mutation rate is 0', () => {
    const originalGenes = [1, 2, 3, 4, 5];
    const mutatedGenes = strategy.mutate(originalGenes, 0);

    expect(mutatedGenes).toEqual(originalGenes);
    expect(mutatedGenes).not.toBe(originalGenes); // Should be a copy
  });

  it('should return a copy of genes even when not mutating', () => {
    const originalGenes = [1, 2, 3, 4, 5];
    const mutatedGenes = strategy.mutate(originalGenes, 0);

    expect(mutatedGenes).not.toBe(originalGenes);
    mutatedGenes[0] = 99;
    expect(originalGenes[0]).toBe(1); // Original should be unchanged
  });
});

import { OrderCrossoverStrategy } from './OrderCrossoverStrategy';

describe('OrderCrossoverStrategy', () => {
  const strategy = new OrderCrossoverStrategy();

  it('should perform crossover between two parents', () => {
    const parent1 = [3, 1, 4, 2, 5];
    const parent2 = [5, 4, 3, 2, 1];

    const [child1, child2] = strategy.crossover(parent1, parent2);

    // Children should have same length as parents
    expect(child1).toHaveLength(parent1.length);
    expect(child2).toHaveLength(parent2.length);

    // Children should be different from parents
    expect(child1).not.toEqual(parent1);
    expect(child2).not.toEqual(parent2);

    // Children should contain all elements from parents (no duplicates or missing elements)
    expect(child1.sort()).toEqual(parent1.sort());
    expect(child2.sort()).toEqual(parent2.sort());
  });

  it('should not modify original parent arrays', () => {
    const parent1 = [3, 1, 4, 2, 5];
    const parent2 = [5, 4, 3, 2, 1];
    const originalParent1 = [...parent1];
    const originalParent2 = [...parent2];

    strategy.crossover(parent1, parent2);

    expect(parent1).toEqual(originalParent1);
    expect(parent2).toEqual(originalParent2);
  });

  it('should produce valid children with all unique elements', () => {
    const parent1 = [0, 1, 2, 3, 4];
    const parent2 = [4, 3, 2, 1, 0];

    const [child1, child2] = strategy.crossover(parent1, parent2);

    // Check no duplicates
    expect(new Set(child1).size).toBe(child1.length);
    expect(new Set(child2).size).toBe(child2.length);

    // Check all elements are present
    expect(new Set(child1)).toEqual(new Set(parent1));
    expect(new Set(child2)).toEqual(new Set(parent2));
  });
});

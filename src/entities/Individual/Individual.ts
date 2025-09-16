import { shuffleArray } from '@/utils';
import { MutationStrategy, CrossoverStrategy } from '@/services';

type Gene = number;

export class Individual {
  constructor(
    public genes: Gene[] = [],
    private mutationStrategy?: MutationStrategy,
    private crossoverStrategy?: CrossoverStrategy
  ) {}

  mutate(mutationRate: number, mutationStrategy?: MutationStrategy): this {
    const strategy = mutationStrategy || this.mutationStrategy;
    if (strategy) {
      this.genes = strategy.mutate(this.genes, mutationRate);
    } else {
      // Fallback to original behavior if no strategy provided
      if (Math.random() < mutationRate) {
        this.genes = shuffleArray(this.genes);
      }
    }
    return this;
  }

  crossover(partner: Individual, crossoverStrategy?: CrossoverStrategy): [Individual, Individual] {
    const strategy = crossoverStrategy || this.crossoverStrategy;
    if (strategy) {
      const [newGenes1, newGenes2] = strategy.crossover(this.genes, partner.genes);
      return [
        new Individual(newGenes1, this.mutationStrategy, this.crossoverStrategy),
        new Individual(newGenes2, this.mutationStrategy, this.crossoverStrategy),
      ];
    } else {
      // Fallback to original behavior if no strategy provided
      const sectionPoint = Math.floor(this.genes.length * 0.75);
      const half = Math.random() < 0.5 ? 'start' : 'end';

      const newGenes1 = this.combineGenes(this.genes, partner.genes, sectionPoint, half);
      const newGenes2 = this.combineGenes(partner.genes, this.genes, sectionPoint, half);

      return [
        new Individual(newGenes1, this.mutationStrategy, this.crossoverStrategy),
        new Individual(newGenes2, this.mutationStrategy, this.crossoverStrategy),
      ];
    }
  }

  private combineGenes(
    genes1: Gene[],
    genes2: Gene[],
    sectionPoint: number,
    half: 'start' | 'end' = 'start'
  ): Gene[] {
    switch (half) {
      case 'start':
        return this.combineFromStart(genes1, genes2, sectionPoint);
      case 'end':
        return this.combineFromEnd(genes1, genes2, sectionPoint);
      default:
        throw new Error('Invalid half');
    }
  }

  private combineFromStart(genes1: Gene[], genes2: Gene[], sectionPoint: number): Gene[] {
    const startSection = genes1.slice(0, sectionPoint);

    return startSection.concat(
      genes2.reduce<Gene[]>((newGene, gene) => {
        if (!newGene.includes(gene) && !startSection.includes(gene)) {
          newGene.push(gene);
        }
        return newGene;
      }, [])
    );
  }

  private combineFromEnd(genes1: Gene[], genes2: Gene[], sectionPoint: number): Gene[] {
    const endSection = genes1.slice(sectionPoint, genes1.length);

    return genes2
      .reduce<Gene[]>((newGene, gene) => {
        if (!newGene.includes(gene) && !endSection.includes(gene)) {
          newGene.push(gene);
        }
        return newGene;
      }, [])
      .concat(endSection);
  }
}

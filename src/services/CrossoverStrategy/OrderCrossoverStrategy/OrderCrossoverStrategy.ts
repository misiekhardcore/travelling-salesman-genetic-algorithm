import { CrossoverStrategy } from '../CrossoverStrategy';

export class OrderCrossoverStrategy implements CrossoverStrategy {
  crossover(parent1: number[], parent2: number[]): [number[], number[]] {
    const sectionPoint = Math.floor(parent1.length * 0.75);
    const half = Math.random() < 0.5 ? 'start' : 'end';

    const newGenes1 = this.combineGenes(parent1, parent2, sectionPoint, half);
    const newGenes2 = this.combineGenes(parent2, parent1, sectionPoint, half);

    return [newGenes1, newGenes2];
  }

  private combineGenes(
    genes1: number[],
    genes2: number[],
    sectionPoint: number,
    half: 'start' | 'end' = 'start'
  ): number[] {
    switch (half) {
      case 'start':
        return this.combineFromStart(genes1, genes2, sectionPoint);
      case 'end':
        return this.combineFromEnd(genes1, genes2, sectionPoint);
      default:
        throw new Error('Invalid half');
    }
  }

  private combineFromStart(genes1: number[], genes2: number[], sectionPoint: number): number[] {
    const startSection = genes1.slice(0, sectionPoint);

    return startSection.concat(
      genes2.reduce<number[]>((newGene, gene) => {
        if (!newGene.includes(gene) && !startSection.includes(gene)) {
          newGene.push(gene);
        }
        return newGene;
      }, [])
    );
  }

  private combineFromEnd(genes1: number[], genes2: number[], sectionPoint: number): number[] {
    const endSection = genes1.slice(sectionPoint, genes1.length);

    return genes2
      .reduce<number[]>((newGene, gene) => {
        if (!newGene.includes(gene) && !endSection.includes(gene)) {
          newGene.push(gene);
        }
        return newGene;
      }, [])
      .concat(endSection);
  }
}

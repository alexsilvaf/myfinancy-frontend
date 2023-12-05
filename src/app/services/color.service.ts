import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private colorsCache: Map<number, string> = new Map();

  constructor() {}

  private generateColorForIndex(index: number): string {
    let seed = index; // Use o índice como semente para o gerador pseudoaleatório
    const random = () => {
      const x = Math.sin(seed++) * 28;
      return x - Math.floor(x);
    };

    const r = Math.floor(random() * 256);
    const g = Math.floor(random() * 256);
    const b = Math.floor(random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }

  public getHarmoniousColors(count: number): string[] {
    const colors: string[] = [];
    
    for (let i = 0; i < count; i++) {
      if (!this.colorsCache.has(i)) {
        this.colorsCache.set(i, this.generateColorForIndex(i));
      }
      colors.push(this.colorsCache.get(i));
    }

    return colors;
  }
}

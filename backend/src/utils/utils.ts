
export function shuffleArray<T>(array: T[]): T[] {

    for (let i = array.length - 1; i > 0; i--) {
      // Pick a random index from 0 to i
      const j = Math.floor(Math.random() * (i + 1));
      
      // Swap elements at indices i and j
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function flattenAndFillObject<T extends string | number | symbol>(target:{ [key in T]: number }): T[] {

  return Object.entries(target).flatMap(([key, count]) => Array(count).fill(key) as T[])
}

// export function cubicToCartesian(q: number,r: number): {x: number, y: number} {
//   const x = HEX_SIZE * (q + 0.5 * r);
//   const y = HEX_RADIUS * r;
//   return { x, y };
// }

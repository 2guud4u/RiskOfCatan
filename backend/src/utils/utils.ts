
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

export function rotate60degree(coord: {x: number, y: number, z: number}): {x: number, y: number, z: number} {
  let x = coord.x;
  let y = coord.y;
  let z = coord.z;
  return {x: -y, y: -z, z: -x}
}

export function serializeCoords(coords:  {x: number, y: number, z: number}): string {
  return `${coords.x},${coords.y},${coords.z}`;
}
export function deserializeCoords(serialized: string):  {x: number, y: number, z: number} {
  const [x, y, z] = serialized.split(',').map(Number);
  return { x, y, z };
}

export function getRotatedHexCoords(rootCoords: {x: number, y: number, z: number}): {x: number, y: number, z: number}[] {
  let coords = [];
  let rotated = rootCoords;
  for (let i = 0; i < 6; i++) {
    rotated = rotate60degree(rotated);
    coords.push(rotated);
  }
  return coords;
}

// export function cubicToCartesian(q: number,r: number): {x: number, y: number} {
//   const x = HEX_SIZE * (q + 0.5 * r);
//   const y = HEX_RADIUS * r;
//   return { x, y };
// }

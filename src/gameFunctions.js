export const neighborIsAlive = (neighbor) => neighbor && neighbor.isActive

export const numAliveNeighbors = (cellsPerRow, data, i) => {
  let neighbors = 0

  neighborIsAlive(data[i - 1]) && (neighbors += 1)
  neighborIsAlive(data[i + 1]) && (neighbors += 1)
  neighborIsAlive(data[i + cellsPerRow]) && (neighbors += 1)
  neighborIsAlive(data[i - cellsPerRow]) && (neighbors += 1)
  neighborIsAlive(data[i + 1 + cellsPerRow]) && (neighbors += 1)
  neighborIsAlive(data[i - 1 + cellsPerRow]) && (neighbors += 1)
  neighborIsAlive(data[i + 1 - cellsPerRow]) && (neighbors += 1)
  neighborIsAlive(data[i - 1 - cellsPerRow]) && (neighbors += 1)

  return neighbors
}

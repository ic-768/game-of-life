export const initialiseCells = (cellsPerRow, cellsPerColumn) =>
  //spawn all cells as inactive
  Array.from({length: cellsPerRow * cellsPerColumn}, (_, i) => ({
    id: i,
    isActive: false,
  }))

/**
 * Used to determine whether a cell lives or dies on next render
 */
export const neighborIsAlive = (neighbor) => neighbor && neighbor.isActive
export const numAliveNeighbors = (cellsPerRow, data, i) =>
  [
    data[i - 1] || data[data.length],
    data[i + 1] || data[0],
    data[i + cellsPerRow] || data[i + cellsPerRow - data.length],
    data[i - cellsPerRow] || data[data.length - Math.abs(i - cellsPerRow)],
    data[i + cellsPerRow + 1] || data[i + 1 + cellsPerRow - data.length],
    data[i + cellsPerRow - 1] || data[i - 1 + cellsPerRow - data.length],
    data[i - cellsPerRow + 1] ||
      data[1 + data.length - Math.abs(i - cellsPerRow)],
    data[i - cellsPerRow - 1] ||
      data[data.length - Math.abs(i - cellsPerRow) - 1],
  ].reduce(
    (total, neighbor) => (neighborIsAlive(neighbor) ? ++total : total),
    0
  )

/**
 * Yields data for next game render
 */
export const stepGame = function* (cells, cellsPerRow) {
  const updatedData = cells.map((c, i) => {
    const neighbors = numAliveNeighbors(cellsPerRow, cells, i)
    let isActive = true
    if (
      (!c.isActive && neighbors !== 3) ||
      (c.isActive && (neighbors < 2 || neighbors > 3))
    ) {
      isActive = false
    }
    return {...c, isActive}
  })
  yield updatedData
}

/**
 * Shifts the cell-array circularly
 * rowLength=1 looks like it's moving left or right
 * rowLength=cellsPerRow looks like its going up or down
 */
export const shiftBoard = (arr, reverse, rowLength = 1) => {
  const newArr = [...arr]
  for (let i = 0; i < rowLength; i++) {
    if (reverse) newArr.unshift(newArr.pop())
    else newArr.push(newArr.shift())
  }
  return newArr
}

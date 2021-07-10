export const initialiseCells = (cellsPerRow, cellsPerColumn) =>
  Array.from({length: cellsPerRow * cellsPerColumn}, (_, i) => ({
    id: i,
    isActive: false,
  }))

/**
 * A map function to randomise all cells
 */
export const randomiseCells = (currentCell) =>
  Math.random() > 0.8
    ? {...currentCell, isActive: true}
    : {...currentCell, isActive: false}

/**
 * A map function to toggle a single cell
 */
export const toggleCell = (targetId) => (cellBeingChecked) => {
  return cellBeingChecked.id !== targetId
    ? cellBeingChecked
    : {...cellBeingChecked, isActive: !cellBeingChecked.isActive}
}
/**
 * A map function to reset all cells
 */
export const resetCells = (c) => ({...c, isActive: false})

/**
 * Used to determine whether a cell lives or dies on next render
 */
export const neighborIsAlive = (neighbor) => neighbor && neighbor.isActive
export const numAliveNeighbors = (cellsPerRow, data, i) => {
  // Restore the two dimensional nature of the data
  const cellIsAlive = (x, y) => {
    if (x >= 0 && x < cellsPerRow) {
      const index = x + y * cellsPerRow
      if (index >= 0 && index < data.length) {
        return neighborIsAlive(data[index])
      }
    }
    return false
  }

  const x = i % cellsPerRow
  const y = Math.floor(i / cellsPerRow)

  // This is how much easier numAliveNeighbors is to write if your cells are an
  // array of arrays, rather than a single array.
  const neighborhood = [-1, 0, 1].map((xRel) => {
    return [-1, 0, 1].map((yRel) => cellIsAlive(x + xRel, y + yRel))
  })

  neighborhood[1][1] = false // We don't count the cell itself as it's own neighbour

  return neighborhood.flat().filter((alive) => alive).length
}

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

/**
 * To get id of a cell when using touch devices
 */
export const getCellIdFromTouch = (e) => {
  const touchLocation = e.nativeEvent.changedTouches[0]
  const touchTarget = document.elementFromPoint(
    touchLocation.clientX,
    touchLocation.clientY
  )
  if (touchTarget) {
    const targetId = touchTarget.className.match(/cell.*active (.*)/)
    if (targetId && Number(targetId[1]) !== null) {
      return Number(targetId[1])
    }
  }
  return null
}

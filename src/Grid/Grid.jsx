import { useState, useEffect, useMemo, useCallback } from "react"
import { getCellIdFromTouch } from "../utils/gameFunctions"

const Grid = ({ game, transitionTime }) => {
  const [lastTouched, setLastTouched] = useState(0) // to prevent unnecessary toggling on touch-devices
  const [isDragging, setIsDragging] = useState(false) // to change state of cells on drag

  useEffect(() => {
    const dragOn = () => setIsDragging(true)
    const dragOff = () => setIsDragging(false)
    document.addEventListener("mousedown", dragOn)
    document.addEventListener("mouseup", dragOff)
    return () => {
      document.removeEventListener("mousedown", dragOn)
      document.removeEventListener("mouseup", dragOff)
    }
  }, [])

  const onMouseDown = (cell) => () => game.toggleGameCell(cell.id)
  const onMouseOver = (cell) => () => {
    if (isDragging && !game.isRunning) {
      game.toggleGameCell(cell.id)
    }
  }
  const onTouchMove = (e) => {
    const cellID = getCellIdFromTouch(e)
    if (lastTouched === cellID) return
    cellID && game.toggleGameCell(cellID)
    setLastTouched(cellID)
  }

  const gridStyle = useMemo(
    () => ({
      width: `${window.innerWidth}px`,
      gridTemplateColumns: `repeat(${game.cellsPerRow},1fr)`,
      gridTemplateRows: `repeat(${game.cellsPerColumn},1fr)`,
    }),
    [game.cellsPerRow, game.cellsPerColumn]
  )

  const cellStyle = useCallback(
    (cell) => ({
      animation:
        (cell.isActive && `forwards fade-in ${transitionTime}s`) ||
        (!cell.isActive && `forwards fade-out ${transitionTime}s`),
      transition: `${transitionTime}s`,
      width: `${game.cellSize}px`,
      height: `${game.cellSize}px`,
    }),
    [game.cellSize, transitionTime]
  )

  const cellClass = (cell) =>
    `cell ${cell.isActive ? "active" : "inactive"} ${cell.id}`

  return (
    <div
      className="grid"
      onDragStart={(e) => e.preventDefault()}
      style={gridStyle}
    >
      {game.cells.map((c, i) => (
        <div
          onMouseOver={onMouseOver(c)}
          onTouchMove={onTouchMove}
          onMouseDown={onMouseDown(c)}
          style={cellStyle(c)}
          className={cellClass(c)}
          key={i}
        ></div>
      ))}
    </div>
  )
}
export default Grid

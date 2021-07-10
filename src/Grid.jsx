import {useState, useEffect} from "react"
import {getCellIdFromTouch} from "./gameFunctions"

const Grid = ({game, transitionTime}) => {
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

  return (
    <div
      className="grid"
      onDragStart={(event) => event.preventDefault()}
      style={{
        width: `${window.innerWidth}px`,
        gridTemplateColumns: `repeat(${game.cellsPerRow},1fr)`,
        gridTemplateRows: `repeat(${game.cellsPerColumn},1fr)`,
      }}>
      {game.cells.map((c, i) => (
        <div
          onMouseOver={() => {
            if (isDragging && !game.isRunning) {
              game.toggleGameCell(c.id)
            }
          }}
          onTouchMove={(e) => {
            const cellID = getCellIdFromTouch(e)
            cellID && game.toggleGameCell(cellID)
          }}
          onMouseDown={() => game.toggleGameCell(c.id)}
          style={{
            animation:
              (c.isActive && `forwards fade-in ${transitionTime}s`) ||
              (!c.isActive && `forwards fade-out ${transitionTime}s`),
            transition: `${transitionTime}s`,
            width: `${game.cellSize}px`,
            height: `${game.cellSize}px`,
          }}
          className={`cell ${c.isActive ? "active" : "inactive"} ${c.id}`}
          key={i}></div>
      ))}
    </div>
  )
}
export default Grid

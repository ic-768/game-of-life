import "./App.css"
import {useState, useEffect, useRef} from "react"
import {shiftBoard, initialiseCells, stepGame} from "./gameFunctions"

function App() {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  const delay = (d) => new Promise((r) => setTimeout(r, d)) // helper func to delay rendering
  const [delayTime, setDelayTime] = useState(250)

  const cellSize = 25
  const cellsPerColumn = Math.floor(windowHeight / cellSize) - 4
  const cellsPerRow = Math.floor(windowWidth / cellSize)
  const [cells, setCells] = useState([])

  const [autopilot, setAutopilot] = useState(false) // if on, run game at delayTime intervals
  const [drag, setDrag] = useState(false) // to change state of cells on drag
  const iterator = useRef() // is bound to generator for receiving game data

  useEffect(() => {
    const dragOn = () => setDrag(true)
    const dragOff = () => setDrag(false)
    document.addEventListener("mousedown", dragOn)
    document.addEventListener("mouseup", dragOff)
    return () => {
      document.removeEventListener("mousedown", dragOn)
      document.removeEventListener("mouseup", dragOff)
    }
  }, [])

  useEffect(() => {
    //initialise game
    setCells(initialiseCells(cellsPerRow, cellsPerColumn))
  }, [cellsPerColumn, cellsPerRow])

  useEffect(() => {
    iterator.current = stepGame(cells, cellsPerRow)
  }, [cellsPerRow, cells])

  useEffect(() => {
    const runGame = async () => {
      await delay(delayTime)
      setCells(iterator.current.next().value || cells)
    }
    if (autopilot) {
      runGame()
    }
  }, [autopilot, cells, delayTime])

  return (
    <div className="App">
      <div
        className="grid"
        style={{
          width: `${windowWidth}px`,
          gridTemplateColumns: `repeat(${cellsPerRow},1fr)`,
          gridTemplateRows: `repeat(${cellsPerColumn},1fr)`,
        }}>
        {cells.map((c, i) => (
          <div
            onMouseOver={() => {
              if (drag && !autopilot) {
                setCells(
                  cells.map((d) =>
                    d.id !== c.id ? d : {...d, isActive: !d.isActive}
                  )
                )
              }
            }}
            onMouseDown={
              autopilot
                ? () => {
                    setAutopilot(false)
                  }
                : () => {
                    setCells(
                      cells.map((d) =>
                        d.id !== c.id ? d : {...d, isActive: !d.isActive}
                      )
                    )
                  }
            }
            style={{
              display: "inline",
              width: `${cellSize}px`,
              height: `${cellSize}px`,
            }}
            className={`cell ${c.isActive ? "active" : "inactive"}`}
            key={i}></div>
        ))}
      </div>
      <button
        onClick={() => {
          setCells(iterator.current.next().value)
        }}>
        SINGLE STEP
      </button>
      <button
        style={{backgroundColor: autopilot ? "green" : "red"}}
        onClick={async () => {
          setAutopilot(!autopilot)
        }}>
        AUTOPILOT
      </button>
      <input
        disabled={autopilot}
        value={delayTime}
        onChange={(e) => {
          setDelayTime(e.target.value < 20 ? 20 : e.target.value) //
        }}
        type="number"
      />
      <button
        onClick={() => {
          setCells(
            cells.map((d) =>
              Math.random() > 0.8
                ? {...d, isActive: true}
                : {...d, isActive: false}
            )
          )
        }}>
        Randomise
      </button>
      <button
        onClick={() => {
          setCells(cells.map((d) => ({...d, isActive: false})))
        }}>
        CLEAR
      </button>
      <button
        onClick={() => {
          setCells(shiftBoard(cells, false))
        }}>
        LEFT
      </button>
      <button
        onClick={() => {
          setCells(shiftBoard(cells, true))
        }}>
        RIGHT
      </button>
      <button
        onClick={() => {
          setCells(shiftBoard(cells, false, cellsPerRow))
        }}>
        UP
      </button>
      <button
        onClick={() => {
          setCells(shiftBoard(cells, true, cellsPerRow))
        }}>
        DOWN
      </button>
    </div>
  )
}

export default App

import "./App.css"
import {useState, useEffect, useRef} from "react"
import {shiftBoard, initialiseCells, stepGame} from "./gameFunctions"

function App() {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  const delay = (d) => new Promise((r) => setTimeout(r, d)) // helper func to delay rendering
  const [delayTime, setDelayTime] = useState(250)

  const [cellSize, setCellSize] = useState(25)
  const [toolbarIsExpanded, setToolbarIsExpanded] = useState(true)
  const cellsPerColumn = Math.floor(windowHeight / cellSize) - 1
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

  //Prevent updates while game is running
  const safeAction = (action) => () => {
    if (autopilot) {
      setAutopilot(false)
    } else {
      action()
    }
  }

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
            onMouseDown={safeAction(() => {
              setCells(
                cells.map((d) =>
                  d.id !== c.id ? d : {...d, isActive: !d.isActive}
                )
              )
            })}
            style={{
              display: "inline",
              width: `${cellSize}px`,
              height: `${cellSize}px`,
            }}
            className={`cell ${c.isActive ? "active" : "inactive"}`}
            key={i}></div>
        ))}
      </div>
      <div
        className={`toolbar ${toolbarIsExpanded ? "expanded" : "collapsed"}`}>
        <div className="controls-container">
          <div className="button-group">
            <label>Play</label>
            <div>
              <button
                onClick={() => {
                  setCells(iterator.current.next().value)
                }}>
                <i className="fa fa-step-forward" aria-hidden="true"></i>
              </button>
              <button
                className={`playbutton ${autopilot ? "stop" : "play"}`}
                onClick={async () => {
                  setAutopilot(!autopilot)
                }}>
                {autopilot ? (
                  <i className="fa fa-pause-circle" aria-hidden="true"></i>
                ) : (
                  <i className="fa fa-fast-forward" aria-hidden="true"></i>
                )}
              </button>
            </div>
          </div>
          <div className="button-group game-speed-container">
            <label>Time between Renders</label>
            <div className="delay-input-container">
              <i className="fa fa-tachometer" aria-hidden="true"></i>
              <input
                className="delay-input"
                value={delayTime}
                onFocus={() => {
                  autopilot && setAutopilot(false)
                }}
                onChange={(e) => {
                  setDelayTime(e.target.value < 20 ? 20 : e.target.value)
                }}
                type="number"
              />
            </div>
          </div>
          <div className="button-group">
            <label>Board</label>
            <div>
              <button
                onClick={safeAction(() => {
                  setCells(
                    cells.map((d) =>
                      Math.random() > 0.8
                        ? {...d, isActive: true}
                        : {...d, isActive: false}
                    )
                  )
                })}>
                <i className="fa fa-random" aria-hidden="true"></i>
              </button>
              <button
                onClick={safeAction(() => {
                  setCells(cells.map((d) => ({...d, isActive: false})))
                })}>
                <i className="fa fa-trash" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div className="button-group">
            <button
              onClick={safeAction(() => {
                setCells(shiftBoard(cells, false, cellsPerRow))
              })}>
              <i className="fa fa-arrow-up"></i>
            </button>
            <div>
              <button
                onClick={safeAction(() => {
                  setCells(shiftBoard(cells, false))
                })}>
                <i className="fa fa-arrow-left"></i>
              </button>
              <button
                onClick={safeAction(() => {
                  setCells(shiftBoard(cells, true))
                })}>
                <i className="fa fa-arrow-right"></i>
              </button>
            </div>
            <button
              onClick={safeAction(() => {
                setCells(shiftBoard(cells, true, cellsPerRow))
              })}>
              <i className="fa fa-arrow-down"></i>
            </button>
          </div>
        </div>
        <button
          onClick={() => {
            setToolbarIsExpanded(!toolbarIsExpanded)
          }}>
          {toolbarIsExpanded ? (
            <i className="fa fa-chevron-up" aria-hidden="true"></i>
          ) : (
            <i className="fa fa-chevron-down" aria-hidden="true"></i>
          )}
        </button>
      </div>
    </div>
  )
}

export default App

import "./App.css"
import {useState, useEffect, useRef} from "react"
import {
  initialiseCells,
  randomiseCells,
  resetCells,
  toggleCell,
  stepGame,
  shiftBoard,
  getCellIdFromTouch,
} from "./gameFunctions"
import LabelledButton from "./LabelledButton"
import IconButton from "./IconButton"
import LabelledInput from "./LabelledInput"

function App() {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const [toolbarIsExpanded, setToolbarIsExpanded] = useState(true)

  const delay = (d) => new Promise((r) => setTimeout(r, d)) // helper func to delay rendering
  const [delayTime, setDelayTime] = useState(30)

  const [transitionTime, setTransitionTime] = useState(1) //time for cell fade-in/out

  const [cellSize, setCellSize] = useState(40)
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

  /**
   * Initialise game
   */
  useEffect(() => {
    setCells(initialiseCells(cellsPerRow, cellsPerColumn))
  }, [cellsPerColumn, cellsPerRow])

  /**
   * Bind ref to game generator
   */
  useEffect(() => {
    iterator.current = stepGame(cells, cellsPerRow)
  }, [cellsPerRow, cells])

  /**
   * Play game
   */
  useEffect(() => {
    const runGame = async () => {
      await delay(delayTime)
      setCells(iterator.current.next().value || cells)
    }
    if (autopilot) {
      runGame()
    }
  }, [autopilot, cells, delayTime])

  /**
   *Prevent updates while game is running
   *(Not really needed since buttons are disabled when running the game - but good to keep around)
   */
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
        onDragStart={(event) => event.preventDefault()}
        style={{
          width: `${windowWidth}px`,
          gridTemplateColumns: `repeat(${cellsPerRow},1fr)`,
          gridTemplateRows: `repeat(${cellsPerColumn},1fr)`,
        }}>
        {cells.map((c, i) => (
          <div
            onMouseOver={() => {
              if (drag && !autopilot) {
                setCells(cells.map(toggleCell(c.id)))
              }
            }}
            onTouchMove={(e) => {
              const cellID = getCellIdFromTouch(e)
              cellID && setCells(cells.map(toggleCell(cellID)))
            }}
            onMouseDown={safeAction(() => {
              setCells(cells.map(toggleCell(c.id)))
            })}
            style={{
              animation:
                (c.isActive && `forwards fade-in ${transitionTime}s`) ||
                (!c.isActive && `forwards fade-out ${transitionTime}s`),
              transition: `${transitionTime}s`,
              width: `${cellSize}px`,
              height: `${cellSize}px`,
            }}
            className={`cell ${c.isActive ? "active" : "inactive"} ${c.id}`}
            key={i}></div>
        ))}
      </div>
      <div
        className={`toolbar ${toolbarIsExpanded ? "expanded" : "collapsed"}`}>
        <div className="controls-container">
          <div className="button-group">
            <LabelledButton
              label="Step"
              className="step-button"
              iconName="fa fa-step-forward"
              onClick={() => {
                setCells(iterator.current.next().value)
              }}
              disabled={autopilot}
            />
            <LabelledButton
              label="Play"
              className={`play-button ${autopilot ? "stop" : "play"}`}
              iconName={autopilot ? "fa fa-pause-circle" : "fa fa-fast-forward"}
              onClick={async () => {
                setAutopilot(!autopilot)
              }}
            />
          </div>
          <div className="time-control-container">
            <LabelledInput
              label="Render time"
              value={delayTime}
              className="delay-input"
              iconName="fa fa-tachometer"
              onFocus={() => {
                autopilot && setAutopilot(false)
              }}
              onChange={(e) =>
                safeAction(() =>
                  setDelayTime(e.target.value < 20 ? 20 : e.target.value)
                )()
              }
            />
            <LabelledInput
              label="Transition time"
              value={transitionTime}
              className="transition-input"
              iconName="fa fa-clock-o"
              onChange={(e) =>
                setTransitionTime(
                  e.target.value > 10
                    ? 10
                    : e.target.value < 0
                    ? 0
                    : e.target.value
                )
              }
            />
          </div>
          <div className="button-group">
            <LabelledButton
              label="Shuffle"
              className="shuffle-button"
              iconName="fa fa-random"
              onClick={safeAction(() => {
                setCells(cells.map(randomiseCells))
              })}
              disabled={autopilot}
            />
            <LabelledButton
              label="Clear"
              className="clear-button"
              iconName="fa fa-trash"
              onClick={safeAction(() => {
                setCells(cells.map(resetCells))
              })}
              disabled={autopilot}
            />
          </div>
          <div className="button-group vertical">
            <IconButton
              className="shift-up-button"
              iconName="fa fa-arrow-up"
              onClick={safeAction(() => {
                setCells(shiftBoard(cells, false, cellsPerRow))
              })}
              disabled={autopilot}
            />
            <div>
              <IconButton
                className="shift-left-button"
                iconName="fa fa-arrow-left"
                onClick={safeAction(() => {
                  setCells(shiftBoard(cells, false))
                })}
                disabled={autopilot}
              />
              <IconButton
                className="shift-right-button"
                iconName="fa fa-arrow-right"
                onClick={safeAction(() => {
                  setCells(shiftBoard(cells, true))
                })}
                disabled={autopilot}
              />
            </div>
            <IconButton
              className="shift-down-button"
              iconName="fa fa-arrow-down"
              onClick={safeAction(() => {
                setCells(shiftBoard(cells, true, cellsPerRow))
              })}
              disabled={autopilot}
            />
          </div>
        </div>
        <IconButton
          className="expand-collapse-button"
          iconName={
            toolbarIsExpanded ? "fa fa-chevron-up" : "fa fa-chevron-down"
          }
          onClick={() => {
            setToolbarIsExpanded(!toolbarIsExpanded)
          }}
        />
      </div>
    </div>
  )
}

export default App

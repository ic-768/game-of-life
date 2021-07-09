import "./App.css"
import useGameOfLife from "./useGameOfLife"
import {useState, useEffect} from "react"
import {
  randomiseCells,
  resetCells,
  toggleCell,
  shiftBoard,
  getCellIdFromTouch,
} from "./gameFunctions"
import IconButton from "./IconButton"
import LabelledInput from "./LabelledInput"

function App() {
  const windowWidth = window.innerWidth

  const [toolbarIsExpanded, setToolbarIsExpanded] = useState(true)
  const [transitionTime, setTransitionTime] = useState(1) //time for cell fade-in/out
  const [drag, setDrag] = useState(false) // to change state of cells on drag

  const game = useGameOfLife()

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
   *Prevent updates while game is running
   *(Not really needed since buttons are disabled when running the game - but good to keep around)
   */
  const safeAction = (action) => () => {
    if (game.autopilot) {
      game.setAutopilot(false)
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
          gridTemplateColumns: `repeat(${game.cellsPerRow},1fr)`,
          gridTemplateRows: `repeat(${game.cellsPerColumn},1fr)`,
        }}>
        {game.cells.map((c, i) => (
          <div
            onMouseOver={() => {
              if (drag && !game.autopilot) {
                game.setCells(game.cells.map(toggleCell(c.id)))
              }
            }}
            onTouchMove={(e) => {
              const cellID = getCellIdFromTouch(e)
              cellID &&
                safeAction(() => {
                  game.setCells(game.cells.map(toggleCell(cellID)))
                })
            }}
            onMouseDown={safeAction(() => {
              game.setCells(game.cells.map(toggleCell(c.id)))
            })}
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
      <div
        className={`toolbar ${toolbarIsExpanded ? "expanded" : "collapsed"}`}>
        <div className="controls-container">
          <div className="time-control-container">
            <LabelledInput
              label="Render time"
              type="range"
              min={10}
              max={1000}
              value={game.delayTime}
              className="transition-input"
              iconName="fa fa-tachometer"
              onFocus={() => {
                game.autopilot && game.setAutopilot(false)
              }}
              onChange={(e) =>
                safeAction(() => game.setDelayTime(e.target.value, 20))()
              }
            />
            <LabelledInput
              label="Transition time"
              type="range"
              min={0}
              max={5}
              value={transitionTime}
              className="transition-input"
              iconName="fa fa-clock-o"
              onChange={(e) => {
                setTransitionTime(e.target.value)
              }}
            />
            <LabelledInput
              label="Cell size"
              type="range"
              min={25}
              max={40}
              value={game.cellSize}
              className="transition-input"
              iconName="fa fa-circle-thin"
              onChange={(e) => {
                game.setCellSize(e.target.value)
              }}
            />
          </div>
          <div className="button-group ">
            <div className="button-column">
              <IconButton
                className="step-button"
                iconName="fa fa-step-forward"
                onClick={() => {
                  game.setCells(game.iterator.current.next().value)
                }}
                disabled={game.autopilot}
              />
              <IconButton
                className="shuffle-button"
                iconName="fa fa-random"
                onClick={safeAction(() => {
                  game.setCells(game.cells.map(randomiseCells))
                })}
                disabled={game.autopilot}
              />
            </div>
            <div className="button-column">
              <IconButton
                className={`play-button ${game.autopilot ? "stop" : "play"}`}
                iconName={game.autopilot ? "fa fa-pause" : "fa fa-play"}
                onClick={async () => {
                  game.setAutopilot(!game.autopilot)
                }}
              />
              <IconButton
                className="clear-button"
                iconName="fa fa-trash"
                onClick={safeAction(() => {
                  game.setCells(game.cells.map(resetCells))
                })}
                disabled={game.autopilot}
              />
            </div>
          </div>
          <div className="button-group vertical">
            <IconButton
              className="shift-up-button"
              iconName="fa fa-arrow-up"
              onClick={safeAction(() => {
                game.setCells(shiftBoard(game.cells, false, game.cellsPerRow))
              })}
              disabled={game.autopilot}
            />
            <div>
              <IconButton
                className="shift-left-button"
                iconName="fa fa-arrow-left"
                onClick={safeAction(() => {
                  game.setCells(shiftBoard(game.cells, false))
                })}
                disabled={game.autopilot}
              />
              <IconButton
                className="shift-right-button"
                iconName="fa fa-arrow-right"
                onClick={safeAction(() => {
                  game.setCells(shiftBoard(game.cells, true))
                })}
                disabled={game.autopilot}
              />
            </div>
            <IconButton
              className="shift-down-button"
              iconName="fa fa-arrow-down"
              onClick={safeAction(() => {
                game.setCells(shiftBoard(game.cells, true, game.cellsPerRow))
              })}
              disabled={game.autopilot}
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

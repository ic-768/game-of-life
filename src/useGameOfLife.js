import {useState, useRef, useEffect} from "react"
import {
  initialiseCells,
  stepGame,
  randomiseCells,
  resetCells,
  shiftBoard,
  toggleCell,
} from "./gameFunctions"

/**
 * Custom hook to create game instance
 */
const useGameOfLife = () => {
  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth

  const iterator = useRef()
  const delay = (d) => new Promise((r) => setTimeout(r, d)) // helper func to delay rendering

  const [delayTime, setDelayTime] = useState(30)
  const [cellSize, setCellSize] = useState(50)
  const cellsPerColumn = Math.floor(windowHeight / cellSize) - 1
  const cellsPerRow = Math.floor(windowWidth / cellSize)
  const [cells, setCells] = useState([])
  const [isRunning, setIsRunning] = useState(false) // if on, run game at delayTime intervals

  /**
   *Wrapper to prevent updates while game is running
   */
  const safeAction = (action) => () => {
    if (isRunning) {
      setIsRunning(false)
    } else {
      action()
    }
  }

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
    if (isRunning) {
      runGame()
    }
  }, [isRunning, cells, delayTime])

  return {
    cells,
    cellSize,
    setCellSize,
    isRunning,
    setIsRunning,
    delayTime,
    setDelayTime: (t) => safeAction(setDelayTime(t)),
    playOrPause: () => setIsRunning(!isRunning),
    stepGame: () => setCells(iterator.current.next().value),
    resetGameCells: () => setCells(cells.map(resetCells)),
    randomiseGameCells: () => setCells(cells.map(randomiseCells)),
    toggleGameCell: (id) =>
      safeAction(() => {
        setCells(cells.map(toggleCell(id)))
      })(),
    shiftBoardUp: () =>
      safeAction(setCells(shiftBoard(cells, false, cellsPerRow))),
    shiftBoardDown: () =>
      safeAction(setCells(shiftBoard(cells, true, cellsPerRow))),
    shiftBoardLeft: () => safeAction(setCells(shiftBoard(cells, false))),
    shiftBoardRight: () => safeAction(setCells(shiftBoard(cells, true))),
  }
}

export default useGameOfLife

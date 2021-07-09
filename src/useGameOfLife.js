import {useState, useRef, useEffect} from "react"
import {initialiseCells, stepGame} from "./gameFunctions"

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
  const [autopilot, setAutopilot] = useState(false) // if on, run game at delayTime intervals

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

  return {
    cells,
    setCells,
    iterator,
    delayTime,
    setDelayTime,
    cellSize,
    setCellSize,
    autopilot,
    setAutopilot,
  }
}

export default useGameOfLife

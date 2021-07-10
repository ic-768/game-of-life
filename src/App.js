import "./App.css"
import {useState} from "react"
import useGameOfLife from "./useGameOfLife"
import Toolbar from "./Toolbar/Toolbar"
import Grid from "./Grid"

function App() {
  const [transitionTime, setTransitionTime] = useState(1) //time for cell fade-in/out
  const game = useGameOfLife()

  return (
    <div className="App">
      <Toolbar
        game={game}
        transitionTime={transitionTime}
        setTransitionTime={setTransitionTime}
      />
      <Grid game={game} transitionTime={transitionTime} />
    </div>
  )
}

export default App

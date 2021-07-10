import {useState} from "react"
import SliderPanel from "./panel_pieces/SliderPanel"
import GamePanel from "./panel_pieces/GamePanel"
import BoardPanel from "./panel_pieces/BoardPanel"
import IconButton from "../UI_Components/IconButton"

const Toolbar = ({game, transitionTime, setTransitionTime}) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className={`toolbar ${isExpanded ? "expanded" : "collapsed"}`}>
      <div className="controls-container">
        <SliderPanel
          game={game}
          transitionTime={transitionTime}
          setTransitionTime={setTransitionTime}
        />
        <GamePanel game={game} />
        <BoardPanel game={game} />
      </div>
      <IconButton
        className="expand-collapse-button"
        iconName={isExpanded ? "fa fa-chevron-up" : "fa fa-chevron-down"}
        onClick={() => {
          setIsExpanded(!isExpanded)
        }}
      />
    </div>
  )
}

export default Toolbar

import { useState } from "react"

import SliderPanel from "./panel_pieces/SliderPanel"
import GamePanel from "./panel_pieces/GamePanel"
import BoardPanel from "./panel_pieces/BoardPanel"
import IconButton from "../UI_Components/IconButton"

const Toolbar = ({ game, transitionTime, setTransitionTime }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const onClick = () => setIsExpanded((e) => !e)
  const toolbarClass = `toolbar ${isExpanded ? "expanded" : "collapsed"}`
  const chevronClass = isExpanded ? "fa fa-chevron-up" : "fa fa-chevron-down"

  return (
    <div className={toolbarClass}>
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
        iconName={chevronClass}
        onClick={onClick}
      />
    </div>
  )
}

export default Toolbar

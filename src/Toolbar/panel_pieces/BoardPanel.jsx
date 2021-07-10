import IconButton from "../../UI_Components/IconButton"

const BoardPanel = ({game}) => (
  <div className="button-group vertical">
    <IconButton
      className="shift-up-button"
      iconName="fa fa-arrow-up"
      onClick={game.shiftBoardUp}
      disabled={game.isRunning}
    />
    <div>
      <IconButton
        className="shift-left-button"
        iconName="fa fa-arrow-left"
        onClick={game.shiftBoardLeft}
        disabled={game.isRunning}
      />
      <IconButton
        className="shift-right-button"
        iconName="fa fa-arrow-right"
        onClick={game.shiftBoardRight}
        disabled={game.isRunning}
      />
    </div>
    <IconButton
      className="shift-down-button"
      iconName="fa fa-arrow-down"
      onClick={game.shiftBoardDown}
      disabled={game.isRunning}
    />
  </div>
)
export default BoardPanel

import IconButton from "../../UI_Components/IconButton"

const GamePanel = ({game}) => (
  <div className="button-group">
    <div className="button-column">
      <IconButton
        className="step-button"
        iconName="fa fa-step-forward"
        onClick={() => {
          game.stepGame()
        }}
        disabled={game.isRunning}
      />
      <IconButton
        className="shuffle-button"
        iconName="fa fa-random"
        onClick={game.randomiseGameCells}
        disabled={game.isRunning}
      />
    </div>
    <div className="button-column">
      <IconButton
        className={`play-button ${game.isRunning ? "stop" : "play"}`}
        iconName={game.isRunning ? "fa fa-pause" : "fa fa-play"}
        onClick={game.playOrPause}
      />
      <IconButton
        className="clear-button"
        iconName="fa fa-trash"
        onClick={game.resetGameCells}
        disabled={game.isRunning}
      />
    </div>
  </div>
)
export default GamePanel

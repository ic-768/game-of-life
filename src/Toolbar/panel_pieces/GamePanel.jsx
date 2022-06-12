import IconButton from "../../UI_Components/IconButton"

const GamePanel = ({ game }) => {
  const onStep = () => game.stepGame()

  const playButtonClass = `play-button ${game.isRunning ? "stop" : "play"}`
  const playButtonIcon = game.isRunning ? "fa fa-pause" : "fa fa-play"

  return (
    <div className="button-group">
      <div className="button-column">
        <IconButton
          className="step-button"
          iconName="fa fa-step-forward"
          onClick={onStep}
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
          className={playButtonClass}
          iconName={playButtonIcon}
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
}
export default GamePanel

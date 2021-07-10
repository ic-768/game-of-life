import LabelledInput from "../../UI_Components/LabelledInput"

/**
 * Panel piece responsible for setting the times for render and transition, and cell-size
 */
const SliderPanel = ({game, transitionTime, setTransitionTime}) => (
  <div className="slider-container">
    <LabelledInput
      label="Render time"
      type="range"
      min={10}
      max={1000}
      value={game.delayTime}
      className="transition-input"
      iconName="fa fa-tachometer"
      onFocus={() => {
        game.isRunning && game.setIsRunning(false)
      }}
      onChange={(e) => game.setDelayTime(e.target.value, 20)}
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
)

export default SliderPanel

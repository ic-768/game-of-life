import LabelledInput from "../../UI_Components/LabelledInput"

/**
 * Panel piece responsible for setting the times for render and transition, and cell-size
 */
const SliderPanel = ({ game, transitionTime, setTransitionTime }) => {
  const onChangeTransitionTime = (e) => setTransitionTime(e.target.value)
  const onFocusRenderTime = () => {
    game.isRunning && game.setIsRunning(false)
  }
  const onChangeRenderTime = (e) => game.setDelayTime(e.target.value, 20)
  const onChangeCellSize = (e) => game.setCellSize(e.target.value)

  return (
    <div className="slider-container">
      <LabelledInput
        label="Render time"
        type="range"
        min={10}
        max={1000}
        value={game.delayTime}
        className="slider-input"
        iconName="fa fa-tachometer"
        onFocus={onFocusRenderTime}
        onChange={onChangeRenderTime}
      />
      <LabelledInput
        label="Transition time"
        type="range"
        min={0}
        max={5}
        value={transitionTime}
        className="slider-input"
        iconName="fa fa-clock-o"
        onChange={onChangeTransitionTime}
      />
      <LabelledInput
        label="Cell size"
        type="range"
        min={25}
        max={40}
        value={game.cellSize}
        className="slider-input"
        iconName="fa fa-circle-thin"
        onChange={onChangeCellSize}
      />
    </div>
  )
}

export default SliderPanel

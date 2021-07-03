import IconButton from "./IconButton"

const LabelledButton = ({label, onClick, className, iconName, disabled}) => (
  <div className={`labelled-button ${className} container`}>
    <label>{label}</label>
    <IconButton
      disabled={disabled}
      onClick={onClick}
      className={`${className}${disabled ? " disabled" : ""}`}
      iconName={iconName}
    />
  </div>
)

export default LabelledButton

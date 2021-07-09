import IconInput from "./IconInput"

/**
 *  Simple Icon Input decorated with a label and optional value display
 */
const LabelledInput = ({
  label,
  value,
  className,
  iconName,
  onFocus,
  onChange,
  onBlur,
  placeholder,
  type,
  min,
  max,
}) => (
  <div className="labelled-input">
    <label>{label}</label>
    <div className="input-and-display">
      <IconInput
        placeholder={placeholder}
        value={value}
        type={type}
        min={min}
        max={max}
        className={className}
        iconName={iconName}
        onFocus={onFocus}
        onChange={onChange}
        onBlur={onBlur}
      />
      <div className="value-display">{value}</div>
    </div>
  </div>
)

export default LabelledInput

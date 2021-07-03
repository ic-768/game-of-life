import IconInput from "./IconInput"

/**
 *  Simple Icon Input decorated with a label
 */
const LabelledInput = ({
  label,
  value,
  className,
  iconName,
  onFocus,
  onChange,
}) => (
  <div className="labelled-input">
    <label>{label}</label>
    <IconInput
      value={value}
      className={className}
      iconName={iconName}
      onFocus={onFocus}
      onChange={onChange}
    />
  </div>
)

export default LabelledInput

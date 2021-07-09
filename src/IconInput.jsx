/**
 * Input element with a font-awesome icon in front
 */
const IconInput = ({
  value,
  className,
  iconName,
  onFocus,
  onChange,
  onBlur,
  placeholder,
  min,
  max,
  type = "number",
}) => (
  <div className={`${className}-container`}>
    <i className={iconName}></i>
    <input
      className={`${className}`}
      placeholder={placeholder}
      value={value}
      onFocus={onFocus}
      onChange={onChange}
      onBlur={onBlur}
      type={type}
      min={min}
      max={max}
    />
  </div>
)

export default IconInput

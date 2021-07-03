/**
 * Input element with a font-awesome icon in front
 */
const IconInput = ({
  value,
  className,
  iconName,
  onFocus,
  onChange,
  type = "number",
}) => (
  <div className={`${className}-container`}>
    <i className={iconName}></i>
    <input
      className={`${className}`}
      value={value}
      onFocus={onFocus}
      onChange={onChange}
      type={type}
    />
  </div>
)

export default IconInput

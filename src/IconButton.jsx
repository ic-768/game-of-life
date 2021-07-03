/**
 * Button containing a font-awesome icon
 */
const IconButton = ({onClick, className, iconName, disabled}) => (
  <button
    disabled={disabled}
    className={`${className}${disabled ? " disabled" : ""}`}
    onClick={onClick}>
    <i className={iconName}></i>
  </button>
)
export default IconButton

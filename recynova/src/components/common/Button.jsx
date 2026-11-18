
function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;

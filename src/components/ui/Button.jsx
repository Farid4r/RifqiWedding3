const variantClasses = {
  primary:
    'border border-burgundy bg-burgundy text-ivory hover:bg-maroon hover:border-maroon',
  secondary:
    'border border-burgundy bg-transparent text-burgundy hover:bg-burgundy hover:text-ivory',
  text: 'border border-transparent bg-transparent text-burgundy underline-offset-4 hover:underline',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  const classes = variantClasses[variant] ?? variantClasses.primary

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-control px-5 py-2 font-sans text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${classes} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}

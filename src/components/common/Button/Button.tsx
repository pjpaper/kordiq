import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Button component props
 * See: explanations/components/Button.md for detailed explanation
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

/**
 * Reusable button component with variants and states
 * 
 * @param variant - Visual style (primary, secondary, danger)
 * @param size - Button size (sm, md, lg)
 * @param isLoading - Shows spinner when true
 * @param children - Button content
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  className = '',
  ...rest
}) => {
  const variantClasses = 
    variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-600/50' :
    variant === 'secondary' ? 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-200/50' :
    'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600/50';

  const sizeClasses =
    size === 'sm' ? 'px-3 py-1.5 text-sm' :
    size === 'lg' ? 'px-6 py-3 text-lg' :
    'px-4 py-2 text-base';

  const baseClasses = 'rounded font-semibold transition-colors cursor-pointer';
  const loadingClasses = isLoading ? 'opacity-75 pointer-events-none' : '';
  const finalClassName = `${baseClasses} ${variantClasses} ${sizeClasses} ${loadingClasses} ${className}`;

  return (
    <button
      disabled={disabled || isLoading}
      className={finalClassName}
      {...rest}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

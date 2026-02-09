import type { HTMLAttributes, ReactNode } from 'react';

const BADGE_VARIANTS = ['success', 'error', 'warning', 'info'] as const;
const BADGE_SIZES = ['sm', 'md'] as const;

/**
 * Badge component props
 * See: explanations/components/Badge.md for detailed explanation
 */
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: (typeof BADGE_VARIANTS)[number];
  size?: (typeof BADGE_SIZES)[number];
  children: ReactNode;
}

/**
 * Status indicator badge component
 * 
 * @param variant - Status type (success, error, warning, info)
 * @param size - Badge size (sm, md)
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'info',
  size = 'sm',
  children,
  className = '',
  ...rest
}) => {
  const variantStyles: Record<typeof BADGE_VARIANTS[number], string> = {
    success: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    warning: 'bg-yellow-100 text-yellow-700',
    info: 'bg-blue-100 text-blue-700',
  };

  const sizeStyles: Record<typeof BADGE_SIZES[number], string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const baseStyles = 'font-semibold rounded-full inline-block whitespace-nowrap';

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
};

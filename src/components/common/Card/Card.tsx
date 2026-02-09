import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Card component props
 * See: explanations/components/Card.md for detailed explanation
 */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  isClickable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

/**
 * Container component for grouping related content
 * Supports optional header and footer sections
 * 
 * @param header - Optional top section
 * @param footer - Optional bottom section
 * @param isClickable - Apply hover effect
 * @param padding - Padding variant (sm, md, lg)
 */
export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  isClickable = false,
  padding = 'md',
  className = '',
  ...rest
}) => {
  const baseStyles = 'bg-white rounded-lg border border-gray-200 shadow-sm transition-all';
  const hoverStyles = isClickable ? 'hover:shadow-md hover:border-blue-300 cursor-pointer' : '';
  const paddingStyles: Record<string, string> = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div className={`${baseStyles} ${hoverStyles} ${paddingStyles[padding]} ${className}`} {...rest}>
      {header && (
        <div className="border-b border-gray-100 pb-3 mb-3">
          {header}
        </div>
      )}

      {children}

      {footer && (
        <div className="border-t border-gray-100 pt-3 mt-3">
          {footer}
        </div>
      )}
    </div>
  );
};

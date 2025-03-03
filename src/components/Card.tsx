import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  footer,
  headerAction,
  variant = 'default',
  padding = 'md',
  bordered = false,
  hoverable = false,
}) => {
  // Estilos de variantes
  const variantStyles = {
    default: 'bg-white shadow-md',
    outlined: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg',
    flat: 'bg-gray-50',
  };

  // Estilos de padding
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  // Classes condicionais
  const borderedClass = bordered ? 'border border-gray-200' : '';
  const hoverableClass = hoverable ? 'transition-shadow duration-300 hover:shadow-lg' : '';

  return (
    <div 
      className={`
        rounded-lg overflow-hidden 
        ${variantStyles[variant]} 
        ${borderedClass} 
        ${hoverableClass} 
        ${className}
      `}
    >
      {(title || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      
      <div className={paddingStyles[padding]}>
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;

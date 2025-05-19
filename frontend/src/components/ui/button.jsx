import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const getVariantClasses = () => {
    const variants = {
      default: 'bg-blue-600 hover:bg-blue-700 text-white',
      outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
      ghost: 'hover:bg-gray-100 text-gray-600',
      destructive: 'bg-red-600 hover:bg-red-700 text-white',
    };
    return variants[variant] || variants.default;
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'text-sm py-1 px-3 rounded',
      md: 'py-2 px-4 rounded-md',
      lg: 'text-lg py-2 px-5 rounded-md',
      icon: 'p-2 rounded-md',
    };
    return sizes[size] || sizes.md;
  };

  return (
    <button
      className={`font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 inline-flex items-center justify-center ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };

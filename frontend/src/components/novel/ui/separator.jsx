import React from 'react';

export const Separator = ({ orientation = "horizontal" }) => {
  return (
    <div 
      className={`
        ${orientation === "horizontal" ? "w-full h-px" : "h-full w-px"} 
        bg-gray-200 dark:bg-neutral-700
      `}
    />
  );
};

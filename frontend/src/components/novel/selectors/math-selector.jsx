import React from 'react';
import { FunctionSquare } from 'lucide-react';

export const MathSelector = () => {
  return (
    <button
      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-800"
      title="Math formula"
      onClick={() => {
        // In a real implementation, this would open a dialog to input a math formula
        // and then insert it into the editor
      }}
    >
      <FunctionSquare size={16} />
    </button>
  );
};

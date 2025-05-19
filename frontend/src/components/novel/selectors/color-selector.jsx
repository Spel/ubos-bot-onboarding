import React from 'react';
import { Palette } from 'lucide-react';

export const ColorSelector = ({ open, onOpenChange }) => {
  const colors = [
    { name: "Default", color: "var(--novel-black)" },
    { name: "Purple", color: "#9333EA" },
    { name: "Red", color: "#E00000" },
    { name: "Yellow", color: "#EAB308" },
    { name: "Blue", color: "#2563EB" },
    { name: "Green", color: "#008A00" },
    { name: "Orange", color: "#FFA500" },
    { name: "Pink", color: "#BA4081" },
    { name: "Gray", color: "#A8A29E" },
  ];

  return (
    <div className="relative">
      <button
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-800"
        onClick={() => onOpenChange(!open)}
        title="Text color"
      >
        <Palette size={16} />
      </button>
      
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 bg-white dark:bg-neutral-800 rounded-md shadow-md border border-gray-200 dark:border-neutral-700 p-1">
          <div className="grid grid-cols-3 gap-1 p-1">
            {colors.map((item) => (
              <button
                key={item.name}
                className="w-6 h-6 rounded-md"
                style={{ backgroundColor: item.color }}
                title={item.name}
                onClick={() => {
                  // In a real implementation, this would use the editor from context
                  // editor.chain().focus().setColor(item.color).run();
                  onOpenChange(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

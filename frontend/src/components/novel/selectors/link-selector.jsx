import React, { useState } from 'react';
import { Link2 } from 'lucide-react';

export const LinkSelector = ({ open, onOpenChange }) => {
  const [url, setUrl] = useState('');

  return (
    <div className="relative">
      <button
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-800"
        onClick={() => onOpenChange(!open)}
        title="Link"
      >
        <Link2 size={16} />
      </button>
      
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 bg-white dark:bg-neutral-800 rounded-md shadow-md border border-gray-200 dark:border-neutral-700 p-2 w-60">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Paste link..."
              className="w-full p-1 border border-gray-200 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-sm"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </button>
              <button
                className="px-2 py-1 text-xs rounded-md bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => {
                  // In a real implementation, this would use the editor from context
                  // editor.chain().focus().setLink({ href: url }).run();
                  onOpenChange(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

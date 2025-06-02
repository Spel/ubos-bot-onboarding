import React from "react";
import { cn } from "../../lib/utils";

/**
 * Separator component for visual separation between elements
 * @param {Object} props - Component props
 * @param {string} props.orientation - Orientation of the separator ("horizontal" or "vertical")
 * @param {string} props.className - Additional CSS classes
 */
export function Separator({
  orientation = "horizontal",
  className,
  ...props
}) {
  return (
    <div
      data-orientation={orientation}
      className={cn(
        "shrink-0 bg-gray-200 dark:bg-neutral-700",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  );
}

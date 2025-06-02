import React from 'react';
import { cn } from '../../lib/utils';

const CollapsibleContext = React.createContext(null);

export function Collapsible({
  defaultOpen = false,
  open,
  onOpenChange,
  asChild = false,
  className,
  children,
  ...props
}) {
  const [_open, _setOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : _open;

  const handleOpenChange = React.useCallback(
    (value) => {
      if (isControlled) {
        onOpenChange?.(value);
      } else {
        _setOpen(value);
      }
    },
    [isControlled, onOpenChange]
  );

  const contextValue = React.useMemo(
    () => ({ open: isOpen, onOpenChange: handleOpenChange }),
    [isOpen, handleOpenChange]
  );

  const Comp = asChild ? React.Fragment : 'div';

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <Comp
        data-state={isOpen ? 'open' : 'closed'}
        className={asChild ? undefined : className}
        {...props}
      >
        {children}
      </Comp>
    </CollapsibleContext.Provider>
  );
}

export function CollapsibleTrigger({ asChild = false, className, children, ...props }) {
  const { open, onOpenChange } = React.useContext(CollapsibleContext);
  const Comp = asChild ? React.Fragment : 'button';

  return (
    <Comp
      type={asChild ? undefined : 'button'}
      aria-expanded={open}
      onClick={() => onOpenChange(!open)}
      className={asChild ? undefined : cn('', className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function CollapsibleContent({ asChild = false, className, children, ...props }) {
  const { open } = React.useContext(CollapsibleContext);
  const Comp = asChild ? React.Fragment : 'div';

  if (!open) return null;

  return (
    <Comp
      className={asChild ? undefined : cn('', className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import type { ReactNode } from "react";

type CmsTopbarSlotContextValue = {
  setTopbarSlot: (content: ReactNode | null) => void;
};

const CmsTopbarSlotContext = createContext<CmsTopbarSlotContextValue | null>(null);

export function CmsTopbarSlotProvider({
  children,
  onSlotChange,
}: {
  children: ReactNode;
  onSlotChange: (content: ReactNode | null) => void;
}) {
  const value = useMemo<CmsTopbarSlotContextValue>(
    () => ({ setTopbarSlot: onSlotChange }),
    [onSlotChange],
  );

  return (
    <CmsTopbarSlotContext.Provider value={value}>
      {children}
    </CmsTopbarSlotContext.Provider>
  );
}

export function useCmsTopbarSlot(content: ReactNode | null, deps: unknown[]) {
  const context = useContext(CmsTopbarSlotContext);

  useEffect(() => {
    if (!context) return;
    context.setTopbarSlot(content);
    return () => {
      context.setTopbarSlot(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, ...deps]);
}

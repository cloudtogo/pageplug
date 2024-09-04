import React from "react";
import type { ReactNode } from "react";

import { useTooltip } from "./src/useTooltip";
import { TooltipContext } from "./src/TooltipContext";
import type { TooltipOptions } from "./src/useTooltip";

type TooltipProps = { children: ReactNode } & TooltipOptions;

export function Tooltip({ children, ...options }: TooltipProps) {
  const tooltip = useTooltip(options);

  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  );
}

"use client";

import { useMediaQuery } from "@/hooks";

export function useIsMobile() {
  return useMediaQuery("(max-width: 768px)");
}

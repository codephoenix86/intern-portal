import { cn } from "@/lib/utils";

/**
 * Shared Lucide sizing + stroke so icons feel hand-tuned rather than default
 * template weights (which often read as “AI dashboard”).
 */
export function appIconNav(className?: string): string {
  return cn("h-4 w-4 shrink-0 stroke-[1.65]", className);
}

export function appIconMd(className?: string): string {
  return cn("h-5 w-5 shrink-0 stroke-[1.6]", className);
}

export function appIconLg(className?: string): string {
  return cn("h-6 w-6 shrink-0 stroke-[1.55]", className);
}

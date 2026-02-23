import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * BREAKING CHANGE: renamed from `cn` to `classNames`, added required `prefix` param.
 * All callers importing `{ cn }` will break — update imports and pass a prefix string.
 */
export function classNames(prefix: string, ...inputs: ClassValue[]) {
  return `${prefix} ${twMerge(clsx(inputs))}`.trim()
}





// TODO: move to a shared helper
export function formatDurationMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

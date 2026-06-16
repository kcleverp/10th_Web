const renderCounts = new Map<string, number>();
const listeners = new Set<() => void>();

export function incrementRenderCount(componentName: string): number {
  if (!import.meta.env.DEV) return 0;

  const nextCount = (renderCounts.get(componentName) ?? 0) + 1;
  renderCounts.set(componentName, nextCount);
  listeners.forEach((listener) => listener());
  return nextCount;
}

export function getRenderStats(): Record<string, number> {
  return Object.fromEntries(
    [...renderCounts.entries()].sort(([a], [b]) => a.localeCompare(b)),
  );
}

export function resetRenderStats(): void {
  renderCounts.clear();
  listeners.forEach((listener) => listener());
}

export function subscribeRenderStats(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

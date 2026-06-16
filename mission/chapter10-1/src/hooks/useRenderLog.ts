import { incrementRenderCount } from '../dev/renderStats';

export function useRenderLog(componentName: string, detail?: Record<string, unknown>): void {
  if (!import.meta.env.DEV) return;

  const count = incrementRenderCount(componentName);

  console.log(
    `[Render] ${componentName} #${count}`,
    detail ? detail : '',
  );
}

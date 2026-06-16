import type { ProfilerOnRenderCallback } from 'react';

export const onProfilerRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
) => {
  if (!import.meta.env.DEV) return;

  console.log(
    `[Profiler] ${id} | ${phase} | actual: ${actualDuration.toFixed(2)}ms | base: ${baseDuration.toFixed(2)}ms`,
  );
};

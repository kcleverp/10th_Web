import { useEffect, useState } from 'react';
import { getRenderStats, resetRenderStats, subscribeRenderStats } from '../../dev/renderStats';

export default function RenderDebugPanel() {
  const [stats, setStats] = useState(getRenderStats);

  useEffect(() => subscribeRenderStats(() => setStats(getRenderStats())), []);

  if (!import.meta.env.DEV) return null;

  const entries = Object.entries(stats);

  return (
    <aside className="fixed bottom-4 right-4 z-[100] w-72 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-gray-900">Render Debug (DevTools용)</p>
          <p className="text-[10px] text-gray-500">Profiler 탭과 함께 확인하세요</p>
        </div>
        <button
          type="button"
          onClick={resetRenderStats}
          className="rounded-md border border-gray-300 px-2 py-1 text-[10px] font-semibold text-gray-600 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-gray-400">아직 리렌더 기록이 없습니다.</p>
      ) : (
        <ul className="max-h-48 space-y-1 overflow-y-auto text-xs">
          {entries.map(([name, count]) => (
            <li key={name} className="flex items-center justify-between rounded-md bg-gray-50 px-2 py-1">
              <span className="truncate text-gray-700">{name}</span>
              <span className="ml-2 shrink-0 font-bold text-blue-600">{count}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-[10px] leading-relaxed text-gray-500">
        Chrome React DevTools → Profiler → Record 후 제목 입력, 검색, 모달 열기를 테스트하세요.
      </p>
    </aside>
  );
}

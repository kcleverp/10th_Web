import { useNavigate } from 'react-router-dom';
import type { Lp } from '../types/common';

interface LpCardProps {
  lp: Lp;
}

const LpChip = ({ lp }: LpCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/lps/${lp.id}`)}
      className="group cursor-pointer flex flex-col bg-white border border-[#ccc] rounded-sm transition-all hover:border-[#807bff] hover:shadow-sm overflow-hidden">
      <div className="relative aspect-square overflow-hidden border-b border-[#eee]">
        <img
          src={lp.thumbnail || 'https://via.placeholder.com/300'}
          alt={lp.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
    
        <div className="absolute top-2 right-2 bg-white/80 px-2 py-1 rounded-sm border border-[#ccc] text-[10px] font-medium text-gray-600">
          좋아요 {lp.likes?.length ?? 0}
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2">
        <h3 className="text-sm font-bold text-black truncate group-hover:text-[#807bff] transition-colors">
          {lp.title}
        </h3>
        

        <div className="flex gap-1 flex-wrap h-[18px] overflow-hidden">
          {lp.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag.id}
              className="text-[9px] border border-[#eee] text-gray-400 px-1.5 py-0.5 rounded-sm bg-[#fafafa]"
            >
              #{tag.name}
            </span>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-1">
          {new Date(lp.createdAt).toLocaleDateString('ko-KR')}
        </p>
      </div>
    </div>
  );
};

export default LpChip;
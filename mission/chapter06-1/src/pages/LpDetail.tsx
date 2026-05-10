import { useNavigate, useParams } from 'react-router-dom';
import useLpDetail from '../hooks/useLpDetail';
import { useAuth } from '../context/AuthContext';
import { likeLp, deleteLp } from '../apis/lpApi';
import { useMemo } from 'react';

const LpDetailPage = () => {
  const { lpId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: lp, isLoading, isError, refetch } = useLpDetail(Number(lpId));

  const isOwner = useMemo(() => {
    if (!user || !lp || !lp.author) return false;
    return user.id === lp.author.id; 
  }, [user, lp]);

  if (isLoading) return <div className="py-20 text-center text-gray-400 animate-pulse">LOADING...</div>;
  if (isError || !lp) return <div className="py-20 text-center text-gray-400">RECORD NOT FOUND.</div>;

  return (
    <div className="flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-[340px] flex flex-col gap-6">
        <div className="flex justify-between items-end border-b pb-4">
          <h1 className="text-2xl font-black">{lp.title}</h1>
          {isOwner && (
            <div className="flex gap-2 mb-1">
              <button onClick={() => navigate(`/edit/${lp.id}`)} className="text-[10px] text-gray-400 underline">EDIT</button>
              <button 
                onClick={async () => { if(confirm('삭제하시겠습니까?')) { await deleteLp(lp.id); navigate('/'); } }} 
                className="text-[10px] text-gray-400 underline"
              >
                DELETE
              </button>
            </div>
          )}
        </div>


        <img src={lp.thumbnail || 'https://via.placeholder.com/600'} className="w-full aspect-square object-cover border" alt="thumbnail" />

        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{lp.content}</p>

        <div className="flex flex-wrap gap-2">
          {lp.tags.map(tag => <span key={tag.id} className="text-[10px] text-[#807bff] font-bold">#{tag.name}</span>)}
        </div>

        <button
          onClick={async () => {
            if (!user) return navigate('/login');
            await likeLp(lp.id);
            refetch();
          }}
          className="w-full bg-[#807bff] text-white py-4 font-black tracking-widest hover:bg-black transition-colors"
        >
          LIKE ({lp.likes.length})
        </button>
      </div>
    </div>
  );
};

export default LpDetailPage;
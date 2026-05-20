const CommentSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 py-4 border-b border-gray-50 animate-pulse">

      <div className="flex justify-between items-center">
        <div className="h-3 bg-gray-200 rounded-sm w-20" /> 
        <div className="h-3 bg-gray-100 rounded-sm w-16" /> 
      </div>
      
      <div className="flex flex-col gap-2 mt-1">
        <div className="h-4 bg-gray-100 rounded-sm w-full" />
        <div className="h-4 bg-gray-100 rounded-sm w-2/3" />
      </div>
    </div>
  );
};

export default CommentSkeleton;
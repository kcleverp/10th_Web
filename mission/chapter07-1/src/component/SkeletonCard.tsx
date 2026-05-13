const SkeletonCard = () => {
  return (
    <div className="flex flex-col gap-4 animate-pulse">

      <div className="aspect-square bg-gray-200 rounded-sm w-full" />

      <div className="flex flex-col gap-2">

        <div className="h-5 bg-gray-200 rounded-sm w-3/4" />
        
        <div className="flex justify-between items-center mt-1">

          <div className="h-3 bg-gray-100 rounded-sm w-1/3" />

          <div className="h-3 bg-gray-100 rounded-sm w-1/4" />
        </div>
      </div>


      <div className="flex gap-2">
        <div className="h-5 bg-gray-50 rounded-sm w-12" />
        <div className="h-5 bg-gray-50 rounded-sm w-12" />
      </div>
    </div>
  );
};

export default SkeletonCard;
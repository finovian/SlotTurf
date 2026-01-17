
export const CardSkeleton = () => (
  <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm space-y-3 animate-pulse">
    <div className="flex justify-between">
      <div className="h-4 w-1/3 bg-neutral-100 rounded" />
      <div className="h-8 w-8 bg-neutral-50 rounded-lg" />
    </div>
    <div className="h-8 w-1/2 bg-neutral-100 rounded" />
    <div className="h-3 w-3/4 bg-neutral-50 rounded" />
  </div>
);

export const ListSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {[1, 2].map(group => (
      <div key={group} className="space-y-3">
        <div className="h-3 w-20 bg-neutral-100 rounded ml-2" />
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-neutral-50 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-neutral-100 rounded-xl" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-neutral-100 rounded" />
                <div className="h-3 w-20 bg-neutral-50 rounded" />
              </div>
            </div>
            <div className="h-6 w-16 bg-neutral-50 rounded" />
          </div>
        ))}
      </div>
    ))}
  </div>
);

export const RevenueSkeleton = () => (
  <div className="py-4 space-y-8 animate-pulse">
    <div className="flex justify-between items-center px-1">
      <div className="h-6 w-24 bg-neutral-100 rounded-lg" />
      <div className="h-10 w-32 bg-neutral-100 rounded-full" />
    </div>
    <div className="bg-neutral-800 rounded-4xl p-8 h-48" />
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white h-32 rounded-[28px] border border-neutral-100" />
      <div className="bg-white h-32 rounded-[28px] border border-neutral-100" />
    </div>
    <div className="space-y-4">
      <div className="h-4 w-32 bg-neutral-100 rounded ml-2" />
      <div className="bg-white h-64 rounded-4xl border border-neutral-100" />
    </div>
  </div>
);

export const AvailabilitySkeleton = () => (
  <div className="py-4 space-y-6 animate-pulse">
    <div className="flex justify-between items-center px-1">
      <div className="h-6 w-32 bg-neutral-100 rounded-lg" />
      <div className="h-10 w-32 bg-neutral-100 rounded-full" />
    </div>
    <div className="flex gap-3 overflow-hidden pb-4 px-1">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="shrink-0 w-18 h-24 rounded-[28px] bg-white border border-neutral-100" />
      ))}
    </div>
    <div className="space-y-4">
      <div className="flex justify-between px-2">
        <div className="h-4 w-24 bg-neutral-100 rounded" />
        <div className="h-4 w-16 bg-neutral-100 rounded" />
      </div>
      <div className="bg-white h-96 rounded-4xl border border-neutral-100" />
    </div>
  </div>
);

export const SubscriptionSkeleton = () => (
  <div className="py-6 space-y-6 animate-pulse">
    <div className="bg-neutral-800 rounded-4xl p-8 h-64 shadow-xl" />
    <div className="bg-white rounded-3xl border border-neutral-100 p-8 space-y-6">
      <div className="h-6 w-1/2 bg-neutral-100 rounded" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-neutral-50 rounded" />
        <div className="h-4 w-3/4 bg-neutral-50 rounded" />
      </div>
      <div className="h-14 w-full bg-neutral-100 rounded-2xl" />
    </div>
  </div>
);



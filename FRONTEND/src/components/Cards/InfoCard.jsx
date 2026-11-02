import React from 'react';

const InfoCard = ({ icon, label, value, color = 'bg-primary' }) => {
  return (
    <div className="card flex items-center gap-4 p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-20px_rgba(27,39,68,0.3)] sm:p-6">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl text-white ${color} shadow-md shadow-slate-900/10 sm:h-14 sm:w-14`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-sm font-medium text-slate-500">{label}</p>
        <p className="truncate text-2xl font-semibold tracking-tight text-slate-950 sm:text-[1.75rem]">{value}</p>
      </div>
    </div>
  );
}

export default InfoCard;

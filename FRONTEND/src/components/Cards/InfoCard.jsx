import React from 'react';

const InfoCard = ({ icon, label, value, color = 'bg-primary' }) => {
  return (
    <div className="card p-6 flex items-center gap-4">
      {/* Icon Container */}
      <div className={`w-14 h-14 flex items-center justify-center text-2xl text-white ${color} rounded-lg shadow-md flex-shrink-0`}>
        {icon}
      </div>

      {/* Text Container */}
      <div className="flex-1">
        <p className="text-sm text-gray-600 font-medium mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default InfoCard;

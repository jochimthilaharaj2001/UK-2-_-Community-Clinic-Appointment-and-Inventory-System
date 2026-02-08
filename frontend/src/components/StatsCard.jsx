const StatsCard = ({ title, value, icon, change, trend, color }) => {
  return (
    <div className={`${color} border rounded-2xl p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg bg-white">
          {icon}
        </div>
        {change && (
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
            {trend === 'up' ? '↑' : '↓'} {change}
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
      <p className="text-gray-600">{title}</p>
    </div>
  );
};

export default StatsCard;

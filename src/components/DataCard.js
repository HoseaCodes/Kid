import React from "react";

// Utility function to format the price
const formatPrice = (value) => {
  return `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Enhanced DataCard component with Dashboard styling
const DataCard = ({ value, label, shouldFormat, growth, icon, trend = "up" }) => {
  const formattedValue = shouldFormat ? formatPrice(value) : Number(value).toLocaleString();
  const hasGrowth = growth !== undefined && growth !== null;
  const growthNum = parseFloat(growth);
  const isPositive = growthNum > 0;
  const isNegative = growthNum < 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header with Icon and Growth */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="w-10 h-10 bg-[#F38315]/10 rounded-lg flex items-center justify-center">
              <span className="text-lg">{icon}</span>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-gray-600">{label}</h3>
          </div>
        </div>
        
        {hasGrowth && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            isPositive 
              ? 'bg-green-100 text-green-700' 
              : isNegative 
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
          }`}>
            {isPositive ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7m0 10H7" />
              </svg>
            ) : isNegative ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10m0-10h10" />
              </svg>
            ) : null}
            <span>{Math.abs(growthNum)}%</span>
          </div>
        )}
      </div>

      {/* Main Value */}
      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-900">
          {formattedValue}
        </div>
        
        {hasGrowth && (
          <div className="text-sm text-gray-500">
            {isPositive ? '↗️ ' : isNegative ? '↘️ ' : '➡️ '}
            {Math.abs(growthNum)}% from last period
          </div>
        )}
      </div>

      {/* Progress Bar for Visual Appeal */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-500 ${
              isPositive || !hasGrowth ? 'bg-[#F38315]' : 'bg-red-400'
            }`}
            style={{ 
              width: hasGrowth 
                ? `${Math.min(Math.abs(growthNum) * 10, 100)}%` 
                : '60%' 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DataCard;
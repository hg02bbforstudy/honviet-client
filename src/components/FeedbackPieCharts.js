import React from 'react';

const PieChart = ({ title, data, size = 120 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-sm font-medium text-gray-700 mb-2">{title}</div>
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-xs text-gray-500">Chưa có dữ liệu</span>
        </div>
      </div>
    );
  }

  let cumulativePercentage = 0;
  const radius = size / 2 - 10;
  const center = size / 2;

  const slices = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startAngle = (cumulativePercentage / 100) * 360;
    const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
    
    cumulativePercentage += percentage;

    // Convert to radians
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);

    // Calculate path for the slice
    const x1 = center + radius * Math.cos(startAngleRad);
    const y1 = center + radius * Math.sin(startAngleRad);
    const x2 = center + radius * Math.cos(endAngleRad);
    const y2 = center + radius * Math.sin(endAngleRad);

    const largeArcFlag = percentage > 50 ? 1 : 0;

    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    return {
      path: pathData,
      color: item.color,
      percentage,
      label: item.label,
      value: item.value
    };
  });

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm font-medium text-gray-700 mb-2">{title}</div>
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {slices.map((slice, index) => {
            // Map Tailwind colors to actual hex values
            const colorMap = {
              'bg-green-500': '#10b981',
              'bg-yellow-500': '#f59e0b',
              'bg-red-500': '#ef4444',
              'bg-blue-500': '#3b82f6',
              'bg-purple-500': '#8b5cf6'
            };
            
            return (
              <path
                key={index}
                d={slice.path}
                fill={colorMap[slice.color] || '#6b7280'}
                className="hover:opacity-80 transition-opacity duration-200"
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-lg font-bold text-gray-800">{total}</div>
          <div className="text-xs text-gray-500">phản hồi</div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-3 space-y-1">
        {slices.map((slice, index) => (
          slice.value > 0 && (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div className={`w-3 h-3 rounded-full ${slice.color}`}></div>
              <span className="text-gray-600">
                {slice.label}: {slice.value} ({slice.percentage.toFixed(1)}%)
              </span>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

const FeedbackPieCharts = ({ stats }) => {
  if (!stats || !stats.totalFeedbacks) {
    return null;
  }

  // Dữ liệu cho biểu đồ tròn - chỉ hiển thị positive vs negative vs neutral
  const satisfactionData = [
    { 
      label: 'Tích cực', 
      value: (stats.q1Satisfied || 0) + (stats.q1VerySatisfied || 0), 
      color: 'bg-green-500' 
    },
    { 
      label: 'Bình thường', 
      value: stats.q1Neutral || 0, 
      color: 'bg-yellow-500' 
    },
    { 
      label: 'Tiêu cực', 
      value: (stats.q1Dissatisfied || 0) + (stats.q1VeryDissatisfied || 0), 
      color: 'bg-red-500' 
    }
  ];

  const usabilityData = [
    { 
      label: 'Dễ sử dụng', 
      value: (stats.q2Easy || 0) + (stats.q2VeryEasy || 0), 
      color: 'bg-green-500' 
    },
    { 
      label: 'Bình thường', 
      value: stats.q2Neutral || 0, 
      color: 'bg-yellow-500' 
    },
    { 
      label: 'Khó sử dụng', 
      value: (stats.q2Difficult || 0) + (stats.q2VeryDifficult || 0), 
      color: 'bg-red-500' 
    }
  ];

  const recommendationData = [
    { 
      label: 'Sẽ giới thiệu', 
      value: (stats.q3MaybeYes || 0) + (stats.q3DefinitelyYes || 0), 
      color: 'bg-green-500' 
    },
    { 
      label: 'Không chắc', 
      value: stats.q3NotSure || 0, 
      color: 'bg-yellow-500' 
    },
    { 
      label: 'Không giới thiệu', 
      value: (stats.q3MaybeNo || 0) + (stats.q3DefinitelyNo || 0), 
      color: 'bg-red-500' 
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Tổng quan phân tích</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PieChart
          title="Mức độ hài lòng"
          data={satisfactionData}
        />
        <PieChart
          title="Độ dễ sử dụng"
          data={usabilityData}
        />
        <PieChart
          title="Khả năng giới thiệu"
          data={recommendationData}
        />
      </div>
    </div>
  );
};

export default FeedbackPieCharts;

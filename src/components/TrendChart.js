import React from 'react';

const TrendChart = ({ feedbacks }) => {
  if (!feedbacks || feedbacks.length === 0) {
    return null;
  }

  // Nhóm feedback theo ngày
  const groupByDate = (feedbacks) => {
    const grouped = {};
    
    feedbacks.forEach(feedback => {
      const date = new Date(feedback.createdAt).toLocaleDateString('vi-VN');
      if (!grouped[date]) {
        grouped[date] = {
          date,
          count: 0,
          avgSatisfaction: 0,
          avgUsability: 0,
          avgRecommendation: 0,
          feedbacks: []
        };
      }
      
      grouped[date].count++;
      grouped[date].feedbacks.push(feedback);
    });

    // Tính điểm trung bình cho mỗi ngày
    Object.keys(grouped).forEach(date => {
      const dayData = grouped[date];
      const feedbacks = dayData.feedbacks;
      
      const scoreMap = {
        'Rất không hài lòng': 1, 'Không hài lòng': 2, 'Bình thường': 3, 'Hài lòng': 4, 'Rất hài lòng': 5,
        'Rất khó': 1, 'Khó': 2, 'Dễ': 4, 'Rất dễ': 5,
        'Chắc chắn không': 1, 'Có lẽ không': 2, 'Không chắc': 3, 'Có lẽ có': 4, 'Chắc chắn có': 5
      };

      const avgSatisfaction = feedbacks.reduce((sum, f) => sum + (scoreMap[f.question1Answer] || 3), 0) / feedbacks.length;
      const avgUsability = feedbacks.reduce((sum, f) => sum + (scoreMap[f.question2Answer] || 3), 0) / feedbacks.length;
      const avgRecommendation = feedbacks.reduce((sum, f) => sum + (scoreMap[f.question3Answer] || 3), 0) / feedbacks.length;

      dayData.avgSatisfaction = avgSatisfaction;
      dayData.avgUsability = avgUsability;
      dayData.avgRecommendation = avgRecommendation;
    });

    return Object.values(grouped).sort((a, b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-')));
  };

  const dailyData = groupByDate(feedbacks);
  
  // Chỉ hiển thị nếu có ít nhất 2 ngày dữ liệu
  if (dailyData.length < 2) {
    return (
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Xu hướng theo thời gian</h3>
        <p className="text-xs sm:text-sm text-gray-500">
          Cần ít nhất 2 ngày có dữ liệu để hiển thị biểu đồ xu hướng
        </p>
      </div>
    );
  }

  const LineChart = ({ data, title, color, dataKey }) => {
    const maxValue = 5; // Scale 1-5
    const minValue = 1;
    const chartHeight = 100;
    const chartWidth = 300;
    const padding = 20;

    const points = data.map((item, index) => {
      const x = padding + (index / (data.length - 1)) * (chartWidth - 2 * padding);
      const y = chartHeight - padding - ((item[dataKey] - minValue) / (maxValue - minValue)) * (chartHeight - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3">{title}</h4>
        <div className="w-full overflow-x-auto">
          <svg 
            width="100%" 
            height="120" 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="min-w-[250px] sm:min-w-[300px]"
          >
            {/* Grid lines */}
            {[1, 2, 3, 4, 5].map(value => {
              const y = chartHeight - padding - ((value - minValue) / (maxValue - minValue)) * (chartHeight - 2 * padding);
              return (
                <g key={value}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                  <text
                    x={padding - 5}
                    y={y + 3}
                    fontSize="10"
                    fill="#6b7280"
                    textAnchor="end"
                  >
                    {value}
                  </text>
                </g>
              );
            })}
            
            {/* Data line */}
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2"
              points={points}
            />
            
            {/* Data points */}
            {data.map((item, index) => {
              const x = padding + (index / (data.length - 1)) * (chartWidth - 2 * padding);
              const y = chartHeight - padding - ((item[dataKey] - minValue) / (maxValue - minValue)) * (chartHeight - 2 * padding);
              
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="3"
                    fill={color}
                  />
                  <text
                    x={x}
                    y={chartHeight - 5}
                    fontSize="8"
                    fill="#6b7280"
                    textAnchor="middle"
                    className="hidden sm:block"
                  >
                    {item.date.split('/')[0]}/{item.date.split('/')[1]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-600">
            Điểm TB: <span style={{ color }} className="font-semibold">
              {(data.reduce((sum, d) => sum + d[dataKey], 0) / data.length).toFixed(1)}/5
            </span>
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Xu hướng đánh giá theo thời gian</h3>
        <div className="text-xs sm:text-sm text-gray-500">
          {dailyData.length} ngày • {feedbacks.length} đánh giá
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <LineChart
          data={dailyData}
          title="Mức độ hài lòng"
          color="#3b82f6"
          dataKey="avgSatisfaction"
        />
        <LineChart
          data={dailyData}
          title="Độ dễ sử dụng"
          color="#10b981"
          dataKey="avgUsability"
        />
        <LineChart
          data={dailyData}
          title="Khả năng giới thiệu"
          color="#8b5cf6"
          dataKey="avgRecommendation"
        />
      </div>

      {/* Summary */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
        <h4 className="text-xs sm:text-sm font-semibold text-blue-800 mb-2">📈 Phân tích xu hướng:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-blue-700">
          <div>
            <span className="font-medium">Tổng số ngày:</span> {dailyData.length} ngày
          </div>
          <div>
            <span className="font-medium">Tổng phản hồi:</span> {feedbacks.length} đánh giá
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="font-medium">Trung bình/ngày:</span> {(feedbacks.length / dailyData.length).toFixed(1)} đánh giá
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;

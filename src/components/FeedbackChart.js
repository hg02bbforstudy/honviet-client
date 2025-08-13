import React from 'react';

const FeedbackChart = ({ stats }) => {
  if (!stats || !stats.totalFeedbacks) {
    return (
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Thống kê đánh giá</h3>
        <p className="text-sm sm:text-base text-gray-500">Chưa có dữ liệu đánh giá</p>
      </div>
    );
  }

  // Dữ liệu cho câu hỏi 1: Mức độ hài lòng
  const q1Data = [
    { label: 'Rất không hài lòng', value: stats.q1VeryDissatisfied || 0, color: 'bg-red-500' },
    { label: 'Không hài lòng', value: stats.q1Dissatisfied || 0, color: 'bg-orange-500' },
    { label: 'Bình thường', value: stats.q1Neutral || 0, color: 'bg-yellow-500' },
    { label: 'Hài lòng', value: stats.q1Satisfied || 0, color: 'bg-blue-500' },
    { label: 'Rất hài lòng', value: stats.q1VerySatisfied || 0, color: 'bg-green-500' }
  ];

  // Dữ liệu cho câu hỏi 2: Độ dễ sử dụng
  const q2Data = [
    { label: 'Rất khó', value: stats.q2VeryDifficult || 0, color: 'bg-red-500' },
    { label: 'Khó', value: stats.q2Difficult || 0, color: 'bg-orange-500' },
    { label: 'Bình thường', value: stats.q2Neutral || 0, color: 'bg-yellow-500' },
    { label: 'Dễ', value: stats.q2Easy || 0, color: 'bg-blue-500' },
    { label: 'Rất dễ', value: stats.q2VeryEasy || 0, color: 'bg-green-500' }
  ];

  // Dữ liệu cho câu hỏi 3: Khả năng giới thiệu
  const q3Data = [
    { label: 'Chắc chắn không', value: stats.q3DefinitelyNo || 0, color: 'bg-red-500' },
    { label: 'Có lẽ không', value: stats.q3MaybeNo || 0, color: 'bg-orange-500' },
    { label: 'Không chắc', value: stats.q3NotSure || 0, color: 'bg-yellow-500' },
    { label: 'Có lẽ có', value: stats.q3MaybeYes || 0, color: 'bg-blue-500' },
    { label: 'Chắc chắn có', value: stats.q3DefinitelyYes || 0, color: 'bg-green-500' }
  ];

  const BarChart = ({ title, data, total }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    
    return (
      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3">{title}</h4>
        <div className="space-y-1.5 sm:space-y-2">
          {data.map((item, index) => {
            const percentage = total > 0 ? (item.value / total * 100) : 0;
            const barWidth = maxValue > 0 ? (item.value / maxValue * 100) : 0;
            
            return (
              <div key={index} className="flex items-center gap-2 sm:gap-3">
                <div className="w-16 sm:w-20 text-xs text-gray-600 text-right leading-tight">
                  {item.label}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3 sm:h-4 relative overflow-hidden">
                  <div 
                    className={`h-full ${item.color} transition-all duration-300 ease-out`}
                    style={{ width: `${barWidth}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-white mix-blend-difference">
                      {item.value}
                    </span>
                  </div>
                </div>
                <div className="w-10 sm:w-12 text-xs text-gray-600 text-right">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Tổng: {total} phản hồi
        </div>
      </div>
    );
  };

  // Tính toán tổng điểm cho mỗi câu hỏi
  const q1Total = q1Data.reduce((sum, item) => sum + item.value, 0);
  const q2Total = q2Data.reduce((sum, item) => sum + item.value, 0);
  const q3Total = q3Data.reduce((sum, item) => sum + item.value, 0);

  // Tính điểm trung bình (1-5 scale)
  const calculateAverage = (data) => {
    const totalResponses = data.reduce((sum, item) => sum + item.value, 0);
    if (totalResponses === 0) return 0;
    
    const weightedSum = data.reduce((sum, item, index) => {
      return sum + (item.value * (index + 1)); // index + 1 để có scale 1-5
    }, 0);
    
    return (weightedSum / totalResponses).toFixed(2);
  };

  const q1Average = calculateAverage(q1Data);
  const q2Average = calculateAverage(q2Data);
  const q3Average = calculateAverage(q3Data);

  return (
    <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Thống kê đánh giá trải nghiệm AR</h3>
        <div className="text-xs sm:text-sm text-gray-500">
          Tổng: {stats.totalFeedbacks} đánh giá
        </div>
      </div>

      {/* Điểm trung bình tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
          <div className="text-lg sm:text-2xl font-bold text-blue-600">{q1Average}/5</div>
          <div className="text-xs sm:text-sm text-blue-800">Mức độ hài lòng</div>
        </div>
        <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
          <div className="text-lg sm:text-2xl font-bold text-green-600">{q2Average}/5</div>
          <div className="text-xs sm:text-sm text-green-800">Độ dễ sử dụng</div>
        </div>
        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
          <div className="text-lg sm:text-2xl font-bold text-purple-600">{q3Average}/5</div>
          <div className="text-xs sm:text-sm text-purple-800">Khả năng giới thiệu</div>
        </div>
      </div>

      {/* Biểu đồ chi tiết */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <BarChart 
          title="Mức độ hài lòng với trải nghiệm AR"
          data={q1Data}
          total={q1Total}
        />
        <BarChart 
          title="Độ dễ sử dụng của công nghệ AR"
          data={q2Data}
          total={q2Total}
        />
        <BarChart 
          title="Khả năng giới thiệu cho người khác"
          data={q3Data}
          total={q3Total}
        />
      </div>

      {/* Insights */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2">📊 Thông tin chi tiết:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
          <div>
            <span className="font-medium text-green-600">
              {((stats.q1Satisfied + stats.q1VerySatisfied) / stats.totalFeedbacks * 100).toFixed(1)}%
            </span> khách hàng hài lòng với AR
          </div>
          <div>
            <span className="font-medium text-blue-600">
              {((stats.q2Easy + stats.q2VeryEasy) / stats.totalFeedbacks * 100).toFixed(1)}%
            </span> cho rằng AR dễ sử dụng
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="font-medium text-purple-600">
              {((stats.q3MaybeYes + stats.q3DefinitelyYes) / stats.totalFeedbacks * 100).toFixed(1)}%
            </span> sẽ giới thiệu cho người khác
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackChart;

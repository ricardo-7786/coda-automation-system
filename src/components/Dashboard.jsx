export default function Dashboard({ outreachData, selectedRegion, loading }) {
  if (!selectedRegion) {
    return (
      <div className="bg-white rounded-lg p-8 card-shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 대시보드</h2>
        <p className="text-gray-500 text-center py-12">지역을 선택해주세요</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8 card-shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 대시보드</h2>
        <p className="text-gray-500 text-center py-12">데이터를 로드 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-8 card-shadow card-hover">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">📊 대시보드</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {/* 총 학원 */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">총 학원</p>
          <p className="text-4xl font-bold">{outreachData?.total_academies || '-'}</p>
        </div>

        {/* 응답률 */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">응답률</p>
          <p className="text-4xl font-bold">{outreachData?.response_rate || '-'}</p>
        </div>

        {/* 계약률 */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">계약률</p>
          <p className="text-4xl font-bold">{outreachData?.contract_rate || '-'}</p>
        </div>

        {/* 월 수익 */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">월 수익</p>
          <p className="text-3xl font-bold">{outreachData?.monthly_revenue || '-'}</p>
        </div>
      </div>

      {/* 연 수익 */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
        <p className="text-gray-600 text-sm mb-1">연간 수익 (예상)</p>
        <p className="text-3xl font-bold text-gray-800">{outreachData?.annual_revenue || '-'}</p>
      </div>
    </div>
  );
}

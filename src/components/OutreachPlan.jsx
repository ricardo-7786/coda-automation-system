export default function OutreachPlan({ outreachData, loading }) {
  if (!outreachData && !loading) {
    return (
      <div className="bg-white rounded-lg p-8 card-shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 3단계 자동 아웃리치 계획</h2>
        <p className="text-gray-500 text-center py-12">지역을 선택해주세요</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-8 card-shadow card-hover">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">📈 3단계 자동 아웃리치 계획</h2>
      
      {loading ? (
        <p className="text-gray-500 text-center py-12">데이터를 로드 중입니다...</p>
      ) : (
        <div className="space-y-6">
          {/* 1단계 */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-xl font-bold text-blue-700 mb-4">1️⃣ 1단계: 초기 접촉 (1주)</h3>
            <div className="space-y-3 text-gray-700">
              <p><strong>목표:</strong> 모든 학원에 CODA 소개 메일 발송</p>
              <p><strong>대상:</strong> {outreachData?.stage1_sent}개 학원</p>
              <p><strong>전략:</strong> 5km 독점 정책 강조, 수익 계산기 링크 포함</p>
            </div>
          </div>

          {/* 2단계 */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border-l-4 border-green-500">
            <h3 className="text-xl font-bold text-green-700 mb-4">2️⃣ 2단계: 응답 추적 (2주)</h3>
            <div className="space-y-3 text-gray-700">
              <p><strong>목표:</strong> 응답한 학원과 상담 일정 확정</p>
              <p><strong>예상 응답:</strong> {outreachData?.responses}개 ({outreachData?.response_rate})</p>
              <p><strong>전략:</strong> 개인화된 제안서 발송, 데모 영상 공유</p>
            </div>
          </div>

          {/* 3단계 */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-purple-700 mb-4">3️⃣ 3단계: 계약 체결 (3주)</h3>
            <div className="space-y-3 text-gray-700">
              <p><strong>목표:</strong> 파트너십 계약 체결</p>
              <p><strong>예상 계약:</strong> {outreachData?.contracts}개 ({outreachData?.contract_rate})</p>
              <p><strong>월 수익:</strong> {outreachData?.monthly_revenue}</p>
              <p><strong>연 수익:</strong> {outreachData?.annual_revenue}</p>
            </div>
          </div>

          {/* 요약 */}
          <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📊 전체 요약</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-gray-600 text-sm">총 학원</p>
                <p className="text-2xl font-bold text-gray-800">{outreachData?.total_academies}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">응답</p>
                <p className="text-2xl font-bold text-green-600">{outreachData?.responses}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">계약</p>
                <p className="text-2xl font-bold text-purple-600">{outreachData?.contracts}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">월 수익</p>
                <p className="text-lg font-bold text-orange-600">{outreachData?.monthly_revenue}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

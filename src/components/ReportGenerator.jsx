import { useState } from 'react';

export default function ReportGenerator({ region, onReportGenerated }) {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('weekly');
  const [message, setMessage] = useState('');

  const handleGenerateReport = async () => {
    setLoading(true);
    setMessage('');

    try {
      // 통계 데이터 가져오기
      const statsResponse = await fetch(`/api/statistics/${region}`);
      const stats = await statsResponse.json();

      // 리포트 데이터 생성
      const reportData = {
        report_type: reportType,
        region: region,
        report_date: new Date().toISOString().split('T')[0],
        total_academies: stats.total_academies,
        contacted_count: stats.contacted_count,
        responded_count: stats.responded_count,
        contracted_count: stats.contracted_count,
        response_rate: parseFloat(stats.response_rate),
        contract_rate: parseFloat(stats.contract_rate),
        total_revenue: stats.contracted_count * 100 * 12, // 예상 연간 수익
        report_data: {
          generated_at: new Date().toISOString(),
          summary: `${region} 지역 ${reportType === 'weekly' ? '주간' : reportType === 'monthly' ? '월간' : '분기별'} 리포트`,
          stats: stats
        }
      };

      // 리포트 저장
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });

      if (response.ok) {
        setMessage('✓ 리포트가 생성되었습니다!');
        onReportGenerated();
      } else {
        setMessage('✗ 리포트 생성에 실패했습니다');
      }
    } catch (error) {
      console.error('리포트 생성 실패:', error);
      setMessage('✗ 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">리포트 생성</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">리포트 유형</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="weekly">주간 리포트</option>
            <option value="monthly">월간 리포트</option>
            <option value="quarterly">분기별 리포트</option>
          </select>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
        >
          {loading ? '생성 중...' : '리포트 생성'}
        </button>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.includes('✓')
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">📋 리포트 포함 내용</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✓ 총 학원 수</li>
            <li>✓ 연락한 학원 수</li>
            <li>✓ 응답한 학원 수</li>
            <li>✓ 계약한 학원 수</li>
            <li>✓ 응답률 및 계약률</li>
            <li>✓ 예상 수익</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

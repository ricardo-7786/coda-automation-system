import { useState, useEffect } from 'react';
import ResponseChart from '../components/ResponseChart';
import RevenueChart from '../components/RevenueChart';
import ReportGenerator from '../components/ReportGenerator';
import StatisticsCard from '../components/StatisticsCard';

export default function Analytics() {
  const [region, setRegion] = useState('gangnam');
  const [statistics, setStatistics] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadStatistics();
    loadReports();
  }, [region]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/statistics/${region}`);
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('통계 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async () => {
    try {
      const response = await fetch(`/api/reports?region=${region}`);
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('리포트 로드 실패:', error);
    }
  };

  const handleReportGenerated = () => {
    loadReports();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 분석 및 리포트</h1>
          <p className="text-gray-600">지역별 성과 분석 및 리포트 생성</p>
        </div>

        {/* 지역 선택 */}
        <div className="mb-6">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="gangnam">강남권</option>
            <option value="busan">부산권</option>
            <option value="daegu">대구권</option>
            <option value="daejeon">대전권</option>
            <option value="gwangju">광주권</option>
            <option value="incheon">인천권</option>
          </select>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-4 font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📈 개요
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`py-2 px-4 font-semibold transition-colors ${
              activeTab === 'charts'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 차트
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2 px-4 font-semibold transition-colors ${
              activeTab === 'reports'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📋 리포트
          </button>
        </div>

        {/* 콘텐츠 영역 */}
        {activeTab === 'overview' && (
          <div>
            {loading ? (
              <p className="text-center text-gray-500 py-8">로드 중...</p>
            ) : statistics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatisticsCard
                  title="총 학원"
                  value={statistics.total_academies}
                  icon="🏫"
                  color="blue"
                />
                <StatisticsCard
                  title="연락한 학원"
                  value={statistics.contacted_count}
                  icon="📞"
                  color="green"
                />
                <StatisticsCard
                  title="응답한 학원"
                  value={statistics.responded_count}
                  icon="✓"
                  color="purple"
                />
                <StatisticsCard
                  title="계약한 학원"
                  value={statistics.contracted_count}
                  icon="📋"
                  color="orange"
                />
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">데이터를 불러올 수 없습니다</p>
            )}

            {statistics && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">응답률</h3>
                  <p className="text-4xl font-bold text-green-600">{statistics.response_rate}%</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {statistics.responded_count} / {statistics.total_academies}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">계약률</h3>
                  <p className="text-4xl font-bold text-purple-600">{statistics.contract_rate}%</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {statistics.contracted_count} / {statistics.total_academies}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponseChart region={region} />
            <RevenueChart region={region} />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ReportGenerator region={region} onReportGenerated={handleReportGenerated} />
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">생성된 리포트</h3>
                {reports.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">리포트가 없습니다</p>
                ) : (
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <div key={report.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {report.report_type === 'weekly' ? '주간' : 
                               report.report_type === 'monthly' ? '월간' : '분기별'} 리포트
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(report.report_date).toLocaleDateString('ko-KR')}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-600">응답률</p>
                            <p className="font-semibold text-gray-900">{report.response_rate}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">계약률</p>
                            <p className="font-semibold text-gray-900">{report.contract_rate}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">수익</p>
                            <p className="font-semibold text-gray-900">{report.total_revenue}만 원</p>
                          </div>
                          <div>
                            <p className="text-gray-600">계약</p>
                            <p className="font-semibold text-gray-900">{report.contracted_count}개</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

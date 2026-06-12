import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import RegionSelector from './components/RegionSelector';
import Dashboard from './components/Dashboard';
import AcademiesList from './components/AcademiesList';
import OutreachPlan from './components/OutreachPlan';
import CRMDashboard from './pages/CRMDashboard';
import Analytics from './pages/Analytics';
import DataExport from './pages/DataExport';

function App() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regions, setRegions] = useState([]);
  const [academies, setAcademies] = useState([]);
  const [outreachData, setOutreachData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // 지역 목록 로드
  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const response = await fetch('/api/regions');
      const data = await response.json();
      setRegions(data);
    } catch (error) {
      console.error('지역 목록 로드 실패:', error);
    }
  };

  const handleRegionSelect = async (regionId) => {
    setSelectedRegion(regionId);
    setLoading(true);

    try {
      // 학원 데이터 로드
      const academiesResponse = await fetch(`/api/region/${regionId}`);
      const academiesData = await academiesResponse.json();
      setAcademies(academiesData.academies || []);

      // 아웃리치 계획 생성
      const outreachResponse = await fetch(`/api/outreach/${regionId}`, {
        method: 'POST'
      });
      const outreachData = await outreachResponse.json();
      setOutreachData(outreachData);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 네비게이션
  const Navigation = () => (
    <nav className="bg-white shadow-lg mb-8">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">🎤 CODA 파트너 아카데미</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage('home')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'home'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏠 홈
            </button>
            <button
              onClick={() => setCurrentPage('crm')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'crm'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              💼 CRM
            </button>
            <button
              onClick={() => setCurrentPage('analytics')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'analytics'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📊 분석
            </button>
            <button
              onClick={() => setCurrentPage('export')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'export'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📥 내보내기
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {currentPage === 'home' && (
        <div className="min-h-screen gradient-bg py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* 헤더 */}
            <header className="text-center text-white mb-12">
              <h1 className="text-5xl font-bold mb-4">🎤 CODA 파트너 아카데미</h1>
              <p className="text-xl opacity-90">자동 아웃리치 시스템 - 지역별 학원 정보 및 전략 수립</p>
            </header>

            {/* 메인 그리드 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* 지역 선택 */}
              <div className="lg:col-span-1">
                <RegionSelector 
                  regions={regions}
                  selectedRegion={selectedRegion}
                  onSelectRegion={handleRegionSelect}
                />
              </div>

              {/* 대시보드 */}
              <div className="lg:col-span-2">
                <Dashboard 
                  outreachData={outreachData}
                  selectedRegion={selectedRegion}
                  loading={loading}
                />
              </div>
            </div>

            {/* 학원 목록 */}
            <div className="mb-8">
              <AcademiesList 
                academies={academies}
                loading={loading}
              />
            </div>

            {/* 아웃리치 계획 */}
            <div>
              <OutreachPlan 
                outreachData={outreachData}
                loading={loading}
              />
            </div>
          </div>
        </div>
      )}

      {currentPage === 'crm' && <CRMDashboard />}
      {currentPage === 'analytics' && <Analytics />}
      {currentPage === 'export' && <DataExport />}
    </div>
  );
}

export default App;

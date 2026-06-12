import { useState, useEffect } from 'react';
import CRMTable from '../components/CRMTable';
import ContactHistory from '../components/ContactHistory';
import ContractManager from '../components/ContractManager';
import EmailTracker from '../components/EmailTracker';

export default function CRMDashboard() {
  const [activeTab, setActiveTab] = useState('academies');
  const [academies, setAcademies] = useState([]);
  const [selectedAcademy, setSelectedAcademy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState('gangnam');

  useEffect(() => {
    loadAcademies();
  }, [region]);

  const loadAcademies = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/academies?region=${region}`);
      const data = await response.json();
      setAcademies(data);
    } catch (error) {
      console.error('학원 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcademySelect = (academy) => {
    setSelectedAcademy(academy);
  };

  const handleStatusChange = async (academyId, newStatus) => {
    try {
      await fetch(`/api/academies/${academyId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      loadAcademies();
    } catch (error) {
      console.error('상태 업데이트 실패:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 CRM 대시보드</h1>
          <p className="text-gray-600">학원 정보, 계약, 이메일 및 SNS 활동 관리</p>
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
            onClick={() => setActiveTab('academies')}
            className={`py-2 px-4 font-semibold transition-colors ${
              activeTab === 'academies'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📍 학원 목록
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-2 px-4 font-semibold transition-colors ${
              activeTab === 'contacts'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📞 연락 이력
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`py-2 px-4 font-semibold transition-colors ${
              activeTab === 'contracts'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📋 계약 관리
          </button>
          <button
            onClick={() => setActiveTab('emails')}
            className={`py-2 px-4 font-semibold transition-colors ${
              activeTab === 'emails'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📧 이메일 추적
          </button>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2">
            {activeTab === 'academies' && (
              <CRMTable
                academies={academies}
                loading={loading}
                onSelectAcademy={handleAcademySelect}
                onStatusChange={handleStatusChange}
              />
            )}
            {activeTab === 'contacts' && selectedAcademy && (
              <ContactHistory academyId={selectedAcademy.id} />
            )}
            {activeTab === 'contracts' && selectedAcademy && (
              <ContractManager academyId={selectedAcademy.id} />
            )}
            {activeTab === 'emails' && selectedAcademy && (
              <EmailTracker academyId={selectedAcademy.id} />
            )}
            {!selectedAcademy && activeTab !== 'academies' && (
              <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                학원을 선택해주세요
              </div>
            )}
          </div>

          {/* 사이드바 - 선택된 학원 정보 */}
          {selectedAcademy && (
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-4">선택된 학원</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">학원명</p>
                  <p className="font-semibold text-gray-900">{selectedAcademy.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">주소</p>
                  <p className="font-semibold text-gray-900">{selectedAcademy.address}</p>
                </div>
                <div>
                  <p className="text-gray-600">전화</p>
                  <p className="font-semibold text-gray-900">{selectedAcademy.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">이메일</p>
                  <p className="font-semibold text-gray-900">{selectedAcademy.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">상태</p>
                  <select
                    value={selectedAcademy.status}
                    onChange={(e) => handleStatusChange(selectedAcademy.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="new">신규</option>
                    <option value="contacted">연락함</option>
                    <option value="responded">응답함</option>
                    <option value="negotiating">협상중</option>
                    <option value="contracted">계약함</option>
                    <option value="rejected">거절</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

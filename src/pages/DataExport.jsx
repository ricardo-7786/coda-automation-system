import { useState } from 'react';

export default function DataExport() {
  const [region, setRegion] = useState('gangnam');
  const [exportFormat, setExportFormat] = useState('json');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const regions = [
    { id: 'gangnam', name: '강남권' },
    { id: 'busan', name: '부산권' },
    { id: 'daegu', name: '대구권' },
    { id: 'daejeon', name: '대전권' },
    { id: 'gwangju', name: '광주권' },
    { id: 'incheon', name: '인천권' }
  ];

  const handleExport = async () => {
    setLoading(true);
    setMessage('');

    try {
      if (exportFormat === 'json') {
        // JSON 형식으로 내보내기
        const response = await fetch(`/api/export/${region}/json`);
        const data = await response.json();

        // 파일 다운로드
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2)));
        element.setAttribute('download', `academies_${region}_${new Date().toISOString().split('T')[0]}.json`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        setMessage('✓ JSON 파일이 다운로드되었습니다!');
      } else if (exportFormat === 'csv') {
        // CSV 형식으로 내보내기
        const response = await fetch(`/api/export/${region}/csv`);
        const csv = await response.text();

        // 파일 다운로드
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
        element.setAttribute('download', `academies_${region}_${new Date().toISOString().split('T')[0]}.csv`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        setMessage('✓ CSV 파일이 다운로드되었습니다!');
      } else if (exportFormat === 'excel') {
        // Excel 형식으로 내보내기 (CSV로 대체)
        const response = await fetch(`/api/export/${region}/csv`);
        const csv = await response.text();

        const element = document.createElement('a');
        element.setAttribute('href', 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(csv));
        element.setAttribute('download', `academies_${region}_${new Date().toISOString().split('T')[0]}.xlsx`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        setMessage('✓ Excel 파일이 다운로드되었습니다!');
      }
    } catch (error) {
      console.error('내보내기 실패:', error);
      setMessage('✗ 내보내기에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📥 데이터 내보내기</h1>
          <p className="text-gray-600">학원 정보 및 계약 데이터를 다양한 형식으로 내보내기</p>
        </div>

        {/* 내보내기 카드 */}
        <div className="bg-white rounded-lg shadow p-8">
          <div className="space-y-6">
            {/* 지역 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                📍 지역 선택
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {regions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRegion(r.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      region === r.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 형식 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                📋 내보내기 형식
              </label>
              <div className="space-y-3">
                {[
                  { id: 'json', name: 'JSON', icon: '{}', desc: '구조화된 데이터 형식' },
                  { id: 'csv', name: 'CSV', icon: '📊', desc: 'Excel/Sheets 호환' },
                  { id: 'excel', name: 'Excel', icon: '📈', desc: 'Microsoft Excel 형식' }
                ].map((format) => (
                  <label
                    key={format.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      exportFormat === format.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.id}
                      checked={exportFormat === format.id}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">
                        {format.icon} {format.name}
                      </p>
                      <p className="text-sm text-gray-600">{format.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 내보내기 버튼 */}
            <button
              onClick={handleExport}
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors text-lg"
            >
              {loading ? '내보내는 중...' : '📥 데이터 내보내기'}
            </button>

            {/* 메시지 */}
            {message && (
              <div className={`p-4 rounded-lg text-center font-medium ${
                message.includes('✓')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* 정보 카드 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-2">📦 JSON 형식</h3>
            <p className="text-sm text-gray-600">
              완전한 데이터 구조를 포함한 JSON 형식으로 내보내기
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-2">📊 CSV 형식</h3>
            <p className="text-sm text-gray-600">
              Google Sheets, Excel에서 바로 열 수 있는 CSV 형식
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-2">📈 Excel 형식</h3>
            <p className="text-sm text-gray-600">
              Microsoft Excel에 최적화된 형식으로 내보내기
            </p>
          </div>
        </div>

        {/* 포함 데이터 정보 */}
        <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">📋 내보내기에 포함되는 데이터</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ 학원 기본 정보 (이름, 주소, 전화, 이메일)</li>
            <li>✓ 연락 이력 (날짜, 유형, 메시지)</li>
            <li>✓ 계약 정보 (금액, 기간, 상태)</li>
            <li>✓ 이메일 로그 (발송, 오픈, 클릭)</li>
            <li>✓ SNS 활동 (플랫폼, 활동 유형, 참여도)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

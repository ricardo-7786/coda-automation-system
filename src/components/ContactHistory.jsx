import { useState, useEffect } from 'react';

export default function ContactHistory({ academyId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    contact_type: 'email',
    stage: 1,
    message: ''
  });

  useEffect(() => {
    loadHistory();
  }, [academyId]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/contact-history/${academyId}`);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('연락 이력 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/contact-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          academy_id: academyId,
          contact_date: new Date().toISOString(),
          ...formData
        })
      });
      setFormData({ contact_type: 'email', stage: 1, message: '' });
      setShowForm(false);
      loadHistory();
    } catch (error) {
      console.error('연락 이력 추가 실패:', error);
    }
  };

  const contactTypeLabels = {
    email: '📧 이메일',
    phone: '📞 전화',
    meeting: '🤝 미팅',
    sms: '💬 SMS'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">연락 이력</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showForm ? '취소' : '+ 연락 기록 추가'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연락 유형</label>
              <select
                value={formData.contact_type}
                onChange={(e) => setFormData({ ...formData, contact_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="email">이메일</option>
                <option value="phone">전화</option>
                <option value="meeting">미팅</option>
                <option value="sms">SMS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">단계</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value={1}>1단계</option>
                <option value={2}>2단계</option>
                <option value={3}>3단계</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">메시지</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows="3"
                placeholder="연락 내용을 입력하세요"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              저장
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500 text-center py-8">로드 중...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-500 text-center py-8">연락 이력이 없습니다</p>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-900">
                  {contactTypeLabels[item.contact_type]} - {item.stage}단계
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(item.contact_date).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <p className="text-sm text-gray-600">{item.message}</p>
              {item.response_received && (
                <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-700">
                  ✓ 응답 받음: {item.response_content}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

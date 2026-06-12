import { useState, useEffect } from 'react';

export default function EmailTracker({ academyId }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    recipient_email: '',
    subject: '',
    body: '',
    email_type: 'introduction'
  });

  useEffect(() => {
    loadEmails();
  }, [academyId]);

  const loadEmails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/email-logs/${academyId}`);
      const data = await response.json();
      setEmails(data);
    } catch (error) {
      console.error('이메일 로그 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/email-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          academy_id: academyId,
          ...formData
        })
      });
      setFormData({
        recipient_email: '',
        subject: '',
        body: '',
        email_type: 'introduction'
      });
      setShowForm(false);
      loadEmails();
    } catch (error) {
      console.error('이메일 로그 추가 실패:', error);
    }
  };

  const emailTypeLabels = {
    introduction: '소개',
    followup: '팔로우업',
    proposal: '제안서',
    contract: '계약'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">이메일 추적</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showForm ? '취소' : '+ 이메일 기록'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">수신자 이메일</label>
              <input
                type="email"
                value={formData.recipient_email}
                onChange={(e) => setFormData({ ...formData, recipient_email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="이메일 주소를 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="이메일 제목을 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일 유형</label>
              <select
                value={formData.email_type}
                onChange={(e) => setFormData({ ...formData, email_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="introduction">소개</option>
                <option value="followup">팔로우업</option>
                <option value="proposal">제안서</option>
                <option value="contract">계약</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
              <textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows="4"
                placeholder="이메일 내용을 입력하세요"
                required
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
      ) : emails.length === 0 ? (
        <p className="text-gray-500 text-center py-8">이메일 기록이 없습니다</p>
      ) : (
        <div className="space-y-3">
          {emails.map((email) => (
            <div key={email.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{email.subject}</p>
                  <p className="text-sm text-gray-600">{email.recipient_email}</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {emailTypeLabels[email.email_type]}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{email.body}</p>
              <div className="flex gap-4 text-xs text-gray-600">
                <span>📅 {new Date(email.sent_date).toLocaleDateString('ko-KR')}</span>
                {email.opened && (
                  <span className="text-green-600">✓ 열림</span>
                )}
                {email.clicked && (
                  <span className="text-green-600">✓ 클릭됨</span>
                )}
                {email.bounced && (
                  <span className="text-red-600">✗ 반송됨</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';

export default function ContractManager({ academyId }) {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    contract_value: '',
    start_date: '',
    end_date: '',
    terms: '',
    notes: ''
  });

  useEffect(() => {
    loadContracts();
  }, [academyId]);

  const loadContracts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/contracts?academy_id=${academyId}`);
      const data = await response.json();
      setContracts(data);
    } catch (error) {
      console.error('계약 정보 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          academy_id: academyId,
          contract_date: new Date().toISOString(),
          ...formData
        })
      });
      setFormData({
        contract_value: '',
        start_date: '',
        end_date: '',
        terms: '',
        notes: ''
      });
      setShowForm(false);
      loadContracts();
    } catch (error) {
      console.error('계약 추가 실패:', error);
    }
  };

  const handleStatusChange = async (contractId, newStatus) => {
    try {
      await fetch(`/api/contracts/${contractId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      loadContracts();
    } catch (error) {
      console.error('계약 상태 업데이트 실패:', error);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    signed: 'bg-green-100 text-green-800',
    active: 'bg-blue-100 text-blue-800',
    expired: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    pending: '대기중',
    signed: '서명됨',
    active: '활성',
    expired: '만료',
    cancelled: '취소됨'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">계약 관리</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showForm ? '취소' : '+ 계약 추가'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">계약금액</label>
              <input
                type="number"
                value={formData.contract_value}
                onChange={(e) => setFormData({ ...formData, contract_value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="계약금액을 입력하세요"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">계약 조건</label>
              <textarea
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows="2"
                placeholder="계약 조건을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비고</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows="2"
                placeholder="추가 사항을 입력하세요"
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
      ) : contracts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">계약 정보가 없습니다</p>
      ) : (
        <div className="space-y-3">
          {contracts.map((contract) => (
            <div key={contract.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-900">
                    {contract.contract_value}만 원
                  </p>
                  <p className="text-sm text-gray-600">
                    {contract.start_date} ~ {contract.end_date}
                  </p>
                </div>
                <select
                  value={contract.contract_status}
                  onChange={(e) => handleStatusChange(contract.id, e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-xs"
                >
                  <option value="pending">대기중</option>
                  <option value="signed">서명됨</option>
                  <option value="active">활성</option>
                  <option value="expired">만료</option>
                  <option value="cancelled">취소됨</option>
                </select>
              </div>
              {contract.terms && (
                <p className="text-sm text-gray-600 mb-2">조건: {contract.terms}</p>
              )}
              {contract.notes && (
                <p className="text-sm text-gray-600">비고: {contract.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

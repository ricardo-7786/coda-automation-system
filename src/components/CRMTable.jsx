export default function CRMTable({ academies, loading, onSelectAcademy, onStatusChange }) {
  const statusColors = {
    new: 'bg-gray-100 text-gray-800',
    contacted: 'bg-blue-100 text-blue-800',
    responded: 'bg-green-100 text-green-800',
    negotiating: 'bg-yellow-100 text-yellow-800',
    contracted: 'bg-purple-100 text-purple-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    new: '신규',
    contacted: '연락함',
    responded: '응답함',
    negotiating: '협상중',
    contracted: '계약함',
    rejected: '거절'
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-gray-500">데이터를 로드 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">학원명</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">주소</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">전화</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">상태</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {academies.map((academy) => (
              <tr
                key={academy.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onSelectAcademy(academy)}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{academy.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{academy.address}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{academy.phone}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[academy.status]}`}>
                    {statusLabels[academy.status]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <select
                    value={academy.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      onStatusChange(academy.id, e.target.value);
                    }}
                    className="px-2 py-1 border border-gray-300 rounded text-xs"
                  >
                    <option value="new">신규</option>
                    <option value="contacted">연락함</option>
                    <option value="responded">응답함</option>
                    <option value="negotiating">협상중</option>
                    <option value="contracted">계약함</option>
                    <option value="rejected">거절</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {academies.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          학원 데이터가 없습니다
        </div>
      )}
    </div>
  );
}

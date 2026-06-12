export default function AcademiesList({ academies, loading }) {
  if (!academies.length && !loading) {
    return (
      <div className="bg-white rounded-lg p-8 card-shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📍 학원 목록</h2>
        <p className="text-gray-500 text-center py-12">지역을 선택해주세요</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-8 card-shadow card-hover">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📍 학원 목록 ({academies.length}개)</h2>
      
      {loading ? (
        <p className="text-gray-500 text-center py-12">데이터를 로드 중입니다...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {academies.map((academy, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-5 border-l-4 border-blue-500 hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-gray-800 mb-3">{academy.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📍 {academy.address}</p>
                <p>📞 {academy.phone}</p>
                <p>📧 {academy.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

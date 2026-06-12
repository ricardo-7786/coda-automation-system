export default function RegionSelector({ regions, selectedRegion, onSelectRegion }) {
  return (
    <div className="bg-white rounded-lg p-8 card-shadow card-hover">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🌍 지역 선택</h2>
      <div className="space-y-3">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => onSelectRegion(region.id)}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
              selectedRegion === region.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-lg">{region.name}</span>
            <span className="text-sm opacity-75 ml-2">({region.count}개)</span>
          </button>
        ))}
      </div>
    </div>
  );
}

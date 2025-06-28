import { useState, useEffect } from 'react';

export default function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('us');
  const [availableRegions, setAvailableRegions] = useState([]);
  const [regionInfo, setRegionInfo] = useState(null);

  const fetchGames = async (region = selectedRegion) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/steam-top-games?region=${region}`);
      const data = await response.json();
      
      if (data.success) {
        setGames(data.games);
        setRegionInfo(data.region);
        setAvailableRegions(data.availableRegions);
      } else {
        setError(data.error || 'Failed to fetch games');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
    
    setLoading(false);
  };

  const handleRegionChange = (newRegion) => {
    setSelectedRegion(newRegion);
    fetchGames(newRegion);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const getReviewColor = (sentiment) => {
    if (!sentiment) return 'text-gray-500';
    const lower = sentiment.toLowerCase();
    if (lower.includes('overwhelmingly positive') || lower.includes('very positive')) return 'text-green-600';
    if (lower.includes('positive')) return 'text-green-500';
    if (lower.includes('mostly positive')) return 'text-green-400';
    if (lower.includes('mixed')) return 'text-yellow-500';
    if (lower.includes('negative')) return 'text-red-500';
    return 'text-gray-500';
  };

  const formatReviewCount = (count) => {
    if (!count) return '';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              🎮 Steam Global Charts
            </h1>
            <p className="text-gray-600 text-sm mb-3">
              Top 30 Popular New & Trending Games • 55+ Countries Available
              {regionInfo && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                  {regionInfo.flag} {regionInfo.name} ({regionInfo.currency})
                </span>
              )}
            </p>
            
            {/* Region Selector and Refresh Button */}
            <div className="flex items-center justify-center gap-3">
              {/* Region Dropdown */}
              <div className="relative">
                <select
                  value={selectedRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  disabled={loading}
                  className="appearance-none bg-white border border-gray-300 rounded px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 pr-8"
                >
                  {availableRegions.map((region) => (
                    <option key={region.code} value={region.code}>
                      {region.flag} {region.name} - {region.currency}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Refresh Button */}
              <button 
                onClick={() => fetchGames()}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1"
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    🌍 Refresh Data
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-600 text-sm">
              Fetching latest Steam data for {regionInfo ? `${regionInfo.flag} ${regionInfo.name}` : 'selected region'}...
            </p>
          </div>
        )}

        {!loading && games.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b">
              <h2 className="text-sm font-semibold text-gray-800">
                🔥 Popular New & Trending Games ({games.length})
                {regionInfo && (
                  <span className="ml-2 text-xs text-gray-600 font-normal">
                    in {regionInfo.flag} {regionInfo.name}
                  </span>
                )}
              </h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {games.map((game, index) => (
                <div key={game.id || game.rank} className="p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                        {game.rank}
                      </div>
                    </div>
                    
                    {/* Game Image */}
                    <div className="flex-shrink-0">
                      {game.imageUrl ? (
                        <img 
                          src={game.imageUrl} 
                          alt={game.title}
                          className="rounded object-cover bg-gray-200"
                          style={{ width: '80px', height: '30px' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="bg-gray-200 rounded flex items-center justify-center" style={{ width: '80px', height: '30px' }}>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Game Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                        {game.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                        <span>📅 {game.releaseDate}</span>
                        <span>💻 {game.platforms.join(', ')}</span>
                        
                        {/* Review Info */}
                        {game.reviewSentiment && (
                          <span className={`flex items-center ${getReviewColor(game.reviewSentiment)}`}>
                            ⭐ {game.reviewSentiment}
                            {game.reviewCount && (
                              <span className="text-gray-500 ml-1">
                                ({formatReviewCount(game.reviewCount)})
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Pricing */}
                    <div className="flex-shrink-0 text-right mx-3">
                      {game.isFree ? (
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          Free
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {game.discountPercent && (
                            <div className="bg-green-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                              {game.discountPercent}
                            </div>
                          )}
                          <div className="flex items-center space-x-1 text-xs">
                            {game.originalPrice && (
                              <span className="text-gray-400 line-through">
                                {game.originalPrice}
                              </span>
                            )}
                            <span className="font-bold text-gray-900">
                              {game.price}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* View on Steam Link */}
                    <div className="flex-shrink-0">
                      <a 
                        href={game.steamUrl}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline"
                      >
                        View on Steam
                        <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && games.length === 0 && !error && (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-600 text-sm">No games found. Try refreshing the data.</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500 bg-white rounded-lg shadow-sm p-3">
          <p className="flex items-center justify-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Data sourced from Steam Store - Popular New & Trending Releases
            {regionInfo && ` (${regionInfo.flag} ${regionInfo.name})`}
          </p>
          <p className="mt-1">
            Updated in real-time • {games.length > 0 && `Last updated: ${new Date().toLocaleTimeString()}`}
          </p>
        </div>
      </div>
    </div>
  );
}

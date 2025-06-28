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
    if (!sentiment) return 'text-gray-400';
    const lower = sentiment.toLowerCase();
    if (lower.includes('overwhelmingly positive') || lower.includes('very positive')) return 'text-emerald-400';
    if (lower.includes('positive')) return 'text-green-400';
    if (lower.includes('mostly positive')) return 'text-lime-400';
    if (lower.includes('mixed')) return 'text-yellow-400';
    if (lower.includes('negative')) return 'text-red-400';
    return 'text-gray-400';
  };

  const formatReviewCount = (count) => {
    if (!count) return '';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-2">
              🎮 Steam Global Charts
            </h1>
            <p className="text-gray-300 text-base mb-4">
              Top 30 Popular New & Trending Games • 55+ Countries Available
              {regionInfo && (
                <span className="ml-3 inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg">
                  {regionInfo.flag} {regionInfo.name} ({regionInfo.currency})
                </span>
              )}
            </p>
            
            {/* Region Selector and Refresh Button */}
            <div className="flex items-center justify-center gap-4">
              {/* Region Dropdown */}
              <div className="relative">
                <select
                  value={selectedRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  disabled={loading}
                  className="appearance-none bg-gray-800/80 backdrop-blur border border-gray-600 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-100 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-800/50 disabled:text-gray-500 pr-10 shadow-lg transition-all duration-200"
                >
                  {availableRegions.map((region) => (
                    <option key={region.code} value={region.code} className="bg-gray-800 text-gray-100">
                      {region.flag} {region.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Refresh Button */}
              <button 
                onClick={() => fetchGames()}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 disabled:scale-100"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
      <div className="max-w-5xl mx-auto px-6 py-6">
        {error && (
          <div className="bg-red-900/50 backdrop-blur border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm shadow-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-4"></div>
            <p className="text-gray-300 text-base">
              Fetching latest Steam data for {regionInfo ? `${regionInfo.flag} ${regionInfo.name}` : 'selected region'}...
            </p>
          </div>
        )}

        {!loading && games.length > 0 && (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-800/80 to-gray-700/80 border-b border-gray-600/50">
              <h2 className="text-lg font-bold text-gray-100">
                🔥 Popular New & Trending Games ({games.length})
                {regionInfo && (
                  <span className="ml-3 text-sm text-gray-300 font-normal">
                    in {regionInfo.flag} {regionInfo.name}
                  </span>
                )}
              </h2>
            </div>
            
            <div className="divide-y divide-gray-700/50">
              {games.map((game, index) => (
                <div key={game.id || game.rank} className="p-4 hover:bg-gray-800/30 transition-all duration-200 hover:shadow-lg">
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                        {game.rank}
                      </div>
                    </div>
                    
                    {/* Game Image */}
                    <div className="flex-shrink-0">
                      {game.imageUrl ? (
                        <img 
                          src={game.imageUrl} 
                          alt={game.title}
                          className="rounded-lg object-cover bg-gray-700 shadow-lg border border-gray-600/50"
                          style={{ width: '90px', height: '34px' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600/50" style={{ width: '90px', height: '34px' }}>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Game Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-100 mb-2 truncate">
                        {game.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                        <span className="flex items-center">
                          📅 {game.releaseDate}
                        </span>
                        <span className="flex items-center">
                          💻 {game.platforms.join(', ')}
                        </span>
                        
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
                    <div className="flex-shrink-0 text-right mx-4">
                      {game.isFree ? (
                        <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
                          Free
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {game.discountPercent && (
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                              {game.discountPercent}
                            </div>
                          )}
                          <div className="flex items-center space-x-2 text-sm">
                            {game.originalPrice && (
                              <span className="text-gray-500 line-through">
                                {game.originalPrice}
                              </span>
                            )}
                            <span className="font-bold text-gray-100">
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
                        className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                      >
                        View on Steam
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="text-center py-12 bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-300 text-base">No games found. Try refreshing the data.</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400 bg-gray-900/30 backdrop-blur-xl rounded-2xl shadow-xl p-4 border border-gray-700/30">
          <p className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Data sourced from Steam Store - Popular New & Trending Releases
            {regionInfo && ` (${regionInfo.flag} ${regionInfo.name})`}
          </p>
          <p className="mt-2 text-gray-500">
            Updated in real-time • {games.length > 0 && `Last updated: ${new Date().toLocaleTimeString()}`}
          </p>
        </div>
      </div>
    </div>
  );
}

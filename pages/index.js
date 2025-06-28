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
    if (lower.includes('overwhelmingly positive') || lower.includes('very positive')) return 'text-gray-200';
    if (lower.includes('positive')) return 'text-gray-300';
    if (lower.includes('mostly positive')) return 'text-gray-400';
    if (lower.includes('mixed')) return 'text-gray-500';
    if (lower.includes('negative')) return 'text-gray-600';
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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-white mb-2">
              Steam Global Charts
            </h1>
            <p className="text-gray-400 text-sm mb-3">
              New & Trending 30 Games{regionInfo ? ` - ${regionInfo.flag} ${regionInfo.name}` : ' - 55+ Countries'}
            </p>
            
            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <select
                value={selectedRegion}
                onChange={(e) => handleRegionChange(e.target.value)}
                disabled={loading}
                className="appearance-none bg-gray-800 border border-gray-700 px-3 py-1.5 text-sm text-gray-200 hover:border-gray-600 focus:outline-none focus:border-gray-500 disabled:opacity-50"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {availableRegions.map((region) => (
                  <option key={region.code} value={region.code} className="bg-gray-800 text-gray-100">
                    {region.flag} {region.name}
                  </option>
                ))}
              </select>
              
              <button 
                onClick={() => fetchGames()}
                disabled={loading}
                className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-gray-200 px-3 py-1.5 text-sm border border-gray-700 hover:border-gray-600"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        {error && (
          <div className="bg-gray-800/50 border border-gray-700 text-gray-300 px-3 py-2 mb-4 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-5 w-5 border border-gray-600 border-t-gray-400 mb-2"></div>
            <p className="text-gray-400 text-sm">
              Loading {regionInfo ? `${regionInfo.flag} ${regionInfo.name}` : 'data'}...
            </p>
          </div>
        )}

        {!loading && games.length > 0 && (
          <div className="bg-gray-900 border border-gray-800">
            <div className="px-4 py-2 border-b border-gray-800">
              <h2 className="text-sm font-medium text-gray-300">
                {games.length} Games
                {regionInfo && (
                  <span className="ml-2 text-xs text-gray-500">
                    {regionInfo.flag} {regionInfo.name}
                  </span>
                )}
              </h2>
            </div>
            
            <div className="divide-y divide-gray-800">
              {games.map((game, index) => (
                <div key={game.id || game.rank} className="p-3 hover:bg-gray-800/50">
                  <div className="flex items-center space-x-3">
                    {/* Rank */}
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-800 text-gray-400 text-xs flex items-center justify-center font-mono">
                      {game.rank}
                    </div>
                    
                    {/* Game Image */}
                    <div className="flex-shrink-0">
                      {game.imageUrl ? (
                        <img 
                          src={game.imageUrl} 
                          alt={game.title}
                          className="object-cover bg-gray-800"
                          style={{ width: '120px', height: '45px' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="bg-gray-800 flex items-center justify-center" style={{ width: '120px', height: '45px' }}>
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Game Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-200 truncate">
                        {game.title}
                      </h3>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>{game.releaseDate}</span>
                        <span>{game.platforms.join(', ')}</span>
                        
                        {game.reviewSentiment && (
                          <span className={getReviewColor(game.reviewSentiment)}>
                            {game.reviewSentiment}
                            {game.reviewCount && (
                              <span className="text-gray-600 ml-1">
                                ({formatReviewCount(game.reviewCount)})
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Pricing */}
                    <div className="flex-shrink-0 text-right">
                      {game.isFree ? (
                        <div className="bg-gray-700 text-gray-300 px-2 py-1 text-xs">
                          Free
                        </div>
                      ) : (
                        <div className="text-xs">
                          {game.discountPercent && (
                            <div className="bg-gray-700 text-gray-300 px-1.5 py-0.5 text-xs mb-1">
                              {game.discountPercent}
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            {game.originalPrice && (
                              <span className="text-gray-600 line-through">
                                {game.originalPrice}
                              </span>
                            )}
                            <span className="text-gray-300 font-medium">
                              {game.price}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Steam Link */}
                    <div className="flex-shrink-0">
                      <a 
                        href={game.steamUrl}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-gray-200 text-xs"
                      >
                        Steam
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && games.length === 0 && !error && (
          <div className="text-center py-8 bg-gray-900 border border-gray-800">
            <p className="text-gray-500 text-sm">No games found.</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-gray-600">
          <p>Steam Store Data{regionInfo && ` • ${regionInfo.flag} ${regionInfo.name}`}</p>
        </div>
      </div>
    </div>
  );
}

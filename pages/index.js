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
    if (lower.includes('overwhelmingly positive') || lower.includes('very positive')) return 'text-green-400';
    if (lower.includes('positive')) return 'text-blue-400';
    if (lower.includes('mostly positive')) return 'text-cyan-400';
    if (lower.includes('mixed')) return 'text-yellow-400';
    if (lower.includes('negative')) return 'text-red-400';
    return 'text-gray-500';
  };

  const formatReviewCount = (count) => {
    if (!count) return '';
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-950/30 via-black to-purple-950/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/20 via-gray-900/10 to-transparent"></div>
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-32">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
              Steam Regional Charts
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-16 max-w-4xl mx-auto leading-relaxed">
              Discover the most popular new releases across Steam's global regions. Real-time data from Steam's public charts.
            </p>
            
            {/* Controls Card */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800/60 rounded-2xl p-8 shadow-2xl">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <div className="relative flex-1 max-w-sm">
                    <select
                      value={selectedRegion}
                      onChange={(e) => handleRegionChange(e.target.value)}
                      disabled={loading}
                      className="w-full appearance-none bg-black/60 backdrop-blur border border-gray-700/60 hover:border-gray-600 focus:border-blue-500 text-white px-6 py-4 pr-12 rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 cursor-pointer"
                    >
                      {availableRegions.map((region) => (
                        <option key={region.code} value={region.code} className="bg-black">
                          {region.flag} {region.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => fetchGames()}
                    disabled={loading}
                    className="bg-white hover:bg-gray-100 text-black font-semibold px-8 py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                        Loading...
                      </div>
                    ) : (
                      'Refresh'
                    )}
                  </button>
                </div>
                
                {regionInfo && (
                  <div className="mt-6 pt-6 border-t border-gray-800/60">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-black/30 border border-gray-800/60 rounded-full">
                      <span className="text-2xl">{regionInfo.flag}</span>
                      <span className="text-gray-300 font-medium">New & Trending Games in {regionInfo.name}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">{games.length} Games</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {error && (
          <div className="mb-8 bg-red-900/20 border border-red-800/60 backdrop-blur-sm text-red-200 px-6 py-4 rounded-xl text-center">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>
              <div className="text-gray-400 text-xl">Loading games...</div>
            </div>
          </div>
        )}

                 {!loading && games.length > 0 && (
           <>
             {/* Mobile Scroll Hint */}
             <div className="block md:hidden mb-4 text-center">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/40 backdrop-blur border border-gray-800/60 rounded-full text-gray-400 text-sm">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                 </svg>
                 Swipe left/right to scroll
               </div>
             </div>
             
             <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/60 rounded-3xl overflow-hidden shadow-2xl">
               {/* Horizontal Scroll Wrapper */}
               <div className="overflow-x-auto">
               <div className="min-w-[1000px]">
                 {/* Table Header */}
                 <div className="bg-gray-900/60 backdrop-blur px-8 py-6 border-b border-gray-800/60">
                   <div className="grid grid-cols-12 gap-6 font-semibold text-sm text-gray-300 uppercase tracking-wider">
                     <div className="col-span-1 text-center">Rank</div>
                     <div className="col-span-1">Image</div>
                     <div className="col-span-4">Game</div>
                     <div className="col-span-2">Release Date</div>
                     <div className="col-span-2">Reviews</div>
                     <div className="col-span-1 text-right">Price</div>
                     <div className="col-span-1 text-center">Steam</div>
                   </div>
                 </div>
                 
                 {/* Table Body */}
                 <div className="divide-y divide-gray-800/60">
                   {games.map((game, index) => (
                     <div key={game.id || game.rank} className="px-8 py-6 hover:bg-gray-800/30 transition-all duration-200 group">
                       <div className="grid grid-cols-12 gap-6 items-center">
                    {/* Rank */}
                    <div className="col-span-1 text-center">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl font-bold text-white group-hover:border-gray-600 transition-colors">
                        {game.rank}
                      </div>
                    </div>
                    
                    {/* Image */}
                    <div className="col-span-1">
                      {game.imageUrl ? (
                        <img 
                          src={game.imageUrl} 
                          alt={game.title}
                          className="border border-gray-700 object-cover rounded-lg shadow-lg group-hover:border-gray-600 transition-colors"
                          width="120"
                          height="45"
                          style={{ width: '120px', height: '45px' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="bg-gray-800 border border-gray-700 flex items-center justify-center rounded-lg" style={{ width: '120px', height: '45px' }}>
                          <span className="text-gray-500 text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Game Title */}
                    <div className="col-span-4">
                      <h3 className="font-semibold text-white text-lg group-hover:text-blue-300 transition-colors truncate">
                        {game.title}
                      </h3>
                    </div>
                    
                    {/* Release Date */}
                    <div className="col-span-2">
                      <span className="text-gray-400 font-medium">{game.releaseDate}</span>
                    </div>
                   
                   {/* Reviews */}
                   <div className="col-span-2">
                     {game.reviewSentiment && (
                       <div className="space-y-1">
                         <div className={`${getReviewColor(game.reviewSentiment)} font-semibold text-sm`}>
                           {game.reviewSentiment}
                         </div>
                         {game.reviewCount && (
                           <div className="text-gray-500 text-xs">
                             {formatReviewCount(game.reviewCount)} reviews
                           </div>
                         )}
                       </div>
                     )}
                   </div>
                   
                   {/* Price */}
                   <div className="col-span-1 text-right">
                     {game.isFree ? (
                       <div className="inline-flex items-center px-3 py-1 bg-green-900/30 border border-green-800/60 text-green-300 rounded-full text-sm font-semibold">
                         Free
                       </div>
                     ) : (
                       <div className="space-y-1">
                         {game.discountPercent && (
                           <div className="inline-flex items-center px-2 py-1 bg-blue-900/30 border border-blue-800/60 text-blue-300 rounded-full text-xs font-bold mb-1">
                             {game.discountPercent}
                           </div>
                         )}
                         {game.originalPrice && (
                           <div className="text-gray-500 line-through text-sm">
                             {game.originalPrice}
                           </div>
                         )}
                         <div className="text-white font-semibold text-lg">
                           {game.price}
                         </div>
                       </div>
                     )}
                   </div>
                   
                   {/* Steam Link */}
                   <div className="col-span-1 text-center">
                     {game.steamUrl && (
                       <a 
                         href={game.steamUrl} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all duration-200 group/button hover:scale-105 shadow-lg hover:shadow-xl"
                         title="View on Steam"
                       >
                         <svg className="w-5 h-5 group-hover/button:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169-.331-.486-.56-.886-.56H6.318c-.4 0-.717.229-.886.56L12 17.64l6.568-9.48z"/>
                         </svg>
                       </a>
                     )}
                   </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )}

        {!loading && games.length === 0 && !error && (
          <div className="text-center py-24">
            <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Games Found</h3>
              <p className="text-gray-400">Try selecting a different region or refreshing the data.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900/50 to-black border-t border-gray-800/60 py-16 mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900/40 backdrop-blur border border-gray-800/60 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300 font-medium">Live Data from Steam</span>
            </div>
            
            <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
              Game data is sourced from Steam's publicly available charts and regional store listings. 
              Updated in real-time with every request across 55+ supported regions.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Real-time updates
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                55+ regions
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Public data only
              </div>
            </div>
            
            <p className="text-gray-600 text-xs max-w-xl mx-auto">
              This service is not affiliated with Valve Corporation or Steam. All game titles, images, and trademarks belong to their respective owners.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect } from 'react';
import Head from 'next/head';

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
    <>
      <Head>
        <title>Steam Regional Charts - Discover Popular Games by Region</title>
        <meta name="description" content="Discover the most popular new releases on Steam across different regions. Real-time data with pricing, reviews, and regional availability for 30+ countries." />
        <meta name="keywords" content="Steam, games, regional pricing, popular games, new releases, game charts, Steam statistics, gaming trends" />
        <meta name="author" content="Steam Regional Charts" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Steam Regional Charts - Discover Popular Games by Region" />
        <meta property="og:description" content="Discover the most popular new releases on Steam across different regions. Real-time data with pricing, reviews, and regional availability." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://steam-regional-charts.vercel.app" />
        <meta property="og:image" content="https://steam-regional-charts.vercel.app/og-image.png" />
        <meta property="og:site_name" content="Steam Regional Charts" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Steam Regional Charts - Discover Popular Games by Region" />
        <meta name="twitter:description" content="Discover the most popular new releases on Steam across different regions. Real-time data with pricing and reviews." />
        <meta name="twitter:image" content="https://steam-regional-charts.vercel.app/og-image.png" />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="theme-color" content="#000000" />
        <link rel="canonical" href="https://steam-regional-charts.vercel.app" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Steam Regional Charts',
              description: 'Discover the most popular new releases on Steam across different regions with real-time pricing and reviews.',
              applicationCategory: 'GameApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              creator: {
                '@type': 'Organization',
                name: 'Steam Regional Charts'
              }
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* Hero Section with Gradient Background */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-950/30 via-black to-purple-950/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/20 via-gray-900/10 to-transparent"></div>
          
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
          
          <div className="relative w-full flex justify-center py-24 md:py-32" style={{ marginTop: '25px', marginBottom: '20px' }}>
            <div className="max-w-5xl w-full mx-auto px-4">
              <div className="text-center flex flex-col items-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
                  Steam Regional Charts
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 mb-16 max-w-4xl mx-auto leading-relaxed">
                  Discover the most popular new releases across Steam's global regions. Real-time data from Steam's public charts.
                </p>
                
                {/* Controls Card */}
                <div className="w-full flex justify-center" style={{ marginTop: '20px', marginBottom: '20px' }}>
                  <div className="max-w-2xl w-full">
                    <div className="bg-gray-900/30 backdrop-blur-xl rounded-2xl p-8">
                      {/* Controls */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative w-full max-w-md">
                          <label className="block text-sm font-semibold text-gray-200 mb-3 text-center tracking-wide">
                            SELECT REGION
                          </label>
                          <select
                            value={selectedRegion}
                            onChange={(e) => handleRegionChange(e.target.value)}
                            disabled={loading}
                            className="w-full appearance-none bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur hover:from-gray-700/80 hover:to-gray-800/80 focus:from-gray-700/90 focus:to-gray-800/90 text-white px-8 py-6 pr-16 rounded-2xl text-xl font-bold text-center focus:outline-none focus:ring-4 focus:ring-blue-500/40 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105 border border-gray-700/50 hover:border-gray-600/50"
                          >
                            {availableRegions.map((region) => (
                              <option key={region.code} value={region.code} className="bg-black py-3 text-lg">
                                {region.flag} {region.name}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none pt-10" style={{ paddingTop: '18px', paddingRight: '10px' }}>
                            <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full flex justify-center">
          <div className="max-w-5xl w-full mx-auto px-4 py-20">
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
              <div className="text-center py-24" style={{ marginTop: '20px', marginBottom: '1000px' }}>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>
                  <div className="text-gray-400 text-xl">Loading games...</div>
                </div>
              </div>
            )}

            {!loading && games.length > 0 && (
              <>
                {/* Mobile Scroll Hint */}
                <div className="block md:hidden mb-3 flex justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900/40 backdrop-blur border border-gray-800/60 rounded-full text-gray-400 text-xs">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                    Swipe to scroll
                  </div>
                </div>
                
                <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/60 overflow-hidden shadow-2xl w-full max-w-5xl mx-auto mt-8 mb-12">
                  {/* Horizontal Scroll Wrapper */}
                  <div className="overflow-x-auto">
                    <div className="min-w-[1000px]">
                      {/* Table Header */}
                      <div className="bg-gray-900/60 backdrop-blur px-6 py-4 border-b border-gray-800/60">
                        <div className="grid grid-cols-8 font-semibold text-xs text-gray-300 uppercase tracking-wider items-center">
                          <div className="flex justify-center" style={{ width: '40px', minWidth: '40px', maxWidth: '40px' }}>Rank</div>
                          <div className="w-32">Image</div>
                          <div className="flex-1 min-w-0">Game</div>
                          <div className="w-24 text-center">Date</div>
                          <div className="w-32 text-center">Reviews</div>
                          <div className="w-20 text-center">Price</div>
                          <div className="w-10 text-center">Link</div>
                          <div className="w-10 text-center">SteamPeek</div>
                        </div>
                      </div>
                      
                      {/* Table Body */}
                      <div className="divide-y divide-gray-800/60">
                        {games.map((game, index) => (
                          <div key={game.id || game.rank} className="px-6 py-3 hover:bg-gray-800/30 transition-all duration-200 group">
                            <div className="grid grid-cols-8 items-center">
                              {/* Rank */}
                              <div className="flex justify-center" style={{ width: '40px', minWidth: '40px', maxWidth: '40px' }}>
                                <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg font-bold text-white text-sm group-hover:border-gray-600 transition-colors">
                                  {game.rank}
                                </div>
                              </div>
                              
                              {/* Image */}
                              <div className="w-32">
                                {game.imageUrl ? (
                                  <img 
                                    src={game.imageUrl} 
                                    alt={game.title}
                                    className="border border-gray-700 object-cover rounded-md shadow-md group-hover:border-gray-600 transition-colors"
                                    width="120"
                                    height="45"
                                    style={{ width: '120px', height: '45px', display: 'block' }}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="bg-gray-800 border border-gray-700 flex items-center justify-center rounded-md" style={{ width: '120px', height: '45px' }}>
                                    <span className="text-gray-500 text-xs">No Image</span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Game Title */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white text-base group-hover:text-blue-300 transition-colors truncate">
                                  {game.title}
                                </h3>
                              </div>
                              
                              {/* Release Date */}
                              <div className="w-24 text-center">
                                <span className="text-gray-400 text-sm">{game.releaseDate}</span>
                              </div>
                             
                             {/* Reviews */}
                             <div className="w-32 text-center">
                               {game.reviewSentiment && (
                                 <div className="space-y-0.5">
                                   <div className={`${getReviewColor(game.reviewSentiment)} font-medium text-xs`}>
                                     {game.reviewSentiment}
                                   </div>
                                   {game.reviewCount && (
                                     <div className="text-gray-500 text-xs">
                                       {formatReviewCount(game.reviewCount)}
                                     </div>
                                   )}
                                 </div>
                               )}
                             </div>
                             
                             {/* Price */}
                             <div className="w-20 text-center">
                               {game.isFree ? (
                                 <div className="inline-flex items-center px-2 py-1 bg-green-900/30 border border-green-800/60 text-green-300 rounded-md text-xs font-semibold">
                                   Free
                                 </div>
                               ) : (
                                 <div className="space-y-0.5">
                                   {game.discountPercent && (
                                     <div className="text-blue-300 text-xs font-bold">
                                       {game.discountPercent}
                                     </div>
                                   )}
                                   {game.originalPrice && (
                                     <div className="text-gray-500 line-through text-xs">
                                       {game.originalPrice}
                                     </div>
                                   )}
                                   <div className="text-white font-semibold text-sm">
                                     {game.price}
                                   </div>
                                 </div>
                               )}
                             </div>
                             
                             {/* Steam Link */}
                             <div className="w-10 flex justify-center">
                               {game.steamUrl && (
                                 <a 
                                   href={game.steamUrl} 
            target="_blank"
            rel="noopener noreferrer"
                                   className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-200 group/button hover:scale-105 shadow-md"
                                   title="View on Steam"
                                 >
                                   <svg className="w-4 h-4 group-hover/button:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                     <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169-.331-.486-.56-.886-.56H6.318c-.4 0-.717.229-.886.56L12 17.64l6.568-9.48z"/>
                                   </svg>
                                 </a>
                               )}
                             </div>
                             
                             {/* SteamPeek Link */}
                             <div className="w-10 flex justify-center">
                               {game.id && (
                                 <a 
                                   href={`https://steampeek.net/game/${game.id}`} 
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="inline-flex items-center justify-center w-8 h-8 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-all duration-200 group/button hover:scale-105 shadow-md"
                                   title="View on SteamPeek"
                                 >
                                   <svg className="w-4 h-4 group-hover/button:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
              <div className="text-center py-16">
                <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/60 rounded-xl p-8 max-w-sm mx-auto">
                  <div className="text-4xl mb-3">🎮</div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Games Found</h3>
                  <p className="text-gray-400 text-sm">Try selecting a different region or refreshing the data.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-gray-900/50 to-black border-t border-gray-800/60 py-12 mt-16" style={{ marginTop: '20px', paddingTop: '20px', paddingBottom: '30px' }}>
          <div className="w-full flex justify-center">
            <div className="max-w-4xl w-full mx-auto px-4">
              <div className="text-center space-y-4 flex flex-col items-center">
                <div className="inline-flex items-center gap-2.5 px-6 py-3 bg-purple-900/20 backdrop-blur border border-purple-800/40 rounded-lg text-sm">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse relative" style={{ left: '5px' }}></div>
                  <span className="text-gray-400">Live region based data by</span>
                  <a 
                    href="https://steampeek.net" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center hover:opacity-80 transition-opacity"
                  >
                    <img 
                      src="https://www.steampeek.net/logo.svg" 
                      alt="steampeek.net" 
                      className="h-5"
                    />
                  </a>
                </div>
                <div style={{ marginTop: '20px', marginBottom: '0px' }}></div>
                
                <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
                  Game data is sourced from Steam's publicly available charts and regional store listings. 
                  Updated in real-time with every request across 55+ supported regions.
                </p>
                
                <div className="flex flex-wrap items-center justify-center gap-4 text-gray-500 text-xs" style={{ marginTop: '15px', marginBottom: '20px' }}>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Real-time updates
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    55+ regions
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Public data only
                  </div>
                </div>
                
                <p className="text-gray-600 text-xs max-w-lg mx-auto">
                  This service is not affiliated with Valve Corporation or Steam. All game titles, images, and trademarks belong to their respective owners.
                </p>
              </div>
            </div>
          </div>
      </footer>
    </div>
    </>
  );
}

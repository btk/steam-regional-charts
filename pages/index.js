import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

const REGION_STORAGE_KEY = 'steampeek-selected-region';
const DEFAULT_REGION = 'us';

/* Locked table layout — keep `min-w-[970px]` and both `grid-cols-[…]` strings identical when editing. */

export default function Home({ initialRegion = '' }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(DEFAULT_REGION);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [regionInfo, setRegionInfo] = useState(null);
  const typeaheadBufferRef = useRef('');
  const typeaheadTimerRef = useRef(null);

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
        setLoading(false);
        return;
      }

      if (response.status === 400 && region !== DEFAULT_REGION) {
        try {
          localStorage.removeItem(REGION_STORAGE_KEY);
        } catch {
          /* ignore */
        }
        setSelectedRegion(DEFAULT_REGION);
        await fetchGames(DEFAULT_REGION);
        return;
      }

      setError(data.error || 'Failed to fetch games');
    } catch (err) {
      setError('Network error: ' + err.message);
    }

    setLoading(false);
  };

  const handleRegionChange = (newRegion) => {
    setSelectedRegion(newRegion);
    try {
      localStorage.setItem(REGION_STORAGE_KEY, newRegion);
    } catch {
      /* ignore */
    }

    try {
      if (typeof window !== 'undefined') {
        const nextPath = newRegion === DEFAULT_REGION ? '/' : `/region/${newRegion}/`;
        if (window.location.pathname !== nextPath) {
          window.history.replaceState(null, '', nextPath);
        }
      }
    } catch {
      /* ignore */
    }

    fetchGames(newRegion);
  };

  const getNextTypeaheadMatch = (query, currentCode) => {
    if (!query || !availableRegions.length) return null;

    const normalized = query.toLowerCase();
    const currentIndex = availableRegions.findIndex((region) => region.code === currentCode);
    const startIndex = currentIndex >= 0 ? (currentIndex + 1) % availableRegions.length : 0;

    const ordered = [
      ...availableRegions.slice(startIndex),
      ...availableRegions.slice(0, startIndex),
    ];

    return ordered.find((region) => {
      const name = region.name?.toLowerCase() || '';
      const code = region.code?.toLowerCase() || '';
      return name.startsWith(normalized) || code.startsWith(normalized);
    }) || null;
  };

  const handleRegionTypeahead = (event) => {
    if (event.key.length !== 1 || !/[a-z]/i.test(event.key)) return;

    event.preventDefault();

    if (typeaheadTimerRef.current) {
      clearTimeout(typeaheadTimerRef.current);
    }

    typeaheadBufferRef.current += event.key.toLowerCase();
    const match = getNextTypeaheadMatch(typeaheadBufferRef.current, selectedRegion);

    if (match) {
      handleRegionChange(match.code);
    }

    typeaheadTimerRef.current = setTimeout(() => {
      typeaheadBufferRef.current = '';
      typeaheadTimerRef.current = null;
    }, 700);
  };

  useEffect(() => {
    let initial = DEFAULT_REGION;

    const routeRegion = initialRegion?.trim().toLowerCase();
    if (routeRegion) {
      initial = routeRegion;
    }

    try {
      if (!routeRegion) {
        const stored = localStorage.getItem(REGION_STORAGE_KEY);
        if (stored) {
          const code = stored.trim().toLowerCase();
          if (code) initial = code;
        }
      } else {
        localStorage.setItem(REGION_STORAGE_KEY, routeRegion);
      }
    } catch {
      /* ignore */
    }
    setSelectedRegion(initial);
    fetchGames(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once using stored region, not selectedRegion
  }, []);

  useEffect(() => {
    return () => {
      if (typeaheadTimerRef.current) {
        clearTimeout(typeaheadTimerRef.current);
      }
    };
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

  const routeRegionCode = initialRegion?.trim().toLowerCase();
  const hasRouteRegion = Boolean(routeRegionCode && routeRegionCode !== DEFAULT_REGION);
  const seoRegionName = hasRouteRegion
    ? (regionInfo?.name || routeRegionCode.toUpperCase())
    : '';
  const seoTitle = hasRouteRegion
    ? `steampeek — Popular new Steam releases in ${seoRegionName}`
    : 'steampeek — Popular new Steam releases by region';
  const seoDescription = hasRouteRegion
    ? `Discover the most popular new Steam releases in ${seoRegionName}. Real-time data with regional pricing, reviews, and availability from steampeek.`
    : 'Discover the most popular new releases on Steam across different regions. Real-time data with pricing, reviews, and regional availability for 55+ countries — from steampeek.';
  const seoCanonicalUrl = hasRouteRegion
    ? `https://steampeek.net/region/${routeRegionCode}/`
    : 'https://steampeek.net';

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="steampeek, Steam, games, regional pricing, popular games, new releases, game charts, Steam statistics, gaming trends" />
        <meta name="author" content="steampeek" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoCanonicalUrl} />
        <meta property="og:image" content="https://steampeek.net/og-image.png" />
        <meta property="og:site_name" content="steampeek" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content="https://steampeek.net/og-image.png" />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="theme-color" content="#000000" />
        <link rel="canonical" href={seoCanonicalUrl} />
        
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
              name: 'steampeek',
              url: seoCanonicalUrl,
              description: seoDescription,
              applicationCategory: 'GameApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              creator: {
                '@type': 'Organization',
                name: 'steampeek',
                url: 'https://steampeek.net'
              }
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <header className="sticky top-0 z-50 w-full border-b border-gray-800/60 bg-black/80 backdrop-blur-md text-center">
          <div className="px-8 pb-10 pt-16 md:px-10 md:pb-12 md:pt-24" style={{ paddingTop: '10px' }}>
            <a
              href="https://steampeek.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-md"
              aria-label="steampeek — steampeek.net"
            >
              <img
                src="/logo.svg"
                alt="steampeek"
                width={168}
                height={37}
                className="block h-7 w-auto md:h-8"
              />
            </a>
          </div>
        </header>

        {/* Hero Section with Gradient Background */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-950/30 via-black to-purple-950/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/20 via-gray-900/10 to-transparent"></div>
          
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
          
          <div className="relative flex w-full justify-center pb-16 pt-16 md:pb-24 md:pt-24">
            <div className="mx-auto w-full max-w-5xl px-8 md:px-10">
              <div className="flex flex-col items-center gap-3 text-center md:gap-4">
                <h1 className="w-full text-xl font-semibold leading-snug tracking-tight text-gray-100 sm:text-2xl md:text-3xl md:whitespace-nowrap" style={{ marginTop: '10px',marginBottom: '0px' }}>
                  Popular new Steam releases by region
                </h1>
                <p className="mx-auto w-full max-w-[550px] text-sm leading-relaxed text-gray-400 md:text-base">
                  Discover the most popular new releases across Steam's global regions. Real-time data from Steam's public charts.
                </p>
                
                {/* Controls Card */}
                <div className="flex w-full justify-center px-2 sm:px-3" style={{ marginBottom: '20px' }}>
                  <div className="w-full max-w-2xl">
                    <div className="rounded-2xl bg-gray-900/30 px-7 py-7 backdrop-blur-xl sm:px-9 sm:py-8 md:px-10 md:py-10">
                      {/* Controls */}
                      <div className="flex flex-col items-center justify-center px-1 py-0 sm:px-3 sm:py-1">
                        <div className="w-full max-w-md">
                          <label className="mb-2 block text-center text-sm font-semibold tracking-wide text-gray-200 md:mb-3">
                            SELECT REGION
                          </label>
                          <div className="px-4 pb-6 pt-0 sm:px-6 sm:pb-8">
                            <div className="relative">
                              <select
                                value={selectedRegion}
                                onChange={(e) => handleRegionChange(e.target.value)}
                                onKeyDown={handleRegionTypeahead}
                                disabled={loading}
                                className="w-full cursor-pointer appearance-none rounded-2xl border border-gray-700/50 bg-gradient-to-r from-gray-800/80 to-gray-900/80 px-8 py-6 pr-16 text-center text-xl font-bold text-white shadow-xl backdrop-blur transition-all duration-300 hover:scale-105 hover:border-gray-600/50 hover:from-gray-700/80 hover:to-gray-800/80 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/40 focus:from-gray-700/90 focus:to-gray-800/90 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {availableRegions.map((region) => (
                                  <option key={region.code} value={region.code} className="bg-black py-3 text-lg">
                                    {region.flag} {region.name}
                                  </option>
                                ))}
                              </select>
                              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                                <svg className="h-7 w-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full flex justify-center">
          <div className="mx-auto w-full max-w-5xl px-8 pb-20 pt-10 md:px-10 md:pb-24 md:pt-14">
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
                
                <div className="mx-auto mb-12 mt-14 w-full max-w-5xl overflow-hidden border border-gray-800/60 bg-gray-900/30 pt-3 shadow-2xl backdrop-blur-sm md:mt-20 md:pt-4">
                  {/* Horizontal Scroll Wrapper — min width locked with grid below */}
                  <div className="overflow-x-auto">
                    <div className="min-w-[970px]">
                      {/* Table header (grid locked — see file top comment) */}
                      <div className="border-b border-gray-800/60 bg-gray-900/60 px-8 py-4 backdrop-blur md:px-6">
                        <div className="grid grid-cols-[44px_128px_minmax(120px,0.95fr)_96px_128px_80px_40px_56px] gap-x-3 font-semibold text-xs text-gray-300 uppercase tracking-wider items-center">
                          <div className="flex justify-center tabular-nums">Rank</div>
                          <div>Image</div>
                          <div className="min-w-0">Game</div>
                          <div className="w-full text-center">Date</div>
                          <div className="w-full text-center">Reviews</div>
                          <div className="w-full text-center">Price</div>
                          <div className="w-full text-center">Link</div>
                          <div className="w-full text-center">steamdb</div>
                        </div>
                      </div>
                      
                      {/* Table Body */}
                      <div className="divide-y divide-gray-800/60">
                        {games.map((game, index) => (
                          <div key={game.id || game.rank} className="px-8 py-3 transition-all duration-200 group hover:bg-gray-800/30 md:px-6">
                            <div className="grid grid-cols-[44px_128px_minmax(120px,0.95fr)_96px_128px_80px_40px_56px] gap-x-3 items-center">
                              {/* Rank */}
                              <div className="flex justify-center">
                                <div className="inline-flex size-8 items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg font-bold text-white text-sm tabular-nums group-hover:border-gray-600 transition-colors">
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
                              <div className="min-w-0 pr-1">
                                <h3 className="font-semibold text-white text-base group-hover:text-blue-300 transition-colors truncate">
                                  {game.title}
                                </h3>
                              </div>
                              
                              {/* Release Date */}
                              <div className="w-full text-center">
                                <span className="text-gray-400 text-sm">{game.releaseDate}</span>
                              </div>
                             
                             {/* Reviews */}
                             <div className="w-full text-center">
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
                             <div className="w-full text-center">
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
                             <div className="flex w-full justify-center">
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
                             
                             {/* SteamDB link */}
                             <div className="flex w-full justify-center">
                               {game.id && (
                                 <a
                                   href={`https://steamdb.info/app/${game.id}/`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="inline-flex items-center justify-center w-8 h-8 bg-orange-700 hover:bg-orange-600 text-white rounded-lg transition-all duration-200 group/button hover:scale-105 shadow-md"
                                   title="View on SteamDB"
                                 >
                                   <svg className="w-4 h-4 group-hover/button:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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
            <div className="mx-auto w-full max-w-4xl px-8 md:px-10">
              <div className="mx-4 flex flex-col items-center space-y-4 px-4 text-center md:mx-6 md:px-6">
                <div className="inline-flex items-center gap-2 rounded-lg border border-purple-800/40 bg-purple-900/20 px-4 py-2 text-sm backdrop-blur">
                  <div className="ml-1 h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-gray-400">Live region based data by</span>
                  <a 
                    href="https://steampeek.net" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center hover:opacity-80 transition-opacity"
                  >
                    <img
                      src="/logo.svg"
                      alt="steampeek"
                      width={168}
                      height={37}
                      className="h-4 w-auto"
                    />
                  </a>
                </div>
                <div style={{ marginTop: '20px', marginBottom: '0px' }}></div>
                
                <p className="mx-auto w-full max-w-[calc(100%-2rem)] px-6 text-sm leading-relaxed text-gray-400 sm:max-w-xl sm:px-8">
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

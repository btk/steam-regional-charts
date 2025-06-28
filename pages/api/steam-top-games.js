import * as cheerio from 'cheerio';

// Steam region mapping - Comprehensive list of Steam-supported regions
const STEAM_REGIONS = {
  // North America
  us: { code: 'us', name: 'United States', currency: '$', flag: '🇺🇸' },
  ca: { code: 'ca', name: 'Canada', currency: 'CDN$', flag: '🇨🇦' },
  mx: { code: 'mx', name: 'Mexico', currency: 'Mex$', flag: '🇲🇽' },
  
  // Europe
  uk: { code: 'uk', name: 'United Kingdom', currency: '£', flag: '🇬🇧' },
  de: { code: 'de', name: 'Germany', currency: '€', flag: '🇩🇪' },
  fr: { code: 'fr', name: 'France', currency: '€', flag: '🇫🇷' },
  it: { code: 'it', name: 'Italy', currency: '€', flag: '🇮🇹' },
  es: { code: 'es', name: 'Spain', currency: '€', flag: '🇪🇸' },
  nl: { code: 'nl', name: 'Netherlands', currency: '€', flag: '🇳🇱' },
  pl: { code: 'pl', name: 'Poland', currency: 'zł', flag: '🇵🇱' },
  ru: { code: 'ru', name: 'Russia', currency: 'pуб', flag: '🇷🇺' },
  tr: { code: 'tr', name: 'Turkey', currency: '₺', flag: '🇹🇷' },
  se: { code: 'se', name: 'Sweden', currency: 'kr', flag: '🇸🇪' },
  no: { code: 'no', name: 'Norway', currency: 'kr', flag: '🇳🇴' },
  dk: { code: 'dk', name: 'Denmark', currency: 'kr', flag: '🇩🇰' },
  fi: { code: 'fi', name: 'Finland', currency: '€', flag: '🇫🇮' },
  ch: { code: 'ch', name: 'Switzerland', currency: 'CHF', flag: '🇨🇭' },
  at: { code: 'at', name: 'Austria', currency: '€', flag: '🇦🇹' },
  be: { code: 'be', name: 'Belgium', currency: '€', flag: '🇧🇪' },
  pt: { code: 'pt', name: 'Portugal', currency: '€', flag: '🇵🇹' },
  gr: { code: 'gr', name: 'Greece', currency: '€', flag: '🇬🇷' },
  cz: { code: 'cz', name: 'Czech Republic', currency: 'Kč', flag: '🇨🇿' },
  hu: { code: 'hu', name: 'Hungary', currency: 'Ft', flag: '🇭🇺' },
  ro: { code: 'ro', name: 'Romania', currency: 'lei', flag: '🇷🇴' },
  bg: { code: 'bg', name: 'Bulgaria', currency: 'лв', flag: '🇧🇬' },
  hr: { code: 'hr', name: 'Croatia', currency: 'kn', flag: '🇭🇷' },
  sk: { code: 'sk', name: 'Slovakia', currency: '€', flag: '🇸🇰' },
  si: { code: 'si', name: 'Slovenia', currency: '€', flag: '🇸🇮' },
  lt: { code: 'lt', name: 'Lithuania', currency: '€', flag: '🇱🇹' },
  lv: { code: 'lv', name: 'Latvia', currency: '€', flag: '🇱🇻' },
  ee: { code: 'ee', name: 'Estonia', currency: '€', flag: '🇪🇪' },
  ua: { code: 'ua', name: 'Ukraine', currency: '₴', flag: '🇺🇦' },
  
  // Asia-Pacific
  jp: { code: 'jp', name: 'Japan', currency: '¥', flag: '🇯🇵' },
  kr: { code: 'kr', name: 'South Korea', currency: '₩', flag: '🇰🇷' },
  cn: { code: 'cn', name: 'China', currency: '¥', flag: '🇨🇳' },
  hk: { code: 'hk', name: 'Hong Kong', currency: 'HK$', flag: '🇭🇰' },
  tw: { code: 'tw', name: 'Taiwan', currency: 'NT$', flag: '🇹🇼' },
  sg: { code: 'sg', name: 'Singapore', currency: 'S$', flag: '🇸🇬' },
  my: { code: 'my', name: 'Malaysia', currency: 'RM', flag: '🇲🇾' },
  th: { code: 'th', name: 'Thailand', currency: '฿', flag: '🇹🇭' },
  id: { code: 'id', name: 'Indonesia', currency: 'Rp', flag: '🇮🇩' },
  ph: { code: 'ph', name: 'Philippines', currency: '₱', flag: '🇵🇭' },
  vn: { code: 'vn', name: 'Vietnam', currency: '₫', flag: '🇻🇳' },
  in: { code: 'in', name: 'India', currency: '₹', flag: '🇮🇳' },
  au: { code: 'au', name: 'Australia', currency: 'AUD', flag: '🇦🇺' },
  nz: { code: 'nz', name: 'New Zealand', currency: 'NZ$', flag: '🇳🇿' },
  
  // South America
  br: { code: 'br', name: 'Brazil', currency: 'R$', flag: '🇧🇷' },
  ar: { code: 'ar', name: 'Argentina', currency: 'ARS$', flag: '🇦🇷' },
  cl: { code: 'cl', name: 'Chile', currency: 'CLP$', flag: '🇨🇱' },
  co: { code: 'co', name: 'Colombia', currency: 'COL$', flag: '🇨🇴' },
  pe: { code: 'pe', name: 'Peru', currency: 'S/', flag: '🇵🇪' },
  uy: { code: 'uy', name: 'Uruguay', currency: '$U', flag: '🇺🇾' },
  
  // Middle East & Africa
  il: { code: 'il', name: 'Israel', currency: '₪', flag: '🇮🇱' },
  ae: { code: 'ae', name: 'UAE', currency: 'د.إ', flag: '🇦🇪' },
  sa: { code: 'sa', name: 'Saudi Arabia', currency: 'SR', flag: '🇸🇦' },
  kw: { code: 'kw', name: 'Kuwait', currency: 'KD', flag: '🇰🇼' },
  qa: { code: 'qa', name: 'Qatar', currency: 'QR', flag: '🇶🇦' },
  za: { code: 'za', name: 'South Africa', currency: 'R', flag: '🇿🇦' }
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get region from query parameter, default to US
    const region = req.query.region?.toLowerCase() || 'us';
    
    // Validate region
    if (!STEAM_REGIONS[region]) {
      return res.status(400).json({ 
        error: 'Invalid region', 
        availableRegions: Object.keys(STEAM_REGIONS),
        message: `Region '${region}' is not supported. Available regions: ${Object.keys(STEAM_REGIONS).join(', ')}`
      });
    }

    const selectedRegion = STEAM_REGIONS[region];
    
    // Steam URL for popular new releases sorted by release date (with region)
    const steamUrl = `https://store.steampowered.com/search/?filter=popularnew&sort_by=Released_DESC&os=win&cc=${selectedRegion.code}`;
    
    // Fetch the Steam page with headers to appear as request from selected region
    const response = await fetch(steamUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'Connection': 'keep-alive',
        'DNT': '1',
        // Additional headers to indicate selected region
        'CF-IPCountry': selectedRegion.code.toUpperCase(),
        'X-Forwarded-For': '8.8.8.8',
        'X-Real-IP': '8.8.8.8'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const games = [];
    
    // Try to find search result rows - Steam uses specific structure
    const searchResults = $('a[data-ds-appid], .search_result_row');
    
    searchResults.each((index, element) => {
      if (games.length >= 30) return false; // Stop after 30 games
      
      const $game = $(element);
      const href = $game.attr('href') || $game.find('a').first().attr('href');
      
      // Skip if not a proper game link
      if (!href || !href.includes('/app/')) return;
      
      // Extract game ID from URL
      const gameIdMatch = href.match(/\/app\/(\d+)/);
      const gameId = gameIdMatch ? gameIdMatch[1] : null;
      
      // Find the game title - try multiple selectors
      let title = '';
      const titleSelectors = [
        '.title',
        '.search_name .title', 
        'h4',
        '.name',
        '.search_name',
        '[data-ds-tagids] .title'
      ];
      
      for (const titleSel of titleSelectors) {
        const titleEl = $game.find(titleSel).first();
        if (titleEl.length && titleEl.text().trim()) {
          title = titleEl.text().trim();
          break;
        }
      }
      
      // Skip if no title found
      if (!title) return;
      
      // Find game image/capsule
      let imageUrl = '';
      const imgSelectors = [
        '.search_capsule img',
        '.col.search_capsule img', 
        'img[src*="capsule"]',
        '.search_result_row img',
        'img'
      ];
      
      for (const imgSel of imgSelectors) {
        const imgEl = $game.find(imgSel).first();
        if (imgEl.length) {
          imageUrl = imgEl.attr('src') || imgEl.attr('data-src') || '';
          if (imageUrl && imageUrl.includes('capsule')) break;
        }
      }
      
      // Enhanced pricing extraction based on actual Steam HTML structure
      let price = 'Unknown';
      let originalPrice = null;
      let discountPercent = null;
      let isFree = false;
      
      // Look for the main price container that Steam uses
      const priceContainer = $game.find('.search_price_discount_combined, .col.search_price').first();
      
      if (priceContainer && priceContainer.length) {
        // Check for free games first
        const freeElement = priceContainer.find('.discount_final_price.free, .free');
        if (freeElement.length) {
          price = 'Free';
          isFree = true;
        } else {
          // Look for discount percentage
          const discountPctEl = priceContainer.find('.discount_pct');
          if (discountPctEl.length) {
            discountPercent = discountPctEl.text().trim();
          }
          
          // Look for original price
          const originalPriceEl = priceContainer.find('.discount_original_price');
          if (originalPriceEl.length) {
            originalPrice = originalPriceEl.text().trim();
          }
          
          // Look for final price
          const finalPriceEl = priceContainer.find('.discount_final_price');
          if (finalPriceEl.length && !finalPriceEl.hasClass('free')) {
            price = finalPriceEl.text().trim();
          }
          
          // If no specific price structure found, try to extract from text
          if (price === 'Unknown') {
            const fullPriceText = priceContainer.text().trim();
            
            // Try to find price patterns
            const pricePatterns = [
              /\$[\d,]+\.?\d*/g,
              /€[\d,]+\.?\d*/g,
              /£[\d,]+\.?\d*/g,
              /¥[\d,]+\.?\d*/g,
              /฿[\d,]+\.?\d*/g,
              /₹[\d,]+\.?\d*/g,
              /₩[\d,]+\.?\d*/g,
              /₺[\d,]+\.?\d*/g,
              /R\$[\d,]+\.?\d*/g,
              /CDN\$[\d,]+\.?\d*/g,
              /AUD[\d,]+\.?\d*/g,
              /Mex\$[\d,]+\.?\d*/g,
              /pуб[\d,]+\.?\d*/g,
              /[\d,]+\.?\d*\s*(USD|EUR|GBP|THB|JPY|KRW|INR|TRY|BRL|CAD|AUD|MXN|RUB)/g
            ];
            
            let foundPrices = [];
            for (const pattern of pricePatterns) {
              const matches = fullPriceText.match(pattern);
              if (matches) {
                foundPrices = foundPrices.concat(matches);
              }
            }
            
            if (foundPrices.length > 0) {
              // Take the last price found (usually the final price)
              price = foundPrices[foundPrices.length - 1];
              
              // If we have multiple prices, the first might be original price
              if (foundPrices.length > 1 && !originalPrice) {
                originalPrice = foundPrices[0];
              }
            } else if (fullPriceText.toLowerCase().includes('free')) {
              price = 'Free';
              isFree = true;
            }
          }
        }
      }
      
      // Find release date
      let releaseDate = 'Unknown';
      const releaseDateSelectors = [
        '.search_released',
        '.col.search_released',
        '.release_date'
      ];
      
      for (const relSel of releaseDateSelectors) {
        const releaseDateEl = $game.find(relSel).first();
        if (releaseDateEl.length && releaseDateEl.text().trim()) {
          releaseDate = releaseDateEl.text().trim();
          break;
        }
      }
      
      // Find platforms
      const platformElements = $game.find('.platform_img, .search_result_icons img, .platforms img');
      const platforms = [];
      platformElements.each((i, platformEl) => {
        const platform = $(platformEl).attr('class') || $(platformEl).attr('src') || '';
        if (platform.toLowerCase().includes('win')) platforms.push('Windows');
        if (platform.toLowerCase().includes('mac')) platforms.push('Mac');
        if (platform.toLowerCase().includes('linux')) platforms.push('Linux');
      });
      
      // Default to Windows if no platforms detected
      if (platforms.length === 0) {
        platforms.push('Windows');
      }

      // Extract review information
      let reviewSentiment = null;
      let reviewCount = null;
      
      // Look for review summary
      const reviewSummaryEl = $game.find('.search_review_summary');
      if (reviewSummaryEl.length) {
        const tooltipHtml = reviewSummaryEl.attr('data-tooltip-html');
        if (tooltipHtml) {
          // Extract sentiment from tooltip (e.g., "Very Positive", "Mixed", etc.)
          const sentimentMatch = tooltipHtml.match(/^([^<]+)/);
          if (sentimentMatch) {
            reviewSentiment = sentimentMatch[1].trim();
          }
          
          // Extract review count from tooltip (e.g., "95% of the 2,767 user reviews")
          const reviewCountMatch = tooltipHtml.match(/(\d{1,3}(?:,\d{3})*)\s+user\s+reviews?/i);
          if (reviewCountMatch) {
            reviewCount = parseInt(reviewCountMatch[1].replace(/,/g, ''));
          }
        }
      }
      
      // If no review data found in tooltip, try other selectors
      if (!reviewSentiment) {
        const reviewTextEl = $game.find('.search_review_summary span, .review_summary');
        if (reviewTextEl.length) {
          reviewSentiment = reviewTextEl.text().trim();
        }
      }

      // Create game object
      const gameData = {
        id: gameId,
        title: title,
        price: price,
        originalPrice: originalPrice,
        discountPercent: discountPercent,
        isFree: isFree,
        releaseDate: releaseDate,
        platforms: platforms,
        imageUrl: imageUrl,
        reviewSentiment: reviewSentiment,
        reviewCount: reviewCount,
        steamUrl: href.startsWith('http') ? href : `https://store.steampowered.com${href}`,
        rank: games.length + 1
      };
      
      games.push(gameData);
    });

    // If still no games found, try a more general approach
    if (games.length === 0) {
      // Look for any app links and extract basic info
      $('a[href*="/app/"]').slice(0, 30).each((index, element) => {
        const $link = $(element);
        const href = $link.attr('href');
        const gameIdMatch = href ? href.match(/\/app\/(\d+)/) : null;
        
        if (gameIdMatch) {
          const title = $link.text().trim() || $link.find('.title, .name').text().trim() || `Game ${gameIdMatch[1]}`;
          
          games.push({
            id: gameIdMatch[1],
            title: title,
            price: 'Unknown',
            originalPrice: null,
            discountPercent: null,
            isFree: false,
            releaseDate: 'Unknown',
            platforms: ['Windows'],
            imageUrl: '',
            reviewSentiment: null,
            reviewCount: null,
            steamUrl: href.startsWith('http') ? href : `https://store.steampowered.com${href}`,
            rank: games.length + 1
          });
        }
      });
    }

    // Return the results
    res.status(200).json({
      success: true,
      count: games.length,
      timestamp: new Date().toISOString(),
      region: {
        code: selectedRegion.code,
        name: selectedRegion.name,
        currency: selectedRegion.currency
      },
      source: `Steam Store - Popular New Releases (${selectedRegion.name})`,
      games: games,
      availableRegions: Object.entries(STEAM_REGIONS).map(([code, info]) => ({
        code,
        name: info.name,
        currency: info.currency
      }))
    });

  } catch (error) {
    console.error('Error fetching Steam data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Steam data',
      message: error.message
    });
  }
}

// Export available regions for use in frontend
export { STEAM_REGIONS }; 
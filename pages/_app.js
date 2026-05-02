import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';

import '@/styles/globals.css';

const GA_MEASUREMENT_ID = 'G-CJFHP6212L';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const onRouteChange = (url) => {
      if (typeof window.gtag !== 'function') return;
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      });
    };

    router.events.on('routeChangeComplete', onRouteChange);
    return () => {
      router.events.off('routeChangeComplete', onRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Component {...pageProps} />
    </>
  );
}

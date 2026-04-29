/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "steam-regional-charts.t8l.dev",
          },
        ],
        destination: "https://steampeek.net/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

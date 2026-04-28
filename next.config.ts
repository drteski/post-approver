import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	serverExternalPackages: ['ssh2'],
	images: {
		remotePatterns: [new URL('https://files.lazienka-rea.com.pl/**')]
	}
};

export default nextConfig;

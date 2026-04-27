import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	serverExternalPackages: ["ssh2"],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'files.lazienka-rea.com.pl',
				port: '',
				pathname: '/posts/**'
			}
		]
	}
};

export default nextConfig;

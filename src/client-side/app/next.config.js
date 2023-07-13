	/** @type {import('next').NextConfig} */
	const nextConfig = {
		async rewrites() {
			return [
				{
					source: '/avatar/:path*',
					destination: `${process.env.NEXT_PUBLIC_FILE_SERVICE}/:path*`,
				},
			]
		},
		env: {
			developer_mode: process.env.DEV? process.env.DEV : "",
			intraLink: process.env.INTRA_LINK? process.env.INTRA_LINK : "",
			next_public_intra_link: process.env.NEXT_PUBLIC_INTRA_LINK? process.env.NEXT_PUBLIC_INTRA_LINK : "",
		},
		images: {
			domains: ['localhost', `${process.env.NEXT_PUBLIC_HOST_NAME}`, "cdn.intra.42.fr", `${process.env.NEXT_PUBLIC_FILE_SERVICE}`],
			minimumCacheTTL: 3,
		},
		experimental: {
			serverActions: true,
		},
		serverRuntimeConfig: {
			// Will only be available on the server side
			backend_api_url: process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL,
			sample: 'sample'
		}
	}

	module.exports = nextConfig

	/** @type {import('next').NextConfig} */
	const nextConfig = {
		// async rewrites() {
		// 	return [
		// 		{
		// 			source: '/avatar/',
		// 			destination: '/avatar/',
		// 		},
		// 		{
		// 			source: '/:any*',
		// 			destination: '/',
		// 		}
		// 	]
		// },
		env: {
			developer_mode: process.env.DEV? process.env.DEV : "",
			intraLink: process.env.INTRA_LINK? process.env.INTRA_LINK : "",
			next_public_intra_link: process.env.NEXT_PUBLIC_INTRA_LINL? process.env.NEXT_PUBLIC_INTRA_LINL : "",
		},
		images: {
			domains: ['localhost', `${process.env.NEXT_PUBLIC_HOST_NAME}`, "cdn.intra.42.fr"],
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

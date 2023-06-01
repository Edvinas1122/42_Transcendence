/*
  Configuring CORS
  https://docs.nestjs.com/security/cors
  allows api to be accessed from localhost:3030 - frontend
*/
export const corsConfig = {
	origin: process.env.NEXT_PUBLIC_FRONTEND_API_BASE_URL,
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
	credentials: true,
  };
/*
  Configuring CORS
  https://docs.nestjs.com/security/cors
  allows api to be accessed from localhost:3030 - frontend
*/
export const corsConfig = {
	origin: [process.env.FRONT_END_API, "https://next-app:3030"],
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
	credentials: true,
  };
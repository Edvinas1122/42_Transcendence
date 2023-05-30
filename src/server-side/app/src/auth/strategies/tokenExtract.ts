export const extractTokenFromHeaders = (req) => {
	let token = null;
	console.log(req.headers);
	if (req && req.headers && req.headers.authorization) {
		console.log(req.headers.authorization);
	  const authHeader = req.headers.authorization;
	  const tokenType = 'Bearer';
	  if (authHeader.startsWith(tokenType)) {
		token = authHeader.substring(tokenType.length).trim();
	  }
	}
	return token;
  };

export const extractCookieFromHeaders = (req) => 
{
	let token = null;
	if (req && req.cookies) {
		token = req.cookies['access_token'];
	}
	return token;
};

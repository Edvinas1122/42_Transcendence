

const getTokenAndSetCookie = async (tokenAccessInquiryId: string): Promise<void> => {
    const response = await fetch(`http://localhost:3000/auth/token?tmp_id=${tokenAccessInquiryId}`);
    const data: {token: string} = await response.json();
    const token = data.token;

	console.log('Setting cookie...' + token);
}

const OAuthCallback: React.FC = () => {
	useEffect(() => {
	  const url = new URL(window.location.href);
	  const tokenAccessInquiryId = url.searchParams.get('retrieveToken');
	
	  if (tokenAccessInquiryId) {
		getTokenAndSetCookie(tokenAccessInquiryId);
	  }
	}, []);
};
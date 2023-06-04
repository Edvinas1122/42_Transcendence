import fetchWithToken from '../auth/fetchWithToken';

const sendFriendRequest = async (receiverId) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: receiverId })
    };

    return fetchWithToken('/users/manage/send-friend-request', requestOptions)
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

const getLastFriendRequests = async () => {
    try {
        const response = await fetchWithToken('/users/manage/get-last-pending-friend-request');
        
        console.log(response as string);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch(error) {
        console.error('Error:', error);
    }
}

export default sendFriendRequest;
export { getLastFriendRequests };
import fetchWithToken from '../auth/fetchWithToken';

function sendFriendRequest(receiverId) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId })
    };

    return fetchWithToken('/users/manage/send-friend-request', requestOptions)
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

export default sendFriendRequest;
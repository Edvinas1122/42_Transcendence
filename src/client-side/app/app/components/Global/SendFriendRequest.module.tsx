import fetchWithToken from '@/app/network/fetchWithToken';

const sendFriendRequest = async (receiverId, token) => {
    console.log("token here: ", token);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: receiverId })
    };

    return fetchWithToken(`/users/manage/send-friend-request/${receiverId}`, token, requestOptions)
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
};

export default sendFriendRequest;